package com.actforgood.payment.service;

import com.actforgood.payment.client.BlockchainClient;
import com.actforgood.payment.client.CampaignClient;
import com.actforgood.payment.dto.CreatePaymentRequest;
import com.actforgood.payment.dto.PaymentDTO;
import com.actforgood.payment.exception.ResourceNotFoundException;
import com.actforgood.payment.exception.ValidationException;
import com.actforgood.payment.model.Payment;
import com.actforgood.payment.repository.PaymentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Payment Service - Gère le traitement des paiements et donations
 * Intègre les clients Blockchain et Campaign pour la traceabilité et mise à jour des campagnes
 */
@Service
@Transactional
@Slf4j
public class PaymentService {

    private static final BigDecimal MINIMUM_AMOUNT = BigDecimal.valueOf(500);

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CampaignClient campaignClient;

    @Autowired
    private BlockchainClient blockchainClient;

    @Autowired
    private PaymentProcessor paymentProcessor;

    // ==================== Payment Processing ====================

    /**
     * Traite un paiement : validation → save → processing → blockchain → campaign update
     */
    public PaymentDTO processPayment(CreatePaymentRequest request) {
        log.info("Processing payment for donor: {} on campaign: {} amount: {}",
                 request.getDonorId(), request.getCampaignId(), request.getAmount());

        validatePaymentRequest(request);

        // Create payment entity
        Payment payment = new Payment();
        payment.setDonorId(request.getDonorId());
        payment.setCampaignId(request.getCampaignId());
        payment.setAmount(request.getAmount());
        payment.setMethod(Payment.PaymentMethod.valueOf(request.getMethod()));
        payment.setProvider(Payment.PaymentProvider.valueOf(request.getProvider()));
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setTransactionId(request.getTransactionId());

        // Save initial payment
        payment = paymentRepository.save(payment);
        log.debug("Payment saved with id: {}", payment.getId());

        // Process payment through payment processor
        Payment processed = paymentProcessor.process(payment);
        log.debug("Payment processing completed with status: {}", processed.getStatus());

        // If successful, update campaign and record on blockchain
        if (processed.isCompleted()) {
            try {
                campaignClient.updateCampaignAmount(
                    processed.getCampaignId().toString(),
                    processed.getAmount().doubleValue()
                );
                log.debug("Campaign amount updated");

                String blockchainHash = blockchainClient.recordTransaction(processed);
                processed.setBlockchainHash(blockchainHash);
                log.debug("Transaction recorded on blockchain: {}", blockchainHash);
            } catch (Exception e) {
                log.error("Error updating campaign or recording blockchain: {}", e.getMessage(), e);
                // Payment is still valid, just blockchain recording failed
                // Could implement retry logic here
            }
        }

        processed = paymentRepository.save(processed);
        log.info("Payment processed successfully with id: {}", processed.getId());

        return convertToDTO(processed);
    }

    // ==================== Payment Retrieval ====================

    @Transactional(readOnly = true)
    public PaymentDTO getPaymentById(UUID id) {
        log.debug("Fetching payment: {}", id);

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", id.toString()));

        return convertToDTO(payment);
    }

    @Transactional(readOnly = true)
    public Page<PaymentDTO> getAllPayments(Pageable pageable) {
        log.info("Fetching all payments with pagination: page={}, size={}",
                 pageable.getPageNumber(), pageable.getPageSize());

        return paymentRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<PaymentDTO> getPaymentsByDonor(UUID donorId, Pageable pageable) {
        log.info("Fetching payments for donor: {}", donorId);

        return paymentRepository.findByDonorId(donorId, pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<PaymentDTO> getPaymentsByCampaign(UUID campaignId, Pageable pageable) {
        log.info("Fetching payments for campaign: {}", campaignId);

        return paymentRepository.findByCampaignId(campaignId, pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<PaymentDTO> getPaymentsByStatus(Payment.PaymentStatus status, Pageable pageable) {
        log.info("Fetching payments by status: {}", status);

        return paymentRepository.findByStatus(status, pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<PaymentDTO> getPaymentsByDonorAndStatus(UUID donorId, Payment.PaymentStatus status, Pageable pageable) {
        log.info("Fetching payments for donor: {} with status: {}", donorId, status);

        return paymentRepository.findPaymentsByDonorAndStatus(donorId, status, pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<PaymentDTO> getCompletedPayments(Pageable pageable) {
        log.info("Fetching completed payments");

        return paymentRepository.findCompletedPayments(pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public PaymentDTO getPaymentByTransactionId(String transactionId) {
        log.debug("Fetching payment by transaction id: {}", transactionId);

        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", transactionId));

        return convertToDTO(payment);
    }

    // ==================== Payment Refunds ====================

    @Transactional
    public PaymentDTO refundPayment(UUID paymentId) {
        log.info("Refunding payment: {}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", paymentId.toString()));

        if (!payment.isCompleted()) {
            log.warn("Cannot refund payment {}: not completed (status: {})", paymentId, payment.getStatus());
            throw new ValidationException("Seul un paiement complété peut être remboursé");
        }

        payment.refund();
        payment = paymentRepository.save(payment);
        log.info("Payment refunded successfully: {}", paymentId);

        return convertToDTO(payment);
    }

    // ==================== Validation ====================

    private void validatePaymentRequest(CreatePaymentRequest request) {
        if (request.getAmount().compareTo(MINIMUM_AMOUNT) < 0) {
            log.warn("Validation failed: amount {} is less than minimum {}", request.getAmount(), MINIMUM_AMOUNT);
            throw new ValidationException("Le montant minimum de donation est " + MINIMUM_AMOUNT);
        }

        try {
            Payment.PaymentMethod.valueOf(request.getMethod());
            Payment.PaymentProvider.valueOf(request.getProvider());
        } catch (IllegalArgumentException e) {
            log.warn("Validation failed: invalid payment method or provider");
            throw new ValidationException("Méthode ou fournisseur de paiement invalide");
        }
    }

    // ==================== Helper Methods ====================

    private PaymentDTO convertToDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .donorId(payment.getDonorId())
                .campaignId(payment.getCampaignId())
                .amount(payment.getAmount())
                .method(payment.getMethod().name())
                .provider(payment.getProvider().name())
                .status(payment.getStatus().name())
                .transactionId(payment.getTransactionId())
                .blockchainHash(payment.getBlockchainHash())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}

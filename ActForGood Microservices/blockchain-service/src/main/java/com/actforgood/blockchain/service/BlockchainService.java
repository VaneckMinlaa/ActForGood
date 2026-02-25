package com.actforgood.blockchain.service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.actforgood.blockchain.dto.BlockchainTransactionDTO;
import com.actforgood.blockchain.dto.RecordTransactionRequest;
import com.actforgood.blockchain.exception.ResourceNotFoundException;
import com.actforgood.blockchain.model.BlockchainTransaction;
import com.actforgood.blockchain.repository.BlockchainTransactionRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Blockchain Service - Gère l'enregistrement et la vérification des
 * transactions sur la blockchain
 * Utilise SHA-256 pour le hashing et une chaîne de blocs simple
 */
@Service
@Transactional
@Slf4j
public class BlockchainService {

    @Autowired
    private BlockchainTransactionRepository repository;

    /**
     * Enregistre une transaction sur la blockchain
     */
    public BlockchainTransactionDTO recordTransaction(RecordTransactionRequest request) {
        log.info("Recording transaction for payment: {} on campaign: {}", request.getPaymentId(),
                request.getCampaignId());

        BlockchainTransaction transaction = new BlockchainTransaction();
        transaction.setPaymentId(request.getPaymentId());
        transaction.setDonorId(request.getDonorId());
        transaction.setCampaignId(request.getCampaignId());
        transaction.setAmount(request.getAmount());

        // Get previous hash from last transaction
        String previousHash = getLastTransactionHash();
        transaction.setPreviousHash(previousHash);

        // Calculate hash for this transaction
        String hash = calculateHash(transaction);
        transaction.setHash(hash);

        // Set status to CONFIRMED (simplified - in production would need consensus)
        transaction.setStatus(BlockchainTransaction.TransactionStatus.CONFIRMED);

        transaction = repository.save(transaction);
        log.info("Transaction recorded successfully: {} with hash: {}", transaction.getId(), hash);

        return convertToDTO(transaction);
    }

    /**
     * Enregistre une transaction depuis un objet Payment JSON
     */
    public String recordPaymentTransaction(Object paymentObject) {
        log.debug("Recording payment transaction from object");

        RecordTransactionRequest request = extractTransactionRequest(paymentObject);
        BlockchainTransactionDTO dto = recordTransaction(request);

        return dto.getHash();
    }

    /**
     * Récupère une transaction par son hash
     */
    @Transactional(readOnly = true)
    public BlockchainTransactionDTO getTransactionByHash(String hash) {
        log.debug("Fetching transaction by hash: {}", hash);

        BlockchainTransaction transaction = repository.findByHash(hash)
                .orElseThrow(() -> new ResourceNotFoundException("BlockchainTransaction", hash));

        return convertToDTO(transaction);
    }

    /**
     * Récupère une transaction par son ID
     */
    @Transactional(readOnly = true)
    public BlockchainTransactionDTO getTransactionById(UUID id) {
        log.debug("Fetching transaction: {}", id);

        BlockchainTransaction transaction = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BlockchainTransaction", id.toString()));

        return convertToDTO(transaction);
    }

    /**
     * Récupère les transactions d'un paiement
     */
    @Transactional(readOnly = true)
    public Page<BlockchainTransactionDTO> getTransactionsByPayment(UUID paymentId, Pageable pageable) {
        log.info("Fetching transactions for payment: {}", paymentId);

        return repository.findByPaymentId(paymentId, pageable).map(this::convertToDTO);
    }

    /**
     * Récupère les transactions d'un donateur
     */
    @Transactional(readOnly = true)
    public Page<BlockchainTransactionDTO> getTransactionsByDonor(UUID donorId, Pageable pageable) {
        log.info("Fetching transactions for donor: {}", donorId);

        return repository.findByDonorId(donorId, pageable).map(this::convertToDTO);
    }

    /**
     * Récupère les transactions d'une campagne
     */
    @Transactional(readOnly = true)
    public Page<BlockchainTransactionDTO> getTransactionsByCampaign(UUID campaignId, Pageable pageable) {
        log.info("Fetching transactions for campaign: {}", campaignId);

        return repository.findByCampaignId(campaignId, pageable).map(this::convertToDTO);
    }

    /**
     * Récupère les transactions confirmées
     */
    @Transactional(readOnly = true)
    public Page<BlockchainTransactionDTO> getConfirmedTransactions(Pageable pageable) {
        log.info("Fetching confirmed transactions");

        return repository.findConfirmedTransactions(pageable).map(this::convertToDTO);
    }

    /**
     * Compte les transactions confirmées
     */
    @Transactional(readOnly = true)
    public long getConfirmedTransactionCount() {
        return repository.getConfirmedTransactionCount();
    }

    /**
     * Vérifie l'intégrité de la blockchain
     */
    @Transactional(readOnly = true)
    public boolean verifyBlockchainIntegrity() {
        log.info("Verifying blockchain integrity");

        var transactions = repository.findAll();
        String previousHash = "0";

        for (BlockchainTransaction tx : transactions) {
            if (!tx.getPreviousHash().equals(previousHash)) {
                log.warn("Blockchain integrity check failed at transaction: {}", tx.getId());
                return false;
            }
            previousHash = tx.getHash();
        }

        log.info("Blockchain integrity verified successfully");
        return true;
    }

    // ==================== Helper Methods ====================

    private String calculateHash(BlockchainTransaction transaction) {
        try {
            String data = transaction.getPaymentId().toString() +
                    transaction.getDonorId().toString() +
                    transaction.getCampaignId().toString() +
                    transaction.getAmount().toString() +
                    transaction.getPreviousHash() +
                    (transaction.getCreatedAt() != null ? transaction.getCreatedAt().toString() : "");

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            log.error("Error calculating hash: ", e);
            throw new RuntimeException("Error calculating hash", e);
        }
    }

    private String getLastTransactionHash() {
        return repository.findTopByOrderByCreatedAtDesc()
                .map(BlockchainTransaction::getHash)
                .orElse("0");
    }

    private RecordTransactionRequest extractTransactionRequest(Object paymentObject) {
        RecordTransactionRequest request = new RecordTransactionRequest();

        if (paymentObject instanceof java.util.Map) {
            @SuppressWarnings("unchecked")
            var map = (java.util.Map<String, Object>) paymentObject;
            request.setPaymentId(UUID.fromString(map.get("id").toString()));
            request.setDonorId(UUID.fromString(map.get("donorId").toString()));
            request.setCampaignId(UUID.fromString(map.get("campaignId").toString()));
            request.setAmount(new BigDecimal(map.get("amount").toString()));
        }

        return request;
    }

    private BlockchainTransactionDTO convertToDTO(BlockchainTransaction transaction) {
        return BlockchainTransactionDTO.builder()
                .id(transaction.getId())
                .paymentId(transaction.getPaymentId())
                .donorId(transaction.getDonorId())
                .campaignId(transaction.getCampaignId())
                .amount(transaction.getAmount())
                .hash(transaction.getHash())
                .previousHash(transaction.getPreviousHash())
                .status(transaction.getStatus().name())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}

package com.actforgood.payment.service;

import com.actforgood.payment.client.BlockchainClient;
import com.actforgood.payment.client.CampaignClient;
import com.actforgood.payment.model.Payment;
import com.actforgood.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private CampaignClient campaignClient;
    
    @Autowired
    private BlockchainClient blockchainClient;
    
    @Autowired
    private PaymentProcessor paymentProcessor;
    
    public Payment processPayment(Payment payment) {
        // Validate minimum amount (500 FCFA)
        if (payment.getAmount() < 500) {
            throw new RuntimeException("Minimum donation amount is 500 FCFA");
        }
        
        payment.setId(UUID.randomUUID().toString());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        
        // Process payment based on method
        Payment processed = paymentProcessor.process(payment);
        
        if (processed.getStatus() == Payment.PaymentStatus.COMPLETED) {
            // Update campaign amount
            campaignClient.updateCampaignAmount(payment.getCampaignId(), payment.getAmount());
            
            // Record on blockchain
            String blockchainHash = blockchainClient.recordTransaction(processed);
            processed.setBlockchainHash(blockchainHash);
        }
        
        processed.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(processed);
    }
    
    public Payment getPaymentById(String id) {
        return paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
    
    public List<Payment> getPaymentsByDonor(String donorId) {
        return paymentRepository.findByDonorId(donorId);
    }
    
    public List<Payment> getPaymentsByCampaign(String campaignId) {
        return paymentRepository.findByCampaignId(campaignId);
    }
}

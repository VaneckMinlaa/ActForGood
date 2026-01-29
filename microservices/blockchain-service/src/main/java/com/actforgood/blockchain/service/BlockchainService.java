package com.actforgood.blockchain.service;

import com.actforgood.blockchain.model.BlockchainTransaction;
import com.actforgood.blockchain.repository.BlockchainTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class BlockchainService {
    
    @Autowired
    private BlockchainTransactionRepository repository;
    
    public String recordTransaction(Object payment) {
        // Simplified blockchain implementation
        // In production, integrate with Ethereum, Stellar, or similar
        
        BlockchainTransaction transaction = new BlockchainTransaction();
        transaction.setId(UUID.randomUUID().toString());
        transaction.setPaymentId(extractPaymentId(payment));
        transaction.setDonorId(extractDonorId(payment));
        transaction.setCampaignId(extractCampaignId(payment));
        transaction.setAmount(extractAmount(payment));
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setStatus(BlockchainTransaction.TransactionStatus.PENDING);
        
        // Get previous hash
        String previousHash = getLastTransactionHash();
        transaction.setPreviousHash(previousHash);
        
        // Calculate hash
        String hash = calculateHash(transaction);
        transaction.setHash(hash);
        transaction.setStatus(BlockchainTransaction.TransactionStatus.CONFIRMED);
        
        repository.save(transaction);
        
        return hash;
    }
    
    public BlockchainTransaction getTransactionByHash(String hash) {
        return repository.findByHash(hash)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }
    
    private String calculateHash(BlockchainTransaction transaction) {
        try {
            String data = transaction.getPaymentId() + 
                         transaction.getDonorId() + 
                         transaction.getCampaignId() + 
                         transaction.getAmount() + 
                         transaction.getPreviousHash() + 
                         transaction.getTimestamp();
            
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
            throw new RuntimeException("Error calculating hash", e);
        }
    }
    
    private String getLastTransactionHash() {
        return repository.findTopByOrderByTimestampDesc()
            .map(BlockchainTransaction::getHash)
            .orElse("0");
    }
    
    private String extractPaymentId(Object payment) {
        try {
            return payment.getClass().getMethod("getId").invoke(payment).toString();
        } catch (Exception e) {
            return UUID.randomUUID().toString();
        }
    }
    
    private String extractDonorId(Object payment) {
        try {
            return payment.getClass().getMethod("getDonorId").invoke(payment).toString();
        } catch (Exception e) {
            return "";
        }
    }
    
    private String extractCampaignId(Object payment) {
        try {
            return payment.getClass().getMethod("getCampaignId").invoke(payment).toString();
        } catch (Exception e) {
            return "";
        }
    }
    
    private Double extractAmount(Object payment) {
        try {
            return (Double) payment.getClass().getMethod("getAmount").invoke(payment);
        } catch (Exception e) {
            return 0.0;
        }
    }
}

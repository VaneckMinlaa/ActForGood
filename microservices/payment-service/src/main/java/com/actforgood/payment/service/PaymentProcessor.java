package com.actforgood.payment.service;

import com.actforgood.payment.model.Payment;
import org.springframework.stereotype.Service;

@Service
public class PaymentProcessor {
    
    public Payment process(Payment payment) {
        // Simulate payment processing
        // In production, integrate with actual payment providers
        
        switch (payment.getMethod()) {
            case MOBILE_MONEY:
                return processMobileMoney(payment);
            case CRYPTO:
                return processCrypto(payment);
            case CARD:
                return processCard(payment);
            default:
                payment.setStatus(Payment.PaymentStatus.FAILED);
                return payment;
        }
    }
    
    private Payment processMobileMoney(Payment payment) {
        // Simulate Mobile Money processing (Orange Money, MTN MoMo)
        // In production, use actual APIs
        payment.setTransactionId("MM_" + System.currentTimeMillis());
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        return payment;
    }
    
    private Payment processCrypto(Payment payment) {
        // Simulate crypto processing
        payment.setTransactionId("CRYPTO_" + System.currentTimeMillis());
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        return payment;
    }
    
    private Payment processCard(Payment payment) {
        // Simulate card processing (Stripe, PayPal)
        payment.setTransactionId("CARD_" + System.currentTimeMillis());
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        return payment;
    }
}

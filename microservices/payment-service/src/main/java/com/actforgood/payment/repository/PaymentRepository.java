package com.actforgood.payment.repository;

import com.actforgood.payment.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByDonorId(String donorId);
    List<Payment> findByCampaignId(String campaignId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
    Payment findByTransactionId(String transactionId);
}

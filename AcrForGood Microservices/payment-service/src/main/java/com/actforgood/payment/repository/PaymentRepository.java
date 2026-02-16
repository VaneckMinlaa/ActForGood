package com.actforgood.payment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.actforgood.payment.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByDonorId(String donorId);
    List<Payment> findByCampaignId(String campaignId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
    Optional<Payment> findByTransactionId(String transactionId);
}

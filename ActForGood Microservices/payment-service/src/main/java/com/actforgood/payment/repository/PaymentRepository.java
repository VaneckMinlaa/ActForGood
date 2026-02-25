package com.actforgood.payment.repository;

import com.actforgood.payment.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByDonorId(UUID donorId);
    Page<Payment> findByDonorId(UUID donorId, Pageable pageable);

    List<Payment> findByCampaignId(UUID campaignId);
    Page<Payment> findByCampaignId(UUID campaignId, Pageable pageable);

    List<Payment> findByStatus(Payment.PaymentStatus status);
    Page<Payment> findByStatus(Payment.PaymentStatus status, Pageable pageable);

    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByBlockchainHash(String blockchainHash);

    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.donorId = :donorId")
    Page<Payment> findPaymentsByDonorAndStatus(
            @Param("donorId") UUID donorId,
            @Param("status") Payment.PaymentStatus status,
            Pageable pageable
    );

    @Query("SELECT p FROM Payment p WHERE p.status = 'COMPLETED' ORDER BY p.createdAt DESC")
    Page<Payment> findCompletedPayments(Pageable pageable);
}

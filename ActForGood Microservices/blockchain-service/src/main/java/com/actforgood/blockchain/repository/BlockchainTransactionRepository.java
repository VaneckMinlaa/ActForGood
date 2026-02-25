package com.actforgood.blockchain.repository;

import com.actforgood.blockchain.model.BlockchainTransaction;
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
public interface BlockchainTransactionRepository extends JpaRepository<BlockchainTransaction, UUID> {
    Optional<BlockchainTransaction> findByHash(String hash);
    Optional<BlockchainTransaction> findTopByOrderByCreatedAtDesc();

    List<BlockchainTransaction> findByPaymentId(UUID paymentId);
    Page<BlockchainTransaction> findByPaymentId(UUID paymentId, Pageable pageable);

    List<BlockchainTransaction> findByDonorId(UUID donorId);
    Page<BlockchainTransaction> findByDonorId(UUID donorId, Pageable pageable);

    List<BlockchainTransaction> findByCampaignId(UUID campaignId);
    Page<BlockchainTransaction> findByCampaignId(UUID campaignId, Pageable pageable);

    Page<BlockchainTransaction> findByStatus(BlockchainTransaction.TransactionStatus status, Pageable pageable);

    @Query("SELECT t FROM BlockchainTransaction t WHERE t.status = 'CONFIRMED' ORDER BY t.createdAt DESC")
    Page<BlockchainTransaction> findConfirmedTransactions(Pageable pageable);

    @Query("SELECT COUNT(t) FROM BlockchainTransaction t WHERE t.status = 'CONFIRMED'")
    long getConfirmedTransactionCount();
}

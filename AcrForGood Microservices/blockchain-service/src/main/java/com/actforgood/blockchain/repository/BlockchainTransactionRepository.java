package com.actforgood.blockchain.repository;

import com.actforgood.blockchain.model.BlockchainTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlockchainTransactionRepository extends JpaRepository<BlockchainTransaction, Long> {
    Optional<BlockchainTransaction> findByHash(String hash);
    Optional<BlockchainTransaction> findTopByOrderByTimestampDesc();
}

package com.actforgood.blockchain.repository;

import com.actforgood.blockchain.model.BlockchainTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlockchainTransactionRepository extends MongoRepository<BlockchainTransaction, String> {
    Optional<BlockchainTransaction> findByHash(String hash);
    Optional<BlockchainTransaction> findTopByOrderByTimestampDesc();
}

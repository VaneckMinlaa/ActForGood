# 💳 ActForGood - Système de Portefeuille & Comptes Bancaires

## 🎯 Vue d'Ensemble

ActForGood n'utilise **PAS** de vrais comptes bancaires, mais plutôt un **portefeuille virtuel** (e-wallet) sécurisé. Les vrais fonds transitent via **Mobile Money** (Orange Money, MTN MoMo) → **ActForGood wallet** → **ONG**.

```
Donateur (Compte Bancaire/Mobile Money)
    ↓ [Dépôt]
ActForGood E-Wallet (Portefeuille virtuel)
    ↓ [Transfert]
ONG Account (Virement bancaire ou Mobile Money)
    ↓ [Impact]
Bénéficiaires (Enfants orphelins, étudiants, etc.)
```

---

## 📱 Flux Complet : Dépôt & Transfert

### **1. Donateur Recharge Son Portefeuille**

```
User Flow (Mobile App):
1. Écran "Compte" → Bouton "Ajouter des fonds"
2. Sélectionner méthode:
   - Orange Money
   - MTN MoMo
   - Carte bancaire (optionnel)
3. Entrer montant (min 500 FCFA)
4. App redirige vers payment gateway
5. Paiement effectué via Orange Money/MTN
6. Webhook callback vers ActForGood
7. Portefeuille crédité
```

**Données Base de Données (PostgreSQL)**:

```sql
-- Table: Wallets (portefeuilles utilisateurs)
CREATE TABLE wallets (
    wallet_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) DEFAULT 0.00,  -- FCFA actuel
    total_deposited DECIMAL(15, 2) DEFAULT 0.00,  -- Historique
    total_withdrawn DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'FCFA',
    status ENUM('ACTIVE', 'SUSPENDED', 'CLOSED'),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_deposit_at TIMESTAMP,
    locked_amount DECIMAL(15, 2) DEFAULT 0.00  -- During transaction
);

-- Table: Wallet Transactions
CREATE TABLE wallet_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(wallet_id),
    type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'REFUND') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    balance_before DECIMAL(15, 2),  -- Solde avant
    balance_after DECIMAL(15, 2),   -- Solde après
    description VARCHAR(255),
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') DEFAULT 'PENDING',
    payment_method VARCHAR(50),  -- 'ORANGE_MONEY', 'MTN_MOMO', 'CARD', 'BANK_TRANSFER'
    external_ref_id VARCHAR(255),  -- Référence du payment gateway
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    error_message TEXT
);
```

---

## 🔌 Intégration Orange Money & MTN MoMo

### **Approche Recommandée: Utiliser Stripe Connect ou PayoutService**

Ne pas gérer Orange Money directement = complexité API + sécurité. Mieux:

#### **Option 1: Stripe + Stripe Connect (Recommandé)**

```
Avantages:
  ✅ Already audited for PCI-DSS
  ✅ Handles currency conversion
  ✅ Built-in analytics
  ✅ Supports mobile money via local partners
  
Flux Stripe:
  1. Donateur -> Stripe hosted page (Orange Money option)
  2. Stripe processes payment via local providers
  3. Webhook notification -> ActForGood
  4. ActForGood credits wallet
  
Cost: 2.9% + $0.30 (international) → negotiate for local partner
```

**Code Implementation (Exemple)**:

```java
// PaymentService.java
@Service
public class PaymentService {
    
    @Autowired
    private StripeClient stripeClient;
    
    @Autowired
    private WalletService walletService;
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Initiate wallet deposit via Stripe
     */
    public PaymentIntentResponse initiateDeposit(String userId, BigDecimal amount) {
        // 1. Validate user & amount
        if (amount.compareTo(BigDecimal.valueOf(500)) < 0) {
            throw new InvalidAmountException("Minimum deposit: 500 FCFA");
        }
        
        User user = userService.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
        
        // 2. Create Stripe PaymentIntent
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(amount.longValue())  // In FCFA (smallest unit)
            .setCurrency("xof")  // West African CFA franc
            .setPaymentMethod(PaymentIntentCreateParams.PaymentMethod.builder()
                .setType("card")
                .build())
            .putMetadata("user_id", userId)
            .putMetadata("wallet_id", user.getWallet().getWalletId().toString())
            .setReturnUrl(notificationUrl + "/payment/success")
            .setStatementDescriptor("ActForGood Donation")
            .build();
        
        // 3. Execute
        try {
            PaymentIntent intent = PaymentIntent.create(params);
            return new PaymentIntentResponse(
                intent.getId(),
                intent.getClientSecret(),
                intent.getStatus()
            );
        } catch (StripeException e) {
            logger.error("Stripe error: {}", e.getMessage());
            throw new PaymentProcessingException("Payment initiation failed");
        }
    }
    
    /**
     * Webhook from Stripe (when payment completes)
     */
    @PostMapping("/webhook/stripe")
    public ResponseEntity<?> handleStripeWebhook(
        @RequestBody String payload,
        @RequestHeader("Stripe-Signature") String signature) {
        
        // 1. Verify webhook authenticity
        Event event;
        try {
            event = Webhook.constructEvent(payload, signature, stripeEndpointSecret);
        } catch (SignatureVerificationException e) {
            logger.error("Invalid Stripe signature");
            return ResponseEntity.status(401).build();
        }
        
        // 2. Handle payment_intent.succeeded
        if ("payment_intent.succeeded".equals(event.getType())) {
            PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow();
            
            String userId = intent.getMetadata().get("user_id");
            String walletId = intent.getMetadata().get("wallet_id");
            BigDecimal amount = BigDecimal.valueOf(intent.getAmount())
                .divide(BigDecimal.valueOf(100));  // Convert cents to FCFA
            
            // 3. Credit wallet
            try {
                walletService.creditWallet(
                    UUID.fromString(walletId),
                    amount,
                    "Deposit via Stripe",
                    intent.getId()  // External ref
                );
                
                // 4. Send notification
                notificationService.sendPush(
                    userId,
                    "Dépôt reçu",
                    String.format("%.0f FCFA ajouté à votre portefeuille", amount),
                    NotificationType.DEPOSIT_COMPLETED
                );
                
                // 5. Log transaction
                auditService.log(userId, "WALLET_DEPOSIT", amount, "SUCCESS");
                
            } catch (Exception e) {
                logger.error("Failed to credit wallet: {}", e.getMessage());
                // TODO: Implement refund logic via reversal
                return ResponseEntity.status(500).build();
            }
        }
        
        return ResponseEntity.ok("{\"received\":true}");
    }
}
```

#### **Option 2: Direct Orange Money Integration (Expert)**

```
Si vous avez accès direct Orange Money Cameroun:

Endpoint: POST https://orange-money-api.cm/payment/initiate
Body: {
  phone: "+237699123456",
  amount: 100000,
  currency: "XOF",
  description: "ActForGood Donation",
  callback_url: "https://actforgood.cm/webhook/orange",
  reference: "DONATION_USER_123_456"
}

Response: {
  status: "PENDING",
  transaction_id: "OM_TXN_123",
  request_to_pay_id: "rtp_123"
}

User receives USSD prompt:
  *140# → Enter code or pin
  
Webhook callback (15 seconds later):
  POST https://actforgood.cm/webhook/orange
  {
    transaction_id: "OM_TXN_123",
    status: "COMPLETED",
    amount: 100000
  }
```

**Risques directs**:
- ❌ Requires banking relationship + compliance
- ❌ Complex webhook retry logic
- ❌ Fraud detection complexity
- ✅ Lower fees (1-2% vs Stripe 2.9%)

**Recommandation**: Utiliser Stripe d'abord, ajouter Orange Money direct en Phase 2.

---

## 💰 Service de Portefeuille (Wallet Service)

```java
// WalletService.java
@Service
@Transactional
public class WalletService {
    
    @Autowired
    private WalletRepository walletRepository;
    
    @Autowired
    private WalletTransactionRepository transactionRepository;
    
    @Autowired
    private RedisTemplate<String, Object> redis;
    
    private static final String WALLET_CACHE_PREFIX = "wallet:";
    
    /**
     * Get wallet with real-time balance from Redis
     */
    public WalletDTO getWallet(UUID userId) {
        // Try Redis cache first (for real-time balance)
        String cacheKey = WALLET_CACHE_PREFIX + userId;
        WalletDTO cached = (WalletDTO) redis.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }
        
        // Fall back to database
        Wallet wallet = walletRepository.findByUserId(userId)
            .orElseThrow(() -> new WalletNotFoundException(userId));
        
        WalletDTO dto = mapToDTO(wallet);
        redis.opsForValue().set(cacheKey, dto, Duration.ofMinutes(5));
        return dto;
    }
    
    /**
     * Credit wallet (deposit received)
     */
    public void creditWallet(
        UUID walletId,
        BigDecimal amount,
        String description,
        String externalRefId) {
        
        Wallet wallet = walletRepository.findById(walletId)
            .orElseThrow(() -> new WalletNotFoundException(walletId));
        
        if (!wallet.getStatus().equals("ACTIVE")) {
            throw new WalletNotActiveException(walletId);
        }
        
        // Update wallet
        BigDecimal balanceBefore = wallet.getBalance();
        wallet.setBalance(balanceBefore.add(amount));
        wallet.setTotalDeposited(wallet.getTotalDeposited().add(amount));
        wallet.setLastDepositAt(LocalDateTime.now());
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
        
        // Record transaction
        WalletTransaction txn = WalletTransaction.builder()
            .walletId(walletId)
            .type("DEPOSIT")
            .amount(amount)
            .balanceBefore(balanceBefore)
            .balanceAfter(wallet.getBalance())
            .description(description)
            .status("COMPLETED")
            .externalRefId(externalRefId)
            .completedAt(LocalDateTime.now())
            .build();
        transactionRepository.save(txn);
        
        // Invalidate cache
        invalidateWalletCache(wallet.getUserId());
    }
    
    /**
     * Lock amount (during donation transaction)
     */
    public void lockAmount(UUID walletId, BigDecimal amount) throws InsufficientFundsException {
        Wallet wallet = walletRepository.findById(walletId)
            .orElseThrow(() -> new WalletNotFoundException(walletId));
        
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(
                String.format("Balance: %.2f, Required: %.2f",
                    wallet.getBalance(), amount)
            );
        }
        
        // Lock amount (reserved during transaction)
        wallet.setLockedAmount(wallet.getLockedAmount().add(amount));
        walletRepository.save(wallet);
        
        invalidateWalletCache(wallet.getUserId());
    }
    
    /**
     * Unlock amount (if transaction fails)
     */
    public void unlockAmount(UUID walletId, BigDecimal amount) {
        Wallet wallet = walletRepository.findById(walletId)
            .orElseThrow(() -> new WalletNotFoundException(walletId));
        
        wallet.setLockedAmount(wallet.getLockedAmount().subtract(amount));
        walletRepository.save(wallet);
        
        invalidateWalletCache(wallet.getUserId());
    }
    
    /**
     * Debit wallet (after successful donation)
     * Called by DonationService after blockchain confirmation
     */
    @Transactional
    public void debitWallet(
        UUID walletId,
        BigDecimal grossAmount,
        BigDecimal commission,
        String donationId) {
        
        Wallet wallet = walletRepository.findById(walletId)
            .orElseThrow(() -> new WalletNotFoundException(walletId));
        
        BigDecimal netAmount = grossAmount.subtract(commission);
        
        // Debit the gross amount from wallet
        wallet.setBalance(wallet.getBalance().subtract(grossAmount));
        wallet.setLockedAmount(wallet.getLockedAmount().subtract(grossAmount));
        walletRepository.save(wallet);
        
        // Record debit transaction
        WalletTransaction txn = WalletTransaction.builder()
            .walletId(walletId)
            .type("TRANSFER")
            .amount(grossAmount)
            .balanceBefore(wallet.getBalance().add(grossAmount))  // Before the debit
            .balanceAfter(wallet.getBalance())
            .description("Donation to campaign: " + donationId)
            .status("COMPLETED")
            .build();
        transactionRepository.save(txn);
        
        invalidateWalletCache(wallet.getUserId());
    }
    
    /**
     * Get transaction history
     */
    public Page<WalletTransactionDTO> getTransactionHistory(
        UUID userId,
        Pageable page) {
        
        return transactionRepository.findByWallet_UserId(userId, page)
            .map(this::mapTransaction);
    }
    
    /**
     * Scheduled job: Clean up old cache entries (hourly)
     */
    @Scheduled(fixedRate = 3600000)  // 1 hour
    public void cleanCache() {
        logger.info("Cleaning wallet cache...");
        Set<String> keys = redis.keys(WALLET_CACHE_PREFIX + "*");
        if (keys != null && !keys.isEmpty()) {
            redis.delete(keys);
        }
    }
    
    private void invalidateWalletCache(UUID userId) {
        redis.delete(WALLET_CACHE_PREFIX + userId);
    }
    
    private WalletDTO mapToDTO(Wallet wallet) {
        return WalletDTO.builder()
            .walletId(wallet.getWalletId())
            .balance(wallet.getBalance())
            .lockedAmount(wallet.getLockedAmount())
            .availableBalance(wallet.getBalance().subtract(wallet.getLockedAmount()))
            .totalDeposited(wallet.getTotalDeposited())
            .currency(wallet.getCurrency())
            .lastDepositAt(wallet.getLastDepositAt())
            .build();
    }
}
```

---

## 🏦 Système de Commission (15%)

Lors d'un don **de 100,000 FCFA**:

```
┌─────────────────────────────────────────┐
│ Donateur Porte-feuille AVANT: 500,000   │
└─────────────────────────────────────────┘
         ↓ [Débite 100,000]
┌─────────────────────────────────────────┐
│ Porte-feuille APRÈS: 400,000            │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ Analyse:                                │
│ • Montant don: 100,000 FCFA             │
│ • Commission (15%): 15,000 FCFA         │
│ • ONG reçoit (85%): 85,000 FCFA         │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ Transferts:                             │
│ ActForGood Treasury: +15,000            │
│ ONG Wallet: +85,000                     │
└─────────────────────────────────────────┘
```

**Code (DonationService)**:

```java
@Service
@Transactional
public class DonationService {
    
    private static final BigDecimal COMMISSION_RATE = new BigDecimal("0.15");
    
    public DonationResponse processDonation(
        UUID donorId,
        UUID campaignId,
        BigDecimal amount) {
        
        // 1. Validate
        validateDonation(donorId, campaignId, amount);
        
        // 2. Lock funds in donor wallet
        walletService.lockAmount(walletId, amount);
        
        // 3. Calculate commission
        BigDecimal commission = amount.multiply(COMMISSION_RATE)
            .setScale(2, RoundingMode.HALF_UP);
        BigDecimal ongReceives = amount.subtract(commission);
        
        // 4. Create donation record
        Donation donation = Donation.builder()
            .donorId(donorId)
            .campaignId(campaignId)
            .amount(amount)
            .commissionAmount(commission)
            .ongReceivesAmount(ongReceives)
            .status("PROCESSING")
            .createdAt(LocalDateTime.now())
            .build();
        donationRepository.save(donation);
        
        // 5. Initiate blockchain transaction
        try {
            BlockchainTxResponse blockchainResponse = blockchainService
                .recordTransaction(new BlockchainTx(
                    donorId,
                    ongId,
                    ongReceives,  // Record net amount to ONG
                    donation.getId()
                ));
            
            donation.setBlockchainTxId(blockchainResponse.getTxHash());
            donation.setBlockchainStatus("PENDING");
            donation.setStatus("PENDING_BLOCKCHAIN_CONFIRMATION");
            donationRepository.save(donation);
            
            // 6. Publish async event
            eventPublisher.publishEvent(new DonationInitiatedEvent(donation));
            
            return new DonationResponse(
                donation.getId(),
                "PENDING",
                blockchainResponse.getTxHash()
            );
            
        } catch (BlockchainException e) {
            // Unlock funds on blockchain failure
            walletService.unlockAmount(walletId, amount);
            donation.setStatus("FAILED");
            donation.setErrorMessage(e.getMessage());
            donationRepository.save(donation);
            throw new DonationFailedException(e.getMessage());
        }
    }
    
    /**
     * Async handler: When blockchain confirms transaction
     */
    @Transactional
    @EventListener
    public void onBlockchainConfirmed(BlockchainConfirmedEvent event) {
        Donation donation = donationRepository.findById(event.getDonationId())
            .orElseThrow();
        
        // 1. Debit donor wallet
        walletService.debitWallet(
            donor.getWalletId(),
            donation.getAmount(),
            donation.getCommissionAmount(),
            donation.getId().toString()
        );
        
        // 2. Credit ONG wallet
        walletService.creditWallet(
            ong.getWalletId(),
            donation.getOngReceivesAmount(),
            "Donation received from " + donor.getName(),
            event.getTxHash()
        );
        
        // 3. Credit ActForGood treasury (commission)
        // In production, track in separate account/bank
        treasuryService.recordRevenue(
            donation.getCommissionAmount(),
            "Commission",
            donation.getId().toString()
        );
        
        // 4. Update donation status
        donation.setStatus("COMPLETED");
        donation.setCompletedAt(LocalDateTime.now());
        donationRepository.save(donation);
        
        // 5. Update campaign metrics
        campaignService.addDonation(donation.getCampaignId(), 
            donation.getOngReceivesAmount());
        
        // 6. Notify involved parties
        notificationService.notifyDonor(donor, donation);
        notificationService.notifyONG(ong, donation);
        notificationService.notifyAdmin("Donation completed: " + donation.getId());
        
        // 7. Log audit
        auditService.logDonationCompleted(donation);
    }
}
```

---

## 📊 Dashboard Donateur (Portefeuille)

```
┌─────────────────────────────────────────┐
│  💰 Portefeuille                        │
├─────────────────────────────────────────┤
│                                         │
│  Solde disponible:                      │
│  400,000 FCFA  💚                       │
│                                         │
│  Montants bloqués:  0 FCFA              │
│                                         │
│  Total donné (vie):  500,000 FCFA       │
│  Nombre de dons: 5                      │
│                                         │
├─────────────────────────────────────────┤
│ ┌─ Ajouter des fonds ──────────────────┐│
│ │ Montant: _______ FCFA                ││
│ │ [🟠 Orange Money] [🔵 MTN MoMo]      ││
│ │            [Continuer]               ││
│ └──────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  📜 Historique                          │
│                                         │
│  ✅ 25 fév, 14:30 - Don confirmé       │
│     Orphelinat Yaoundé: -100k           │
│     Votre solde: 400k                   │
│     Blockchain: 0xAbc...                │
│                                         │
│  ✅ 24 fév, 09:15 - Dépôt reçu         │
│     Orange Money: +500k                 │
│     Votre solde: 500k                   │
│                                         │
│  ❌ 20 fév, 16:45 - Don échoué         │
│     Projet fermé: -50k (remboursé)      │
│                                         │
│  ... < Voir plus >                      │
└─────────────────────────────────────────┘
```

---

## 🔒 Sécurité & Conformité

### **PCI-DSS (Payment Card Industry)**

```
Puisque vous utilisez Stripe:
✅ Stripe handle PCI-DSS compliance
✅ Vous never touch card details
✅ Use Stripe's tokenization
❌ Don't store card numbers locally
```

### **AML/KYC (Anti-Money Laundering)**

```
Règles Cameroun:
- Montant >= 2M FCFA par jour: Signaler ANIF (National Authority)
- Require ID upload for large transactions
- Monitor suspicious patterns

Implementation:
```java
public Boolean isHighRiskTransaction(UUID userId, BigDecimal amount) {
    if (amount.compareTo(new BigDecimal("2000000")) >= 0) {
        User user = userService.findById(userId);
        return !user.isKycVerified();  // Require KYC
    }
    
    // Check 24-hour total
    BigDecimal dailyTotal = walletRepository
        .getDailyDepositTotal(userId, LocalDate.now());
    
    if (dailyTotal.add(amount).compareTo(new BigDecimal("5000000")) > 0) {
        amlService.flagForReview(userId, amount);
    }
    
    return false;
}
```

---

## 🚀 Déploiement Wallet Service

```
Docker Compose:
  - wallet-service: Spring Boot
  - postgres: PostgreSQL 15
  - redis: Redis 7
  - rabbitmq: For async events

Environment Variables:
  STRIPE_API_KEY=${STRIPE_API_KEY}  # From Vault
  STRIPE_WEBHOOK_SECRET=${WEBHOOK_SECRET}
  REDIS_HOST=redis
  POSTGRES_URL=jdbc:postgresql://postgres:5432/actforgood
  PAYMENT_CALLBACK_URL=https://api.actforgood.cm/webhook/payment
```

---

## 📞 Intégration avec Autres Services

### **DonationService → WalletService**

```java
walletService.lockAmount(donorWalletId, donationAmount);
// Later...
walletService.debitWallet(donorWalletId, donationAmount, commission, donationId);
walletService.creditWallet(ongWalletId, netAmount, description, txHash);
```

### **NotificationService → Wallet Events**

```
Events:
  - wallet.deposit_initiated → Notify donor
  - wallet.deposit_completed → Update UI
  - wallet.deposit_failed → Show error
  - wallet.transfer_locked → Disable further transfers
  - wallet.transfer_completed → Update balance
```

---

## 🧪 Tests

```java
@SpringBootTest
@AutoConfigureTestDatabase(replace = MOCK)
public class WalletServiceTest {
    
    @Test
    public void testCreditWallet_SuccessfulDeposit() {
        // Arrange
        Wallet wallet = walletRepository.save(new Wallet(...));
        BigDecimal amount = new BigDecimal("100000");
        
        // Act
        walletService.creditWallet(wallet.getId(), amount, "Test deposit", "EXT_123");
        
        // Assert
        Wallet updated = walletRepository.findById(wallet.getId()).get();
        assertEquals(amount, updated.getBalance());
    }
    
    @Test
    public void testLockAmount_InsufficientFunds_ThrowException() {
        // Arrange
        Wallet wallet = new Wallet();
        wallet.setBalance(new BigDecimal("5000"));
        walletRepository.save(wallet);
        
        // Act & Assert
        assertThrows(InsufficientFundsException.class, 
            () -> walletService.lockAmount(wallet.getId(), new BigDecimal("10000")));
    }
    
    @Test
    public void testDebitWallet_CalculatesCommissionCorrectly() {
        // Arrange
        Wallet wallet = new Wallet();
        wallet.setBalance(new BigDecimal("100000"));
        walletRepository.save(wallet);
        
        BigDecimal grossAmount = new BigDecimal("100000");
        BigDecimal commission = new BigDecimal("15000");  // 15%
        
        // Act
        walletService.debitWallet(wallet.getId(), grossAmount, commission, "DONATION_123");
        
        // Assert
        Wallet updated = walletRepository.findById(wallet.getId()).get();
        assertEquals(new BigDecimal("0"), updated.getBalance());
        
        WalletTransaction txn = transactionRepository.findByWalletId(wallet.getId()).get(0);
        assertEquals(grossAmount, txn.getAmount());
    }
}
```

---

## 📚 API Endpoints

```
POST /api/v1/wallet
  Créer un portefeuille pour nouvel utilisateur

GET /api/v1/wallet/{userId}
  Récupérer solde + détails portefeuille

POST /api/v1/wallet/deposit
  Initier dépôt
  Body: {amount: 100000, method: "ORANGE_MONEY"}
  Response: {paymentIntentId, clientSecret, ...}

GET /api/v1/wallet/transactions
  Historique des transactions
  Query: ?page=1&size=20

POST /webhook/payment
  Webhook from Stripe (payment completed)
  Header: Stripe-Signature: ...
```

---

## 🎯 Checklist Implémentation

```
Phase 1: Foundation
  ☐ Create Wallet + WalletTransaction tables
  ☐ Implement WalletService CRUD
  ☐ Add Redis caching for balance
  ☐ Unit tests (80%+ coverage)
  ☐ Basic deposit/withdrawal logic

Phase 2: Payment Gateway
  ☐ Integrate Stripe (test mode)
  ☐ Implement webhook handling
  ☐ Test deposit flow end-to-end
  ☐ Error handling & retries

Phase 3: Donation Flow
  ☐ Integrate DonationService with Wallet
  ☐ Lock/Unlock funds logic
  ☐ Commission calculation
  ☐ ONG account credit
  ☐ Blockchain recording

Phase 4: Security
  ☐ AML/KYC checks
  ☐ Rate limiting on payment endpoints
  ☐ Audit logging
  ☐ Security testing (penetration)

Phase 5: Production
  ☐ Switch to Stripe live mode
  ☐ Orange Money direct integration (negotiate)
  ☐ Treasury reconciliation (daily)
  ☐ Monitoring & alerting
```

---

## 💡 Conclusion

**ActForGood ne gère pas vraiment la banque** — c'est un **intermédiaire**.

```
Strict Separation:
  ✅ Real money: Orange Money, Stripe (external providers)
  ✅ Virtual money: ActForGood wallet (internal ledger)
  ✅ Trust: Blockchain proof (immutable record)
  
Benefits:
  • Regulatory compliance (not a bank)
  • Lower risk (outsource payment processing)
  • Faster development (use existing APIs)
  • Lower costs (sub 3% fees vs self-managed)
```

**Bonne chance! 🚀**

---

**Version**: 1.0 | **Date**: 25 février 2026

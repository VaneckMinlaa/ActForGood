# 🚀 ActForGood - Architecture Complète & Meilleurs Choix Techniques

**Date** : 25 février 2026 | **Version** : 1.0

---

## 📑 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Diagrammes Créés](#diagrammes-créés)
3. [Stack Technique Recommandée](#stack-technique-recommandée)
4. [Architecture Microservices](#architecture-microservices)
5. [Processus Clés](#processus-clés)
6. [Security & Compliance](#security--compliance)
7. [Plan de Déploiement](#plan-de-déploiement)
8. [Bonnes Pratiques](#bonnes-pratiques)

---

## 🎯 Vue d'Ensemble

ActForGood est une **plateforme de matching intelligent pour dons sociaux** au Cameroun, connectant :
- **Donateurs** (diaspora + locaux) → Reçoivent recommandations IA personnalisées
- **ONG/Orphelinats** → Créent projets, reçoivent dons transparents via blockchain
- **Administrateurs** → Valident ONG & projets, supervisent transactions
- **Visiteurs** → Consultent projets & impact sans s'inscrire

### Objectifs Clés
✅ Matching IA (recommandations Netflix-style)  
✅ Transparence blockchain (85% au bénéficiaire, 15% commission)  
✅ Real-time impact tracking (photos/rapports)  
✅ Accessibilité (500 FCFA minimum, Mobile Money)  
✅ Sécurité (JWT, encryption, audit logs)

---

## 📊 Diagrammes Créés

### 1. **Cas d'Usage Global** 
```
4 acteurs : Visiteur, Donateur, ONG, Admin
10+ cas d'usage par acteur
Interactions avec systèmes : IA, Blockchain, Mobile Money, Notifications
```

### 2. **Architecture Système Global**
```
CLIENT LAYER (Web Angular + Mobile React Native)
    ↓
API GATEWAY (Load balancing, Auth, Rate limiting)
    ↓
MICROSERVICES (9 services Java Spring Boot)
    ↓
DATA LAYER (PostgreSQL + MongoDB)
    ↓
EXTERNAL SERVICES (Brevo, Orange Money, Stellar)
    ↓
INFRASTRUCTURE (VPS + Redis + RabbitMQ)
```

### 3. **Processus de Don Détaillé** (9 étapes)
```
Dépôt → Sélection projet IA → Validation don → Calc commission 15%
→ Débit/Transfert → Blockchain → Notifications → Reçu → Traçabilité real-time
```

### 4. **Validation ONG & Projets** (Admin)
```
ONG inscription → Profil validation → Projet création & validation
→ Broadcast donors → Suivi real-time dashboard
```

### 5. **Modèle de Données** (PostgreSQL - 15 tables)
```
USERS, WALLETS, ONG, CAMPAIGNS, DONATIONS, TRANSACTIONS
BLOCKCHAIN_TX, IMPACT_METRICS, REPORTS, DOCUMENTS, CHAT, NOTIFICATIONS
NOTIFICATION_LOG, AUDIT_LOG
```

### 6. **Moteur Matching IA**
```
Inputs: Profil donateur + Campagne
Features: Préférences, budget, localisation, urgence
ML: 70% collaborative filtering + 30% content-based = Score 0-10
Output: Top 10 campagnes personnalisées + distance + urgence
```

### 7. **Blockchain & Traçabilité**
```
Donation → Payment → Blockchain record → Smart Contract
PostgreSQL (log) + Blockchain (proof) = Dual storage
Donor/ONG see transparency: Hash proof + Block details + Impact
```

### 8. **Architecture Clean (Mobile & Web)**
```
MOBILE (React Native):  
  Presentation → ViewModel → Repository → Service → Models

WEB (Angular):  
  Presentation → State (NgRx) → Service → Models + Guards + Interceptors
```

---

## 🛠️ Stack Technique Recommandée

### 🌐 **Frontend**

| Couche | Technologie | Raison |
|--------|-------------|--------|
| **Mobile** | React Native + Expo | Cross-platform (iOS/Android), Fast iteration, Dart alternative mais RN plus mature |
| **State Mobile** | Redux Toolkit ou Zustand | Redux = robuste pour grandes apps, Zustand = léger & performant → recommandé Zustand |
| **Web Admin** | Angular 17+ | Robuste, TypeScript-first, NgRx store intégré, Enterprise-ready |
| **Styling Mobile** | TailwindCSS + Nativewind | Consistency, rapid development |
| **Styling Web** | SCSS + Angular Material | Material design, accessibility built-in |
| **Real-time Web** | Socket.io ou Angular SignalR | WebSocket pour notifications live |
| **Mapping** | Google Maps SDK (Mobile) + Angular Google Maps | Géolocalisation & matching basé localisation |
| **Charts/Analytics** | Recharts (Web) + react-native-chart-kit (Mobile) | Data visualization pour impact tracking |
| **Forms** | React Hook Form (Mobile) + Reactive Forms (Web) | Validation, performance, accessibility |

### 🔧 **Backend**

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Langage** | Java 21 (LTS) | Production-ready, performance, ecosystem riche |
| **Framework** | Spring Boot 3.2 | Microservices, IoC, security built-in |
| **API Gateway** | Spring Cloud Gateway ou Kong | Routing, auth, rate limiting centralisé |
| **Service Discovery** | Eureka (Netflix) ou Consul | Auto-registration microservices |
| **Config Server** | Spring Cloud Config | Centralized configuration management |
| **Message Queue** | RabbitMQ ou Kafka | Async jobs, event streaming |
| **Caching** | Redis 7+ | Sessions, real-time data, distributed cache |
| **ORM** | Spring Data JPA + Hibernate | Type-safe, automatic DDL |
| **Validation** | Spring Validation (JSR-303/jakarta-validation) | Built-in constraints, custom validators |
| **Security** | Spring Security 6 + JWT | OAuth2, JWT tokens, role-based access |
| **Logging** | Logback + ELK Stack | Centralized logging, monitoring |
| **Testing** | JUnit 5 + Mockito + TestContainers | Unit & integration tests with real DB |

### 💾 **Databases**

| DB | Usage | Config |
|----|-------|--------|
| **PostgreSQL 15+** | Transactions, auth, campaigns, donations | JSONB pour metadata, UUID pour IDs, Partitioning pour history |
| **MongoDB** | Cache ML, logs d'IA, real-time metrics | TTL indexes pour expiration auto, Sharding pour scale |
| **Redis 7+** | Sessions, distributed cache, pub/sub | Cluster mode, persistence (AOF), sentinel pour HA |

### ⛓️ **Blockchain**

| Aspect | Recommandation | Raison |
|--------|-----------------|--------|
| **Network** | Ethereum (mainnet à long terme), Stellar (MVP) | Stellar = low-cost, fast, perfect pour MVP Africain |
| **Smart Contract** | Solidity (Ethereum) ou Rust (Stellar) | Escrow pattern pour dons |
| **SDK** | web3.js ou ethers.js (Ethereum) ; js-stellar-sdk (Stellar) | Type-safe, well-maintained |
| **Gas Strategy** | Layer 2 (Arbitrum, Optimism) ou Stellar | Reduce costs en production |
| **RPC Provider** | Infura, Alchemy (Ethereum) ; Stellar pubnet | Reliable, rate-limited |

### 🔐 **Security & Auth**

| Aspect | Tech | Details |
|--------|------|---------|
| **Auth** | JWT + OAuth 2.0 | Access token (15min) + Refresh token (7 days) |
| **Encryption** | AES-256 (wallets) + TLS 1.3 | Sensitive data encrypted, transport secure |
| **Hashing** | bcrypt (passwords) + SHA-256 (blockchain) | Industry standard |
| **2FA** | TOTP (Google Authenticator) + SMS | Critical accounts (admin, ONG) |
| **Secrets** | HashiCorp Vault ou AWS Secrets Manager | API keys, DB credentials centralized |

### 📡 **DevOps & Deployment**

| Aspect | Technologie | Justification |
|--------|-------------|----------------|
| **Containerization** | Docker 24+ + Docker Compose | Consistency dev → production |
| **Orchestration** | Kubernetes (prod) ou Docker Compose (MVP) | Auto-scaling, self-healing, HA |
| **CI/CD** | GitHub Actions ou GitLab CI | Automated testing, building, deployment |
| **Mobile Deployment** | EAS (Expo Application Services) | Over-the-air updates, easy builds |
| **Web Deployment** | Vercel ou Netlify | Edge caching, auto-scaling, CDN global |
| **Backend Deployment** | AWS EC2 + RDS ou VPS dédié (Scaleway/Linode) | Control, cost-effective pour MVP |
| **Monitoring** | Prometheus + Grafana (metrics) + ELK (logs) | Real-time alerting, dashboards |
| **APM** | New Relic ou Datadog | Application performance monitoring |

### 🔌 **External Services**

| Service | Usage | Config |
|---------|-------|--------|
| **Brevo** | Email + SMS | Free tier 300 emails/day, 3 SMS/day |
| **Orange Money API** | Mobile payments Cameroun | Partner integration, webhook callbacks |
| **MTN MoMo API** | Mobile payments Cameroun | Similar to Orange, redundancy |
| **Google Maps API** | Geolocation + Matching | Billing: ~$0.005/request, cache results |
| **Firebase Cloud Messaging** | Push notifications | Free tier 100k messages/day |
| **Sentry** | Error tracking | Free tier 5k events/month |

---

## 🔧 Architecture Microservices (Détaillée)

### **Service Catalog** (9 Microservices)

```
┌─ USER SERVICE (Authentification & Profils)
│  ├─ Endpoints: POST /auth/register, /auth/login, /auth/refresh
│  ├─ DB: USERS, PROFILES tables
│  └─ Responsibilities: JWT generation, password hashing, profile CRUD
│
├─ CAMPAIGN SERVICE (Gestion Projets)
│  ├─ Endpoints: POST/GET/PUT /campaigns
│  ├─ DB: CAMPAIGNS, DOCUMENTS, IMPACT_METRICS tables
│  └─ Responsibilities: Create, validate, list campaigns, upload docs
│
├─ MATCHING SERVICE (IA Recommandations)
│  ├─ Endpoints: GET /match/recommendations?donor_id={id}
│  ├─ DB: MongoDB pour logs ML
│  ├─ Cache: Redis pour models, donor profiles
│  └─ Modules: 
│      • Feature engineering (normalize donor + campaign)
│      • Collaborative filtering (SVD)
│      • Content-based (Cosine similarity + TF-IDF)
│      • Hybrid scoring + geolocation
│      • Batch retraining (weekly cron)
│
├─ DONATION SERVICE (Gestion Dons)
│  ├─ Endpoints: POST /donations/create, GET /donations/{id}
│  ├─ Logic: Validate balance, calc commission (15%), trigger transfer
│  └─ Publishes: donation.created event → Blockchain & Notification services
│
├─ WALLET SERVICE (Portefeuille Donateur)
│  ├─ Endpoints: POST /wallet/deposit, GET /wallet/balance
│  ├─ Responsibilities: Balance management, deposit history, lockdown during transaction
│  └─ Cache: Redis for real-time balance
│
├─ TRANSACTION SERVICE (Suivi Transactions)
│  ├─ Endpoints: GET /transactions/{id}, GET /transactions/donor/{donor_id}
│  ├─ Features: Real-time status tracking, retry logic
│  └─ Publishes: transaction.completed → Notifications, Audit logs
│
├─ PAYMENT SERVICE (Payments Gateway)
│  ├─ Integrations: Orange Money API, MTN MoMo API
│  ├─ Responsibilities: Request payment, handle webhooks, reconciliation
│  ├─ Idempotency: Unique transaction ID to prevent double charges
│  └─ Fallback: If payment fails, rollback wallet debit
│
├─ BLOCKCHAIN SERVICE (Traçabilité Web3)
│  ├─ Smart Contract: DonationEscrow.sol (Ethereum/Stellar)
│  ├─ Responsibilities: Record tx hash, verify blocks, generate proofs
│  ├─ Cache: Tx hashes in Redis + PostgreSQL for audit trail
│  └─ Scheduled job: Verify block confirmations (every 5 min)
│
└─ NOTIFICATION SERVICE (Emails & Push)
   ├─ Channels: Email (Brevo), SMS (Brevo), Push (FCM)
   ├─ Queue: RabbitMQ messages (async processing)
   ├─ Templates: Donation confirmed, ONG verified, project activated
   └─ Tracking: notification_log table for delivery status
```

### **Service Communication**

```
Synchronous (REST/gRPC):
  - Donation Service → Wallet Service (verify balance)
  - Campaign Service → User Service (verify ownership)

Asynchronous (Event-driven):
  - Donation Service publishes "donation.created" 
    → Blockchain Service (record tx)
    → Notification Service (send emails)
    → Report Service (update metrics)
  
  - Payment Service publishes "payment.webhook" 
    → Transaction Service (update status)
    → Audit Service (log action)
```

### **Database per Service Pattern**

```
user_service: users, profiles, verification_docs
campaign_service: campaigns, documents, impact_metrics
donation_service: donations, donation_history
wallet_service: wallets, wallet_transactions
transaction_service: transactions, payment_refs, audit_log
blockchain_service: blockchain_tx, tx_proof
notification_service: notifications, notification_log
report_service: (reads from all services)
```

---

## 📋 Processus Clés (Détaillés)

### **1. Processus de Don (9 étapes)**

```
1. DÉPÔT INITIAL
   Donateur: "Je veux déposer 500k FCFA"
   Wallet: "Créer transaction dépôt"
   Payment Gateway: "Appeler Orange Money API"
   Orange Money: "Débiter compte usager, webhook callback"
   Wallet: "Créditer 500k dans ActForGood wallet"
   
2. AFFICHAGE PROJETS (IA Matching)
   Donateur: "Voir projets suggérés"
   Cache: "Chercher model IA dans Redis"
   Matching Service: "Si cache miss, recalculate score"
   Return: Top 10 projects (score >= 7) sorted by urgency
   
3. SÉLECTION ET CONFIRMATION
   Donateur: "Je veux donner 100k à Projet X"
   App: "Montrer résumé: 100k total, 15k commission, 85k ONG"
   Donateur: "Confirmer"
   
4. TRANSACTION INITIATION
   Donation Service: "Créer donation record, status=PROCESSING"
   Wallet Service: "Vérifier balance >= 100k"
   If fail: "Reject donation, show error"
   
5. CALC & DÉBITAGE
   Donation Service: 
     commission = 100k * 0.15 = 15k
     ong_amount = 100k * 0.85 = 85k
   Wallet Service: "Débiter -100k, nouveau solde"
   
6. ONG CRÉDIT
   Payment Service: "Transférer 85k au compte ONG"
   ONG Wallet: "Ajouter +85k balance"
   
7. BLOCKCHAIN RECORD
   Blockchain Service: "Créer tx {donor, ong, 85k, timestamp, hash}"
   Smart Contract: "Enregistrer dans ledger immuable"
   Blockchain: "Return tx_hash + block_number"
   
8. NOTIFICATIONS
   Notification Service (async via queue):
     → Send: "Don de 100k confirmé ✅" à Donateur (push + email)
     → Send: "Reçu 85k FCFA de {Donor}" à ONG (email + push)
     → Update: Transaction status = COMPLETED
   
9. REÇU & TRAÇABILITÉ
   Donateur: "Voir détails don"
   App: Query → Transaction details + blockchain proof
   Show: "85k transférés le 25/02/2026 14:30:00\nBlockchain: 0xAbc...123"
```

### **2. Validation ONG (5 étapes)**

```
1. INSCRIPTION
   ONG: Upload{name, email, RCCM, legal docs}
   User Service: "Créer profile ONG, status=PENDING_VERIFICATION"
   Document verification: Store in S3/cloud storage + compute file hash
   
2. ADMIN REVIEW
   Admin Dashboard: "Voir liste ONG PENDING"
   Admin: Télécharger documents, vérifier identité
   Admin: "Approuver ou Rejeter"
   
3. IF APPROVED
   User Service: "Update status = VERIFIED"
   Document Service: "Mark docs as VERIFIED"
   Notification: "Envoyer confirmation à ONG"
   Activate: "ONG peut désormais créer projets"
   
4. IF REJECTED
   User Service: "Update status = REJECTED, reason = '...'"
   Notification: "Rejeter email avec raison + steps to resubmit"
   Allow: "ONG peut soumettre à nouveau"
   
5. ONGOING MONITORING
   Campaign Service: Check ONG projects
   Admin: Can block ONG if fraudulent behavior detected
```

### **3. Matching IA (La Magie!) 🤖**

```
ALGORITHM HYBRID (70% Collab + 30% Content)

Input:
  Donor_Profile = {
    preferences: ["education", "health"],
    budget: 50k-500k,
    location: (5.3°N, 10.2°E), // Yaoundé
    age: 35,
    history: [donated 5x to education projects]
  }
  
  Campaign = {
    category: "education",
    budget_needed: 2M,
    location: (5.35°N, 10.25°E),
    urgency: "CRITICAL",
    beneficiaries: 50 children,
    impact_score: 8.5
  }

STEP 1: Collaborative Filtering (SVD)
  • Collect all donors X campaigns matrix
  • Decompose into latent factors (e.g., 50 dimensions)
  • Find donors similar to target donor
  • Recommend campaigns those similar donors liked
  • Score: 0-10

STEP 2: Content-Based (Cosine Similarity)
  • Extract features from Campaign description (TF-IDF)
  • Compare with Donor preferences (vectorized)
  • Match urgency bonus: CRITICAL=+3, HIGH=+1.5
  • Score: 0-10

STEP 3: Hybrid Score
  final_score = 0.7 * collab_score + 0.3 * content_score
  
STEP 4: Filters & Ranking
  if final_score >= 7:  // threshold
    distance = haversine(donor.location, campaign.location)
    if distance <= 200km:  // configurable radius
      Add to recommendations, sort by:
        1. Score (descending)
        2. Urgency (CRITICAL > HIGH > MEDIUM)
        3. Distance (ascending - closer first)

STEP 5: Real-Time Adjustments
  • Recency bonus: If donor donated recently, +0.5
  • Trending boost: If campaign trending, +0.3
  • Personal impact: If donor cares about specific region, boost
  • Remove if: Campaign completed, donor not matched

OUTPUT: Top 10 campaigns
```

---

## 🔐 Security & Compliance

### **Authentication & Authorization**

```
Flow:
1. Login: POST /auth/login {email, password}
2. Server: 
   - Hash password with bcrypt (cost=12)
   - Compare with stored hash
   - If match: Generate JWT
3. JWT Structure:
   {
     "header": {"alg": "HS256", "typ": "JWT"},
     "payload": {
       "user_id": "uuid-123",
       "role": "DONOR|ONG|ADMIN",
       "iat": 1234567890,
       "exp": 1234571490  // 1 hour
     },
     "signature": "HMAC-SHA256(header.payload, secret_key)"
   }
4. Send: Access token (15 min) + Refresh token (7 days) in HttpOnly cookie
5. Every request: Header "Authorization: Bearer {access_token}"
6. API Gateway: Validate JWT signature, check expiry, verify role

Role-Based Access Control (RBAC):
  @PreAuthorize("hasRole('DONOR')")
  public ResponseEntity<?> createDonation() { ... }
  
  @PreAuthorize("hasRole('ONG')")
  public ResponseEntity<?> updateCampaign() { ... }
  
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> validateONG() { ... }
```

### **Data Protection**

```
Encryption at Rest:
  - Database: AWS RDS encryption, PostgreSQL pgcrypto
  - Wallets: AES-256 encrypt sensitive fields
  - Documents: Encrypt in S3 with server-side encryption

Encryption in Transit:
  - TLS 1.3 for all HTTP
  - Certificate: Let's Encrypt (auto-renewal)
  - HSTS header enabled

Sensitive Data Handling:
  - Passwords: Never logged, bcrypt hashed
  - Wallet addresses: Encrypted with service key
  - Payment refs: Tokenized, keys in Vault
  - PII: Masked in logs (user@***.com)

Access Control:
  - Principle of least privilege
  - Database credentials in HashiCorp Vault
  - API keys rotation every 90 days
  - Service-to-service auth via JWT or mTLS
```

### **Audit & Compliance**

```
Audit Trail:
  Every transaction logged:
  - Actor: user_id, role, action
  - Resource: campaign_id, donation_id, amount
  - Timestamp, IP address, user agent
  - Before/after values
  - Blockchain proof (tx_hash)

Compliance:
  ✅ GDPR-lite (data retention, right to be forgotten)
  ✅ PCI DSS (if handling cards directly - outsource to Stripe instead)
  ✅ AML/KYC (Know Your Customer - 2M FCFA+ deposits require ID)
  ✅ Transaction reporting (government if >50M FCFA/month)
  ✅ Data residency (keep in-country if possible, or EU)

Rate Limiting:
  - Auth endpoint: 5 requests/minute per IP
  - API general: 1000 requests/hour per user
  - Payment endpoint: 10 requests/minute per user
  - Implement via Spring RateLimiter or Redis SLIDING_WINDOW
```

### **Vulnerability Management**

```
Scanning:
  - SAST: SonarQube, Checkmarx (code vulnerabilities)
  - DAST: Burp Suite, OWASP ZAP (runtime vulnerabilities)
  - Dependency: Snyk, OWASP Dependency-Check (outdated libs)
  
Testing:
  - Unit tests: 80%+ code coverage
  - Integration tests: Database, API, external services
  - Penetration testing: Quarterly by external firm
  - Chaos engineering: Test failover, resilience
```

---

## 🚀 Plan de Déploiement

### **Phase 1: MVP (Mois 1-2)**

```
Backend:
  - 3 core services: User, Campaign, Donation
  - PostgreSQL local
  - Basic auth (JWT)
  - Brevo for email
  - Deploy: Docker on local VPS
  
Mobile:
  - Screens: Login, Campaign list, Wallet, Chat
  - State: Redux basic
  - No real payments yet (mock Stripe/Orange Money)
  
Web:
  - Admin dashboard: ONG list, Campaign validation
  - Basic forms for ONG
  
Testing:
  - ~60% code coverage
  - Manual QA
```

### **Phase 2: Beta (Mois 3-4)**

```
Backend:
  - Add: Matching service (lite ML), Blockchain, Notifications
  - PostgreSQL + Redis deployed
  - Real Orange Money integration (sandbox)
  - RabbitMQ for async jobs
  
Mobile:
  - Full donation flow (deposit → match → donate)
  - Real-time notifications
  - Blockchain tx view
  
Web:
  - ONG dashboard (project management)
  - Admin analytics
  
Deployment:
  - Kubernetes pilot (2-3 nodes)
  - CI/CD with GitHub Actions
  - Staging environment (mirror production)
  
Testing:
  - ~80% code coverage
  - Load testing (1k concurrent users)
  - UAT with 5 beta ONG + 50 donors
```

### **Phase 3: Production (Mois 5+)**

```
Backend:
  - All 9 microservices deployed
  - Horizontal scaling enabled
  - Monitoring (Prometheus + Grafana)
  - Disaster recovery plan
  
Mobile:
  - iOS via App Store
  - Android via Play Store
  - Over-the-air updates via EAS
  
Web:
  - Vercel production deployment
  - CDN global (caching)
  
Deployment Infrastructure:
  - AWS or GCP (recommended)
  - PostgreSQL: RDS with multi-AZ failover
  - Redis: ElastiCache cluster
  - Load balancer: Application Load Balancer
  
Testing:
  - 90%+ code coverage
  - Continuous load testing
  - Monthly security audits
```

### **Deployment Checklist**

```
Before launch:
  ☐ All unit tests passing
  ☐ All integration tests passing
  ☐ Load testing OK (target: 5k concurrent)
  ☐ Security audit passed
  ☐ Database backups automated
  ☐ Monitoring dashboards live
  ☐ Alerting configured
  ☐ Runbooks for incidents
  ☐ Team trained on deployments
  ☐ Documentation complete
  ☐ Legal/compliance review done
  ☐ Terms of service finalized
```

---

## 💡 Bonnes Pratiques

### **Code Quality**

```
Naming:
  ✅ Classes: PascalCase (DonationService)
  ✅ Methods: camelCase (processDonation)
  ✅ Constants: SNAKE_CASE (MAX_DONATION_AMOUNT)
  ✅ Tables: snake_case (user_donations)
  
Architecture Layers (Clean Code):
  ✅ Controller: Handle HTTP, validate input
  ✅ Service: Business logic, orchestrate
  ✅ Repository: Data access, queries
  ✅ DTO: Data transfer objects for API
  ✅ Entity: Database models
  
Comments:
  ✅ Why, not what (code shows what, comments explain why)
  ✅ TODOs with tickets: // TODO: TASK-123 Optimize query
  
Testing:
  ✅ Unit: Test one function, mock dependencies
  ✅ Integration: Test service with real DB (TestContainers)
  ✅ E2E: Test full flow (mobile app → backend → DB)
  ✅ Naming: testValidateDonationAmount_WhenAmountTooLow_ShouldReject()
```

### **API Design**

```
RESTful Conventions:
  GET    /api/v1/campaigns          → List campaigns
  GET    /api/v1/campaigns/{id}      → Get one campaign
  POST   /api/v1/campaigns           → Create campaign
  PUT    /api/v1/campaigns/{id}      → Update entire campaign
  PATCH  /api/v1/campaigns/{id}      → Partial update
  DELETE /api/v1/campaigns/{id}      → Delete campaign
  
Versioning:
  ✅ URL: /api/v1/, /api/v2/
  ✅ Header: X-API-Version: 1
  ✅ Deprecation: 6-month support after v2 release
  
Response Format:
  {
    "status": "success" | "error",
    "data": { ... },
    "errors": [ ... ],
    "meta": {
      "page": 1,
      "per_page": 10,
      "total": 45,
      "timestamp": "2026-02-25T14:30:00Z"
    }
  }
  
Error Codes:
  200 OK                    → Request successful
  201 Created               → Resource created
  400 Bad Request           → Invalid input
  401 Unauthorized          → Missing/invalid auth
  403 Forbidden             → Sufficient auth but access denied
  404 Not Found             → Resource doesn't exist
  422 Unprocessable Entity  → Validation failed
  500 Internal Server Error → Server fault
  503 Service Unavailable   → Temporary outage
```

### **Database Best Practices**

```
Schema Design:
  ✅ Primary keys: UUID (not auto-increment)
  ✅ Timestamps: created_at (immutable), updated_at (nullable)
  ✅ Soft deletes: is_deleted boolean (if needed)
  ✅ Indexes: On frequently queried columns (email, user_id)
  
Optimization:
  ✅ Denormalization: Avoid select * queries
  ✅ Pagination: Always limit results (default 10, max 100)
  ✅ Caching: Redis for frequently accessed data
  ✅ Query analysis: EXPLAIN plan before deploy
  
Partitioning (for scale):
  ✅ Donations table: Partition by month to keep size < 1GB
  ✅ Transactions: Similar archival strategy
```

### **Monitoring & Observability**

```
Metrics (Prometheus):
  - http_requests_total{method="GET",status="200"}
  - http_request_duration_seconds (latency)
  - db_query_duration_seconds
  - donation_amount_total (total donated)
  - active_donors_count
  
Logs (ELK Stack):
  - Level: DEBUG, INFO, WARN, ERROR
  - Format: JSON for easy parsing
  - Fields: timestamp, service, user_id, action, duration
  
Tracing (Jaeger):
  - Trace donation flow across all services
  - Identify slow APIs, bottlenecks
  
Alerts:
  - Error rate > 1%: Page oncall
  - P99 latency > 1s: Notify team
  - DB connection pool > 80%: Scale
  - Payment webhook timeout: Retry logic
```

### **Documentation**

```
Tech Stack:
  📖 README.md: Quick start, setup instructions
  📖 ARCHITECTURE.md: This doc + diagrams
  📖 API.md: OpenAPI/Swagger (auto-generated from code)
  📖 DEPLOYMENT.md: Infrastructure, CI/CD, runbooks
  📖 CONTRIBUTING.md: Code style, PR process, release cycle
  
Inline:
  ✅ Complex algorithms: Explain with comments
  ✅ Gotchas: /// IMPORTANT: This order matters
  ✅ API endpoints: JavaDoc + Swagger annotations
  
Diagrams:
  ✅ System architecture: C4 or Mermaid
  ✅ Data flow: Sequence diagrams
  ✅ Database: ER diagram
  ✅ Microservices: Service dependency graph
```

---

## 🎓 Recommandations Finales

### **Choix Gagnants ✅ (Recommandés)**

| Aspect | Choix | Raison |
|--------|-------|--------|
| **Backend Language** | Java 21 + Spring Boot 3.2 | Enterprise-grade, ecosystem riche, performance |
| **Frontend Mobile** | React Native + Expo | Cross-platform, large community, eas.build excellent |
| **Frontend Web** | Angular 17+ | TypeScript-first, robuste, enterprise |
| **Database Principal** | PostgreSQL 15+ | ACID, JSONB, mature, free/open-source |
| **Cache & Sessions** | Redis 7+ | Fast, reliable, excellent for real-time |
| **Message Queue** | RabbitMQ | Mature, reliable, dead-letter queues |
| **Blockchain MVP** | Stellar | Low-cost, fast, perfect pour payments Africain |
| **Deployment Mobile** | EAS (Expo) | Simple, OTA updates, no native build setup |
| **Deployment Web** | Vercel | Serverless, global CDN, auto-scaling |
| **Deployment Backend** | Kubernetes (prod) ou VPS (MVP) | Scalable, industry standard ou cost-effective |
| **ML/Matching** | Scikit-learn (Python microservice) | DEPRECATED: use Java ML5 ou in-service ML |
| **Monitoring** | Prometheus + Grafana | Free, powerful, industry standard |

### **Pièges à Éviter ❌**

| Piège | Pourquoi pas | Alternative |
|-------|-------------|------------|
| **Django/Flask** | Trop lent pour microservices, Python GIL | → Java Spring Boot |
| **MongoDB partout** | Incohérence sans ACID transactions | → PostgreSQL ACID |
| **Ethereum mainnet** | Frais élevés (gas), lent | → Stellar ou L2 (Arbitrum) |
| **GraphQL** | Complexity ajoutée, N+1 queries | → REST + caching |
| **Express.js seul** | Manque structure, hard to scale | → Java/Go microservices |
| **No testing** | Dépendance sur Dieu, regressions | → MIN 80% coverage |
| **Hardcoded configs** | Impossible changer production | → Environment variables + Vault |
| **No monitoring** | Aveugle à production, bugs lents | → Prometheus + alerting |
| **Single database** | Bottleneck, inflexible | → PostgreSQL + MongoDB + Redis |

### **Quick Start (Semaine 1)**

```
Day 1: Environment Setup
  mkdir -p actforgood/{backend,mobile,web}
  cd backend && spring init --type=gradle --language=java
  cd ../mobile && npx expo-cli init
  cd ../web && ng new

Day 2-3: Database Schema
  psql: Create databases + tables (ER diagram from above)
  Redis: Configure dev environment
  
Day 4-5: Core Backend Services
  User Service: Auth endpoints, JWT
  Campaign Service: CRUD operations
  Donation Service: Draft implementation
  
Day 6-7: Mobile & Web Foundation
  React Native: Login screen, navigation
  Angular: Admin login, dashboard skeleton
  Connect to backend APIs
  
Day 8+: Testing & Iteration
  Unit tests for services
  Integration tests with TestContainers
  E2E tests with Cypress (web)
  
Success Criteria Week 1:
  ✅ Can create user account
  ✅ Can login with JWT
  ✅ Can fetch campaigns list
  ✅ Basic donate form (no real payments yet)
```

---

## 📚 Resources

### **Learning**
- Spring Boot: https://spring.io/guides
- React Native: https://reactnative.dev/docs/getting-started
- Angular: https://angular.io/guide/quickstart
- PostgreSQL: https://www.postgresql.org/docs/
- Kubernetes: https://kubernetes.io/docs/

### **External Services Docs**
- Orange Money: [Partner Portal]
- MTN MoMo: [Developer Docs]
- Brevo: https://developers.brevo.com/
- Stellar: https://developers.stellar.org/
- EAS: https://docs.expo.dev/build/introduction/

### **Community**
- Stack Overflow: Tag questions carefully
- GitHub Discussions: Ask questions in public
- Discord/Slack: Join tech communities
- Local: IUSJC-PMI meetups Cameroun

---

## 📞 Questions?

Pour questions architecture, security, ou recommandations techniques:
1. Vérifiez ce document d'abord
2. Posez sur Stack Overflow (tag: microservices, spring-boot, react-native)
3. Consultez la documentation officielle des frameworks
4. Discutez en team pour consensus

**Bonne chance! 🚀**

---

**Document créé**: 25 février 2026  
**Dernière mise à jour**: 25 février 2026  
**Status**: ✅ PRÊT POUR DÉVELOPPEMENT  
**Version**: 1.0.0

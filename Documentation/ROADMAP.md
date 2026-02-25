# 🛣️ ActForGood - Feuille de Route Développement (Roadmap)

**Objectif**: De zéro à production en 6 mois avec MVP fonctionnel.

---

## 📅 Timeline Globale

```
JANVIER 2026:   Foundation (Backend setup)
FÉVRIER 2026:   Core Services + Database
MARS 2026:      Mobile MVP
AVRIL 2026:     Web Admin + Testing
MAI 2026:       Blockchain & Matching IA
JUIN 2026:      Production Deployment
```

---

## **PHASE 1: SETUP & FOUNDATION (Semaines 1-2)**

### Week 1: Infrastructure & Project Setup

**Goals**:
- ✅ Git repo + CI/CD pipeline
- ✅ Docker environment
- ✅ Database schema created
- ✅ API Gateway skeleton

**Tasks**:

```
Backend Setup:
  ☐ Create GitHub repo: actforgood/backend
  ☐ Maven multi-module setup:
    - api-gateway (Spring Cloud Gateway)
    - user-service (JWT auth)
    - shared-dto (DTO library)
  ☐ Docker Compose with:
    - PostgreSQL 15
    - Redis 7
    - RabbitMQ
  ☐ GitHub Actions CI/CD:
    - Build on push
    - Unit tests run
    - SonarQube analysis
  ☐ Application properties:
    - Dev: localhost, h2 (in-memory DB)
    - Prod: environment variables

Database:
  ☐ PostgreSQL schema (from ER diagram)
  ☐ Create users table with verification
  ☐ Create wallets table (for future)
  ☐ Migration scripts (Flyway)
  ☐ Seed test data (5 test users)

Frontend Setup:
  ☐ Mobile: npx expo init ActForGood-Mobile
  ☐ Web: ng new actforgood-web
  ☐ Git submodules or separate repos

DevOps:
  ☐ Heroku / AWS account setup (optional MVP)
  ☐ Docker registry (Docker Hub or private)
```

### Week 2: Core Microservices Infrastructure

**Goals**:
- ✅ API Gateway working
- ✅ User Service with auth
- ✅ Service discovery (Eureka)
- ✅ First endpoints tested

**Tasks**:

```
User Service:
  ☐ Endpoints:
    POST /api/v1/auth/register
    POST /api/v1/auth/login
    GET /api/v1/auth/verify/{token}
    POST /api/v1/auth/refresh
    GET /api/v1/users/{id}
    PUT /api/v1/users/{id}
  ☐ JWT generation (HS256)
  ☐ Password hashing (bcrypt, cost=12)
  ☐ Role-based endpoints (VISITOR, DONOR, ONG, ADMIN)
  ☐ Unit tests (UserService): 90%+ coverage
  ☐ Integration tests with testcontainers
  ☐ Exception handling + proper HTTP codes

API Gateway:
  ☐ Spring Cloud Gateway setup
  ☐ Route to user-service:/api/v1/users/**
  ☐ Route to campaign-service:/api/v1/campaigns/**
  ☐ Add JWT validation filter
  ☐ Add request logging filter
  ☐ CORS configuration

Service Discovery:
  ☐ Eureka Server setup
  ☐ Register user-service
  ☐ Health checks enabled

Configuration Server:
  ☐ Spring Cloud Config setup OR
  ☐ Centralized application.yml in git
  ☐ Dev/prod profiles

Mobile Foundation:
  ☐ Project structure
  ☐ npm/expo setup
  ☐ Basic navigation (React Navigation)
  ☐ Redux store setup
  ☐ API client with axios

Web Foundation:
  ☐ Angular project structure
  ☐ Routing setup
  ☐ NgRx store skeleton
  ☐ HTTP interceptor for JWT

Testing:
  ☐ Run: mvn test (all green)
  ☐ Coverage report: target/site/jacoco
  ☐ SonarQube analysis (if using)
```

---

## **PHASE 2: CORE SERVICES (Semaines 3-6)**

### Week 3-4: Campaign Service + Database

**Goals**:
- ✅ ONG can create campaigns
- ✅ Campaigns visible to all
- ✅ Campaign validation by admin
- ✅ Real-time project impact tracking

**Tasks**:

```
Campaign Service:
  ☐ Entities:
    Campaign { id, ong_id, title, description, target_amount, 
               status, category, urgency, location, deadline }
    CampaignDocument { id, campaign_id, file_path, doc_type, hash }
    CampaignMetric { id, campaign_id, students_helped, timestamp }
  
  ☐ Endpoints:
    POST /api/v1/campaigns (create)
    GET /api/v1/campaigns (list with pagination)
    GET /api/v1/campaigns/{id} (detail)
    PUT /api/v1/campaigns/{id} (update)
    DELETE /api/v1/campaigns/{id} (soft delete)
    GET /api/v1/campaigns/{id}/metrics (impact data)
  
  ☐ Business Logic:
    - Only ONG (verified) can create
    - Document upload (S3 or local storage)
    - File hash for verification
    - Status workflow: DRAFT → SUBMITTED → ACTIVE/REJECTED
    - Calculate impact score (rule-based)
    - Trigger notifications on status change
  
  ☐ Database:
    - campaigns table
    - campaign_documents table
    - campaign_metrics table (for impact)
    - Indexes on: ong_id, status, created_at
  
  ☐ Services:
    - CampaignService (business logic)
    - DocumentStorageService (S3/local)
    - ImpactCalculatorService (metrics)
  
  ☐ Tests:
    - Unit: CampaignService (mock dependency)
    - Integration: CampaignController with real DB
    - Test document upload
    - Test validation rules

Admin Service (Lite):
  ☐ Endpoints:
    GET /api/v1/admin/campaigns/pending
    POST /api/v1/admin/campaigns/{id}/validate
    GET /api/v1/admin/ong/pending
    POST /api/v1/admin/ong/{id}/validate
  
  ☐ Features:
    - List ONG/campaigns awaiting validation
    - Approve/reject with comments
    - Send notifications
    - Audit logging

Wallet Service (Schema only):
  ☐ Create tables:
    wallets { wallet_id, user_id, balance, ... }
    wallet_transactions { ... }
  ☐ Service skeleton (implement in Phase 3)

Mobile:
  ☐ Screens:
    - LoginScreen
    - RegisterScreen
    - CampaignListScreen
    - CampaignDetailScreen
  ☐ Redux:
    - authSlice (auth state)
    - campaignSlice (campaigns list + detail)
    - uiSlice (loading, errors)
  ☐ API Client:
    - getCampaigns()
    - getCampaignDetail(id)
    - login/register
  ☐ Navigation:
    - Stack: Auth → Home (tabs)
    - Tabs: Campaigns, Account, Chat

Web:
  ☐ Pages:
    - LoginPage
    - CampaignListPage (for ONG viewing)
    - AdminDashboard (pending campaigns)
  ☐ Components:
    - CampaignCard
    - CampaignForm (for ONG)
    - AdminValidationForm
  ☐ Services:
    - CampaignService (API calls)
    - AdminService
  ☐ Routing:
    /login
    /dashboard (admin)
    /campaigns
    /campaigns/:id
```

### Week 5-6: Donation Service + Wallet

**Goals**:
- ✅ Deposit-to-wallet flow working
- ✅ Calculate & process donations
- ✅ Commission tracking
- ✅ Real-time balance updates

**Tasks**:

```
Wallet Service:
  ☐ Entities:
    Wallet { id, user_id, balance, locked_amount, ... }
    WalletTransaction { id, wallet_id, type, amount, ... }
  
  ☐ Endpoints:
    GET /api/v1/wallet (get balance)
    POST /api/v1/wallet/deposit (initiate)
    GET /api/v1/wallet/transactions (history)
  
  ☐ Logic:
    - Lock funds during transaction
    - Real-time balance (Redis)
    - Transaction history (PostgreSQL)
    - Refund logic on failure
  
  ☐ Integration with Payment Gateway:
    - Stripe API (test mode)
    - Handle webhook callback
    - Update wallet on success
  
  ☐ Redis:
    - Cache: wallet:{userId} → wallet balance
    - TTL: 5 minutes
    - Invalidate on update

Donation Service:
  ☐ Entities:
    Donation { id, donor_id, campaign_id, amount, 
              commission_amount, ong_receives_amount, status }
  
  ☐ Endpoints:
    POST /api/v1/donations (create)
    GET /api/v1/donations (my donations)
    GET /api/v1/donations/{id} (detail with blockchain)
  
  ☐ Business Logic:
    1. Validate wallet balance
    2. Lock amount in wallet
    3. Calculate: commission = amount * 0.15
    4. Create donation record (status=PROCESSING)
    5. Publish event: donation.created
    6. Return to client (async confirmation)
  
  ☐ Event Publishing (RabbitMQ):
    - donation.created → blockchain-service + notification-service
    - Wait for blockchain confirmation
    - On confirmation: debit wallet, credit ONG, mark COMPLETED
    - On failure: unlock funds, mark FAILED
  
  ☐ Tests:
    - Test commission calculation
    - Test insufficient funds error
    - Test wallet locking/unlocking
    - Test donation lifecycle

Payment Service (Lite for MVP):
  ☐ Stripe integration (test keys)
  ☐ Endpoints:
    POST /api/v1/payments/deposit (initiate)
    POST /webhook/stripe (receive callback)
  ☐ Webhook handling:
    - Verify signature
    - Update wallet on success
    - Handle failures gracefully
  ☐ No Orange Money yet (Phase 3)

Mobile:
  ☐ Screens:
    - WalletScreen (show balance + history)
    - DepositScreen (add funds form)
    - DonationFlowScreen (multi-step)
  ☐ Redux:
    - walletSlice (balance, transactions)
    - donationSlice (pending donations)
  ☐ Forms:
    - DepositForm (amount selector)
    - ConfirmDonationForm (review before submit)
  ☐ Components:
    - BalanceCard
    - TransactionList
    - DonationReceipt (show blockchain hash)

Web:
  ☐ ONG Dashboard:
    - Stats: donations received, total, avg
    - Recent donations list
    - Impact metrics chart
  ☐ Admin Dashboard:
    - Transaction monitoring
    - Dispute resolution
    - Revenue tracking (commissions)

Database Backups:
  ☐ Auto-backup script (daily)
  ☐ Test restore procedure
```

---

## **PHASE 3: MATCHING IA & NOTIFICATIONS (Semaines 7-10)**

### Week 7-8: Matching Service (ML)

**Goals**:
- ✅ Recommend campaigns to donors
- ✅ Personalized experience
- ✅ Real-time geolocation matching

**Tasks**:

```
Matching Service (Java or separate Python):
  ☐ Data Collection:
    - Donor preferences: category, budget, location
    - Campaign features: category, urgency, impact, location
    - Donation history: past campaigns donated to
  
  ☐ ML Algorithms:
    - Collaborative Filtering (SVD):
      Build user-item matrix
      Decompose into latent factors
      Find similar donors
    - Content-Based (Cosine Similarity + TF-IDF):
      Vectorize campaign descriptions
      Match with donor preferences
    - Hybrid: 70% collab + 30% content
  
  ☐ Endpoints:
    GET /api/v1/matching/recommendations
      ?donor_id={id}&limit=10&radius=200
      Returns: [{campaign, score, distance, impact}]
  
  ☐ Real-Time Features:
    - Geolocation distance (haversine formula)
    - Urgency bonus (CRITICAL +3, HIGH +1.5)
    - Recency bonus (donated recently +0.5)
    - Impact score (benefit per FCFA)
  
  ☐ Caching:
    - Cache models in Redis
    - Cache recommendations (1 hour TTL)
    - Invalidate on new donation/campaign
  
  ☐ Batch Jobs:
    - Retrain model weekly (Quartz scheduler)
    - Update donor vectors
    - Update campaign vectors
    - Publish new model to Redis
  
  ☐ Metrics:
    - Monitor recommendation relevance
    - Track click-through rate
    - A/B test: model v1 vs v2
  
  ☐ Tests:
    - Unit: algorithm correctness
    - Integration: end-to-end recommendation
    - Performance: < 200ms response time

Scikit-Learn Integration (Option):
  ☐ If using Python ML:
    Separate Python microservice
    REST API to Java backend
    Or: Embedded ML5 Java library
    Or: TensorFlow Java bindings

Mobile:
  ☐ Screens:
    - MatchesScreen (personalized recommendations)
    - Add map view (show distance to campaign)
  ☐ Components:
    - CampaignRecommendationCard
    - MatchScoreBar (visual score 0-10)
    - DistanceIndicator
  ☐ Redux:
    - matchingSlice (recommendations list)
  ☐ API:
    - getRecommendations()
    - trackRecommendationClick() (for ML feedback)

Web:
  ☐ Analytics:
    - Show model metrics (accuracy, diversity)
    - Test new models (admin only)
```

### Week 9-10: Blockchain Service + Notifications

**Goals**:
- ✅ Record transactions on blockchain
- ✅ Real-time notifications
- ✅ Transparency proof

**Tasks**:

```
Blockchain Service:
  ☐ Smart Contract (Solidity - Ethereum/Polygon):
    contract DonationEscrow {
      function recordDonation(
        address donor,
        address ong,
        uint256 amount
      ) public {
        // Emit event
        // Store in mapping
        // Calculate hash
      }
    }
  
  ☐ Entities:
    BlockchainTransaction {
      id,
      donation_id,
      tx_hash,
      block_number,
      timestamp,
      network (ETHEREUM/STELLAR),
      status (PENDING/CONFIRMED)
    }
  
  ☐ Endpoints:
    POST /api/v1/blockchain/record (internal)
    GET /api/v1/blockchain/verify/{tx_hash}
    GET /api/v1/blockchain/transactions/{donation_id}
  
  ☐ Logic:
    1. Listen to donation.created event
    2. Call smart contract with donation data
    3. Monitor for confirmation (15-20 blocks)
    4. Update blockchain_tx table
    5. Publish blockchain.confirmed event
  
  ☐ RPC Provider:
    - Use Infura/Alchemy (free tier)
    - Or Stellar public network (free)
    - Fallback to local node (for testing)
  
  ☐ Async Job:
    - Every 5 minutes: check pending txs
    - Verify block confirmations
    - Retry if stuck
    - Alert if failed
  
  ☐ Tests:
    - Unit: hash calculation
    - Integration: with local blockchain (Ganache)
    - Verify smart contract call
    - Test event listening

Notification Service:
  ☐ Channels:
    - Email (Brevo API)
    - SMS (Brevo API)
    - Push notifications (Firebase Cloud Messaging)
  
  ☐ Entities:
    Notification {
      id, user_id, title, content,
      type (DONATION/ONG_VERIFIED/PROJECT_MATCH/CHAT),
      channel (EMAIL/SMS/PUSH),
      status (PENDING/SENT/FAILED),
      created_at
    }
    NotificationLog {
      id, notification_id, delivery_status, error_message
    }
  
  ☐ Endpoints:
    GET /api/v1/notifications (user's notifications)
    PATCH /api/v1/notifications/{id}/read
  
  ☐ Event Listeners:
    - Listen to donation.completed
      → Send "Thank you for 100k FCFA donation!"
      → Also notify ONG: "Received 85k from X"
    - Listen to blockchain.confirmed
      → Update donation status
    - Listen to campaign.activated
      → Notify eligible donors (async job)
    - Listen to ong.verified
      → Send "Congratulations, profile verified!"
  
  ☐ Templates:
    - donation_completed.html (email)
    - donation_confirmed.txt (SMS)
    - ong_verified_push.json (FCM)
  
  ☐ Queue (RabbitMQ):
    - notification.email (high priority)
    - notification.sms (high priority)
    - notification.push (low priority)
    - notification.digest (batch daily summary)
  
  ☐ Rate Limiting:
    - Max 5 emails per user per day
    - Max 10 SMSs per user per day
    - Throttle push (max 3 per hour)
  
  ☐ Tests:
    - Unit: email template rendering
    - Integration: Brevo API (sandbox)
    - Verify notifications sent
    - Test retries

Mobile:
  ☐ Screens:
    - NotificationCenterScreen
    - TransactionProofScreen (show blockchain hash + link)
  ☐ Components:
    - NotificationBanner (top alert)
    - NotificationList
    - BlockchainProofCard
  ☐ Firebase Setup:
    - FCM token registration
    - Local notification handler
    - Deep linking to donation detail

Web:
  ☐ Admin:
    - Notification audit log
    - Test send (to yourself)
    - Template editor (for admin)
  ☐ ONG:
    - Notification preferences
    - View received notifications
```

---

## **PHASE 4: TESTING & SECURITY (Semaines 11-14)**

**Goals**:
- ✅ 85%+ code coverage
- ✅ Security audit passed
- ✅ Load testing OK (1k concurrent)
- ✅ UAT with beta users

**Tasks**:

```
Automated Testing:
  ☐ Unit Tests:
    - Target: 85%+ code coverage
    - Use JUnit 5 + Mockito
    - Command: mvn clean test
    - Coverage report: target/site/jacoco/index.html
  
  ☐ Integration Tests:
    - TestContainers for PostgreSQL
    - In-memory databases for speed
    - Test full API flow (controller → service → repo)
    - Command: mvn integration-test
  
  ☐ E2E Tests (Cypress - Web, Appium - Mobile):
    - Login → Create Campaign → Donate → Verify blockchain
    - Mobile: Similar flow on device
    - Run in CI/CD pipeline
  
  ☐ Load Testing (JMeter):
    - Target: 1000 concurrent users
    - Metrics:
      - HTTP 200 responses: 99%
      - P99 latency: < 1000ms
      - Error rate: < 1%
    - Test scenarios:
      - List campaigns (read-heavy)
      - Deposit funds
      - Confirm donation
      - Admin validation

Manual Testing:
  ☐ UAT with Beta Users:
    - Recruit 5 ONG (real or trusted)
    - Recruit 50 donors (friends/family)
    - Test signup, KYC, donations
    - Collect feedback
  
  ☐ Test Cases by Feature:
    - Authentication: login, logout, refresh token, expire token
    - Wallet: deposit, check balance, transaction history
    - Donation: select campaign, confirm, track, refund
    - Admin: validate ONG, approve campaign
    - Matching: get recommendations, click tracking
    - Blockchain: verify transaction hash, view proof

Security Testing:
  ☐ SAST (Static Code Analysis):
    - SonarQube scan (check code smells)
    - Checkmarx (if available)
    - OWASP Dependency-Check (outdated libs)
  
  ☐ DAST (Dynamic Testing):
    - Burp Suite (or free ZAP)
    - Test SQL injection: username'; DROP--
    - Test XSS: <script>alert('xss')</script>
    - Test CSRF: missing token validation
    - Test auth bypass: modify JWT claims
    - Test rate limiting: 1000 requests in 1 second
  
  ☐ Penetration Testing:
    - Hire external firm (5k-10k FCFA)
    - Or use free options: OWASP Top 10
    - Document findings
    - Fix critical issues before production
  
  ☐ Security Checklist:
    ☐ Passwords hashed with bcrypt (cost 12+)
    ☐ JWT tokens signed with strong key (256-bit)
    ☐ HTTPS/TLS 1.3 enabled
    ☐ CORS properly scoped (not *)
    ☐ SQL injection prevented (parameterized queries)
    ☐ XSS prevented (HTML escaping)
    ☐ CSRF tokens on state-changing requests
    ☐ Rate limiting on sensitive endpoints
    ☐ API key rotation policy (90 days)
    ☐ Secrets not in code (use Vault/env vars)
    ☐ No PII in logs (mask emails, phones)
    ☐ Audit logging enabled
    ☐ Error messages don't leak info
    ☐ Dependencies updated

Documentation:
  ☐ API documentation (Swagger/OpenAPI)
  ☐ Architecture diagrams (C4/Mermaid)
  ☐ Database schema diagram
  ☐ Design decisions (ADR - Architecture Decision Records)
  ☐ Runbooks for common issues
  ☐ Deployment guide

Performance Optimization:
  ☐ Database:
    - Add indexes on frequently queried columns
    - Analyze query plans (EXPLAIN)
    - Consider denormalization for reports
  
  ☐ Caching:
    - Redis for session data
    - Redis for recommendation models
    - Consider Memcached for user data
  
  ☐ API:
    - Pagination (max 100 per page)
    - Lazy loading (don't fetch all details)
    - Compression (gzip, brotli)
    - CDN for static content
  
  ☐ Mobile:
    - Minimize bundle size
    - Lazy load screens
    - Image optimization (WebP)
    - Test on slow network (3G simulation)

Database Migration:
  ☐ Flyway or Liquibase setup
  ☐ All schema changes versioned
  ☐ Test rollback scenario
  ☐ Production migration plan
```

---

## **PHASE 5: PRODUCTION DEPLOYMENT (Semaines 15-18)**

**Goals**:
- ✅ All services running on production servers
- ✅ Monitoring + alerting live
- ✅ Backups automated
- ✅ Team trained on deployments

**Tasks**:

```
Infrastructure:
  ☐ Choose hosting:
    - AWS (recommended: RDS, ECS, S3)
    - GCP (similar)
    - Or: Self-managed VPS (DigitalOcean, Linode, Scaleway)
  
  ☐ Database:
    - RDS PostgreSQL (multi-AZ failover)
    - Store backups in S3 (daily, 30-day retention)
    - Test restore procedure monthly
  
  ☐ Cache:
    - ElastiCache Redis (cluster mode)
    - Or: Self-managed Redis cluster (3+ nodes)
  
  ☐ Message Queue:
    - RabbitMQ cluster (HA)
    - Or: AWS SQS (managed)
  
  ☐ Load Balancing:
    - AWS ALB or Nginx
    - Health checks every 30 seconds
    - Auto-scale based on CPU/memory
  
  ☐ Storage (for documents):
    - AWS S3 (encrypted)
    - Or: MinIO (self-hosted S3-compatible)
    - Versioning enabled
    - Lifecycle rules (delete old versions after 90 days)

Kubernetes Deployment:
  ☐ K8s cluster (3+ master nodes, 5+ worker nodes)
  ☐ Helm charts for each microservice
  ☐ Namespaces: default, logging, monitoring
  ☐ Ingress controller (Nginx)
  ☐ Certificate manager (Let's Encrypt)
  ☐ PersistentVolume for database/cache
  ☐ Pod autoscaling (HPA)
  ☐ Cluster autoscaling (CA)

CI/CD Pipeline (GitHub Actions):
  ☐ Trigger: on git push to main branch
  ☐ Steps:
    1. Build (maven package)
    2. Test (mvn test)
    3. SonarQube scan
    4. Build Docker image
    5. Push to registry
    6. Deploy to staging
    7. Run smoke tests
    8. Deploy to production
  ☐ Rollback: previous version available (blue-green deployment)

Monitoring & Observability:
  ☐ Metrics (Prometheus):
    - HTTP request count/duration
    - Database query time
    - Error rates
    - Donation amount total
    - Active donors
    - System CPU/memory/disk
  
  ☐ Dashboards (Grafana):
    - Overall system health
    - Service-level objectives (SLOs)
    - Business metrics (donations, ONG, impact)
  
  ☐ Logs (ELK Stack):
    - Elasticsearch: store logs
    - Logstash: parse/enrich logs
    - Kibana: visualize
    - Or: CloudWatch (AWS) / Stackdriver (GCP)
  
  ☐ Tracing (Jaeger):
    - Follow donation across services
    - Identify bottlenecks
  
  ☐ Alerting:
    - Error rate > 1%: Page oncall
    - P99 latency > 2s: Notify team
    - DB connection pool > 80%: Scale
    - Disk usage > 90%: Alert
  
  ☐ Uptime Monitoring:
    - Ping health endpoint every minute
    - Alert if down > 1 minute

Backups & Disaster Recovery:
  ☐ Database:
    - Daily automated backups
    - Test restore monthly
    - 30-day retention
  
  ☐ Configuration:
    - Git repo (all config versioned)
    - Secrets in Vault (not in git)
  
  ☐ Recovery Plan:
    - RTO (Recovery Time Objective): 1 hour
    - RPO (Recovery Point Objective): 1 hour
    - Document incident response
    - Team training quarterly

Mobile Deployment:
  ☐ iOS:
    - Build with EAS
    - TestFlight beta (2 weeks)
    - Submit to App Store
    - Review time: 1-3 days
    - Release (gradual rollout: 25%, 50%, 100%)
  
  ☐ Android:
    - Build with EAS
    - Beta on Play Store (2 weeks)
    - Submit for review
    - Review time: 2-4 hours
    - Release (gradual rollout)

Web Deployment:
  ☐ Admin Web (Angular):
    - Deploy to Vercel
    - Auto-builds on git push
    - CDN global
    - SSL certificate auto-renewed
  
  ☐ ONG Web (separate or same):
    - Similar to Admin

Go-Live Checklist:
  ☐ Database migrations tested
  ☐ All monitoring dashboards live
  ☐ Alerting configured
  ☐ Incident runbooks written
  ☐ On-call rotation established
  ☐ Team trained
  ☐ Load testing passed
  ☐ Security audit passed
  ☐ Legal/compliance approved
  ☐ Customer support ready
  ☐ Documentation complete

Day 1 (Launch):
  ☐ Deploy backend services
  ☐ Verify health checks passing
  ☐ Deploy web (admin)
  ☐ Announce to beta users
  ☐ Monitor closely (first 24h)
  ☐ Be ready to rollback
```

---

## **Post-Launch (Semaines 19+)**

**Goals**:
- ✅ Stable production
- ✅ User feedback incorporated
- ✅ Continuous improvement

**Tasks**:

```
Week 1-2 Post-Launch (Production Stabilization):
  ☐ Monitor metrics 24/7
  ☐ Fix critical bugs (within hours)
  ☐ Respond to user feedback
  ☐ Incident response practice
  ☐ Daily standup on issues

Phase 2 Features (Months 2-3):
  ☐ Orange Money direct integration
  ☐ Gamification (badges, leaderboards)
  ☐ Community forum
  ☐ Impact report generation
  ☐ Advanced analytics

Phase 3 Features (Months 4-6):
  ☐ Crypto donations (Stellar, USDC)
  ☐ Recurring donations
  ☐ Volunteer matching
  ☐ Corporate CSR integration
  ☐ Government partnership dashboard

Growth Targeting:
  ☐ 100 ONG registered (2 months)
  ☐ 5000 donors active (3 months)
  ☐ 50M FCFA donated (6 months)
  ☐ 10,000 children impacted (12 months)
```

---

## 📊 Team & Resources

### Recommended Team Size

```
Phase 1-2 (6 people - 3 months):
  - 1 Tech Lead / Architect
  - 2 Backend Engineers
  - 1 Frontend Engineer (mobile)
  - 1 Frontend Engineer (web)
  - 1 DevOps / Infrastructure
  - (Part-time) Product Manager

Phase 3-4 (10 people - 3 months):
  + 2 QA Engineers
  + 1 ML Engineer (for matching)
  + 1 Designer/UX
  + (Full-time) Product Manager

Phase 5+ (15-20 people):
  + 2 Customer Support
  + 1 Security Engineer
  + 1 DevOps Engineer #2
  + Specialists as needed
```

### Tech Stack Summary

```
Backend:
  - Java 21 + Spring Boot 3.2
  - Spring Data JPA + Hibernate
  - Spring Security + JWT
  - Spring Cloud Gateway
  - RabbitMQ (message queue)
  - PostgreSQL 15 + MongoDB
  - Redis 7
  - Docker + Kubernetes

Frontend Mobile:
  - React Native + Expo
  - Redux Toolkit / Zustand
  - React Navigation
  - Axios (HTTP client)
  - Socket.io (real-time)

Frontend Web:
  - Angular 17+
  - NgRx (state management)
  - TypeScript
  - RxJS
  - Bootstrap / Tailwind

DevOps:
  - Docker + Docker Compose
  - Kubernetes
  - GitHub Actions (CI/CD)
  - Prometheus + Grafana
  - ELK Stack (logging)

External Services:
  - Stripe (payments)
  - Brevo (email/SMS)
  - Ethereum / Stellar (blockchain)
  - Firebase (push notifications)
  - AWS / GCP (hosting)
```

---

## 💰 Budget Estimation (6 months MVP)

```
Development:
  6 engineers × 6 months × 50k FCFA/month = 1.8M FCFA

Infrastructure (AWS/GCP):
  Dev: 500 FCFA/month
  Staging: 1,000 FCFA/month
  Production: 5,000 FCFA/month
  Total 6 months: ~40k FCFA

Services & Tools:
  GitHub / GitLab: free
  SonarQube: free
  Heroku / Vercel: 5k FCFA/month = 30k FCFA
  Domain name: 50k FCFA
  SSL certificate: free (Let's Encrypt)
  Stripe / Brevo: pay per transaction

Legal & Compliance:
  Lawyer review: 200-500k FCFA
  Security audit: 300-600k FCFA
  Compliance (ANIF): variable

TOTAL: ~2.5-3.5M FCFA

Cost Optimization:
  ✅ Use free tiers as much as possible
  ✅ Open-source tools (PostgreSQL, Redis, RabbitMQ)
  ✅ Cloud credits (AWS startup program)
  ✅ Negotiate with service providers (Brevo, Stripe)
```

---

## 🎓 Learning Resources During Development

```
Java/Spring Boot:
  - Spring Boot Tutorial: https://spring.io/guides
  - Baeldung blog (excellent tutorials)
  - Book: "Spring in Action" (6th edition)

Microservices:
  - "Building Microservices" by Sam Newman
  - Spring Cloud documentation

React Native:
  - Official docs: https://reactnative.dev
  - Expo documentation: https://docs.expo.dev

Angular:
  - Official tutorial: https://angular.io/tutorial
  - Fireship.io (YouTube, paid courses)

Database:
  - PostgreSQL docs: https://www.postgresql.org/docs
  - MongoDB university: https://university.mongodb.com

Blockchain:
  - Ethereum docs: https://ethereum.org/en/developers
  - Stellar docs: https://developers.stellar.org

DevOps/Kubernetes:
  - Kubernetes official: https://kubernetes.io/docs
  - Docker docs: https://docs.docker.com
  - YouTube: "Docker & Kubernetes Complete Guide"

Community:
  - Stack Overflow
  - GitHub Reddit (/r/webdev, /r/java, /r/reactnative)
  - Local meetups (Cameroon tech community)
```

---

## ✅ Critical Success Factors

```
1. **Execution Speed**
   - Don't over-engineer MVP
   - Use existing APIs (Stripe, not building bank from scratch)
   - Ruthlessly prioritize features

2. **User Feedback**
   - Test with real ONG early (week 4)
   - Iterate based on feedback
   - Kill features that don't resonate

3. **Team Alignment**
   - Daily standups (async if remote)
   - Clear ownership (who owns what service)
   - Document decisions (ADR)

4. **Security from Day 1**
   - Password hashing, JWT, HTTPS
   - Don't skip authentication
   - Regular security reviews

5. **Monitoring from Day 1**
   - Logs, metrics, alerts
   - Be proactive, not reactive
   - Catch bugs before users do

6. **Testing Culture**
   - Write tests alongside code
   - Not after (too late)
   - Aim for 80%+ coverage

7. **Communication with Stakeholders**
   - Weekly demos
   - Transparent about blockers
   - Set realistic expectations
```

---

## 🚀 Final Checklist: Ready to Start?

```
Before coding:
  ☐ Team assembled
  ☐ Budget approved
  ☐ Tech stack decided
  ☐ Timeline agreed
  ☐ Git repo created
  ☐ Server infrastructure ready OR planned
  ☐ API contracts defined
  ☐ Database schema approved
  ☐ Everyone trained on tech stack

After Week 1:
  ☐ CI/CD pipeline working
  ☐ Can deploy code with 1 command
  ☐ Docker containers building
  ☐ Database migrations applied
  ☐ Health checks passing

After Week 2:
  ☐ User Service complete + tested
  ☐ Campaign Service skeleton done
  ☐ Mobile/Web can login
  ☐ API documented (Swagger)

...continue through phases...

Production Launch:
  ☐ All tests passing
  ☐ Load testing OK
  ☐ Security audit passed
  ☐ Backup/recovery tested
  ☐ Team ready for support
  ☐ Documentation complete
  ☐ Legal/compliance approved
  ☐ Go/No-Go decision made
```

---

**Good luck! You've got this! 🚀**

**Questions? 💬**
- Review Architecture docs: ARCHITECTURE_COMPLETE.md
- Wallet system: WALLET_BANKING_SYSTEM.md
- This roadmap: ROADMAP.md

---

**Document Version**: 1.0  
**Last Updated**: 25 février 2026  
**Status**: ✅ Ready for Development

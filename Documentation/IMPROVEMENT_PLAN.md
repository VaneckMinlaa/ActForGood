# 🔨 Plan d'Amélioration du Projet ActForGood

**Date**: 25 février 2026
**Status**: En cours
**Base Architecture**: ARCHITECTURE_COMPLETE.md

---

## 📊 État Actuel vs Recommandé

### ✅ Ce qui existe déjà (Excellent!)

```
✅ Backend:
   - Spring Boot 3.2.0 (correct)
   - Java 17 (recommander upgrader à 21)
   - PostgreSQL 16 (bon, recommander 15+)
   - Redis 7 (parfait)
   - Structure microservices (user, campaign, payment, blockchain, etc.)

✅ Mobile:
   - React Native + Expo (parfait)
   - Redux Toolkit v2.5 (bon, recommander Zustand)
   - React Navigation (correct)
   - TypeScript (excellent)

✅ Web:
   - Angular 17 (parfait)
   - NgRx store (bon)
   - Angular Material (bon)
   - TypeScript (excellent)

✅ DevOps:
   - Docker Compose setup
   - PostgreSQL et Redis configurés
```

### 🔧 Ce qui doit être amélioré

```
⚠️ Architecture:
   - Manque: API Gateway configuration complète
   - Manque: Service Discovery (Eureka)
   - Manque: Spring Cloud Config
   - Ajouter: Wallet Service manquant
   - Ajouter: Notification Service manquant
   - Ajouter: Report Service manquant

⚠️ Mobile:
   - Manque: Architecture Clean implémentation
   - Manque: Service layer structuré
   - Manque: Repository pattern
   - Améliorer: Store organization

⚠️ Web:
   - Manque: Architecture Clean implémentation
   - Manque: Guards et Interceptors configurés
   - Améliorer: Module structure

⚠️ Sécurité:
   - Ajouter: JWT implementation complète
   - Ajouter: Spring Security 6
   - Ajouter: CORS configuration
   - Ajouter: Rate limiting

⚠️ Database:
   - Manque: Flyway/Liquibase migrations
   - Manque: Database schema validation
   - Ajouter: Indexes optimization

⚠️ Testing:
   - Manque: TestContainers setup
   - Manque: Unit/Integration tests

⚠️ Monitoring:
   - Manque: Logging (SLF4J + Logback)
   - Manque: Metrics (Micrometer)
   - Manque: RabbitMQ setup
```

---

## 🎯 Plan d'Action (Priorité)

### **Priorité 1: Base Infrastructure (Semaine 1)**

```
☐ Java 21 upgrade (user-service, tous services)
☐ API Gateway configuration complète
   - Spring Cloud Gateway 2023.0.0
   - JWT validation filter
   - Request logging
   - CORS setup
☐ Service Discovery setup
   - Eureka Server
   - Service registration (all services)
   - Health checks
☐ Spring Cloud Config
   - Config server setup
   - application-dev.yml, application-prod.yml
☐ RabbitMQ Docker Compose
☐ Common DTOs module
   - Shared entre services
   - Request/Response models
```

### **Priorité 2: Microservices Complétion (Semaine 2-3)**

```
☐ Wallet Service (NOUVEAU)
   - Entities: Wallet, WalletTransaction
   - CRUD endpoints
   - Redis caching
   - Stripe integration

☐ Notification Service (NOUVEAU)
   - Entities: Notification, NotificationLog
   - Event listeners (RabbitMQ)
   - Email/SMS templates
   - Brevo API integration

☐ Payment Service (Mise à jour)
   - Stripe integration complete
   - Webhook handling
   - Orange Money integration (phase 2)

☐ Blockchain Service (Mise à jour)
   - Complete Stellar/Ethereum integration
   - Smart contract interaction
   - Transaction recording

☐ Enhance existing services
   - Add validation layer
   - Add exception handling
   - Add logging
   - Add unit tests
```

### **Priorité 3: Architecture Clean (Semaine 3-4)**

**Mobile (React Native)**:

```
☐ Refactor structure:
   src/
   ├── Presentation/          ← UIComponents
   │   ├── Screens/
   │   └── Components/
   ├── ViewModel/             ← Redux/State
   │   └── slices/
   ├── Repository/            ← Data Access
   │   ├── repositories/
   │   └── mappers/
   ├── Services/              ← API Calls
   │   ├── ApiClient.ts
   │   ├── AuthService.ts
   │   └── DonationService.ts
   ├── Models/                ← Data Entities
   │   ├── Campaign.ts
   │   └── Donation.ts
   ├── Utilities/
   │   ├── security/
   │   ├── validation/
   │   └── formatting/
   └── Constants/

☐ Add layers:
   - Service layer (API calls)
   - Repository pattern
   - Mappers (DTO → Model)
   - Type-safe error handling
```

**Web (Angular)**:

```
☐ Refactor structure:
   src/app/
   ├── Presentation/          ← Components & Pages
   │   ├── pages/
   │   ├── components/
   │   └── directives/
   ├── Store/                 ← State (NgRx)
   │   ├── campaign/
   │   ├── auth/
   │   └── effects/
   ├── Services/              ← Business Logic
   │   ├── auth.service.ts
   │   ├── campaign.service.ts
   │   └── transaction.service.ts
   ├── Models/                ← Interfaces
   │   ├── Campaign.ts
   │   ├── Transaction.ts
   │   └── enums/
   ├── Guards/                ← Route Protection
   │   ├── auth.guard.ts
   │   └── admin.guard.ts
   ├── Interceptors/          ← HTTP
   │   ├── auth.interceptor.ts
   │   ├── error.interceptor.ts
   │   └── logging.interceptor.ts
   ├── Utilities/
   │   ├── validators/
   │   └── helpers/
   └── Config/

☐ Add modules:
   - Core module (single instance)
   - Shared module (common components)
   - Feature modules (lazy loading)
```

**Backend (Java)**:

```
☐ Standardize each service structure:
   src/main/java/com/actforgood/{service}/
   ├── controller/            ← REST endpoints
   │   └── CampaignController.java
   ├── service/               ← Business logic
   │   ├── CampaignService.java
   │   └── CampaignServiceImpl.java
   ├── repository/            ← Data access
   │   └── CampaignRepository.java
   ├── entity/                ← JPA entities
   │   └── Campaign.java
   ├── dto/                   ← Data transfer objects
   │   ├── CampaignDTO.java
   │   └── ApiResponse.java
   ├── exception/             ← Custom exceptions
   │   ├── ResourceNotFoundException.java
   │   └── GlovalExceptionHandler.java
   ├── mapper/                ← Entity ↔ DTO
   │   └── CampaignMapper.java
   ├── config/                ← Configuration
   │   ├── WebConfig.java
   │   └── SecurityConfig.java
   ├── util/                  ← Utilities
   │   └── ValidationUtil.java
   └── Application.properties

☐ Common shared library:
   All services use: com.actforgood.shared
   ├── dto/                   ← Common DTOs
   ├── exception/             ← Common exceptions
   ├── util/                  ← Common utils
   └── entity/                ← Common entities
```

```

### **Priorité 4: Security & Testing (Semaine 4)**

```

☐ Security Implementation:
☐ Spring Security 6 + JWT
☐ Password encryption (bcrypt)
☐ CORS configuration
☐ Rate limiting (spring-cloud-circuitbreaker)
☐ API key rotation
☐ Audit logging

☐ Testing Setup:
☐ TestContainers for PostgreSQL
☐ Unit tests (min 80% coverage)
☐ Integration tests
☐ E2E tests (mobile & web)
☐ Load testing (JMeter)

☐ Logging & Monitoring:
☐ SLF4J + Logback configuration
☐ Micrometer metrics
☐ Health indicators
☐ Database monitoring

☐ Database:
☐ Flyway migrations
☐ Schema validation
☐ Index optimization
☐ Backup strategy

```

---

## 📋 Fichiers à Créer/Mettre à Jour

### **Niveau Root (actforgood/)**

```

NEW:
☐ docker-compose.yml (upgrade: add RabbitMQ, improve setup)
☐ .env.example (templates for all env vars)
☐ Makefile (build, test, deploy commands)
☐ docker/
├── postgres/
│ └── init-db.sql (improved schema)
├── rabbitmq/
│ └── Dockerfile
└── redis/
└── redis.conf

UPDATE:
☐ README.md (project overview)
☐ ARCHITECTURE_COMPLETE.md (already created ✓)

```

### **Backend (ActForGood Microservices/)**

```

NEW SERVICES:
☐ wallet-service/ (Portfolio management)
☐ notification-service/ (Email/SMS/Push)
☐ report-service/ (Analytics & metrics)
☐ shared-library/ (Common code)
☐ config-server/ (Spring Cloud Config)
☐ eureka-server/ (replace service-discovery)

UPDATE EXISTING:
☐ api-gateway/ → Complete configuration
☐ user-service/ → Add tests, improve architecture
☐ campaign-service/ → Add tests, validation
☐ payment-service/ → Stripe integration
☐ blockchain-service/ → Stellar integration
☐ matching-service/ → ML implementation

NEW FILES IN EACH SERVICE:
☐ pom.xml (upgrade Java 21, add dependencies)
☐ application.yml (configuration)
☐ application-dev.yml
☐ application-prod.yml
☐ controller/ (REST endpoints)
☐ service/ (business logic)
☐ repository/ (data access)
☐ entity/ (JPA models)
☐ dto/ (data transfer objects)
☐ exception/ (error handling)
☐ config/ (Spring config)
☐ test/ (unit & integration tests)

```

### **Mobile (ActForGood Mobile/)**

```

NEW STRUCTURE:
src/
├── Presentation/
│ ├── Screens/
│ │ ├── auth/
│ │ ├── campaigns/
│ │ ├── wallet/
│ │ └── chat/
│ └── Components/
├── ViewModel/
│ ├── slices/
│ │ ├── authSlice.ts
│ │ ├── campaignSlice.ts
│ │ └── walletSlice.ts
│ └── store.ts
├── Repository/
│ ├── repositories/
│ │ ├── CampaignRepository.ts
│ │ └── DonationRepository.ts
│ └── mappers/
├── Services/
│ ├── ApiClient.ts
│ ├── AuthService.ts
│ ├── CampaignService.ts
│ └── WebSocketService.ts
├── Models/
│ ├── Campaign.ts
│ ├── Donation.ts
│ └── User.ts
├── Utilities/
├── Constants/
└── Navigation/

NEW FILES:
☐ package.json (add dependencies for clean arch)
☐ Zustand store (alternative to Redux)
☐ Type definitions for all entities
☐ API client with axios
☐ Error handling utilities
☐ WebSocket service
☐ Storage service (async-storage)

```

### **Web (ActForGood Web/)**

```

NEW STRUCTURE:
src/app/
├── Presentation/
│ ├── pages/ (containers)
│ │ ├── admin-dashboard/
│ │ ├── campaign-list/
│ │ └── ong-profile/
│ └── components/ (reusable)
├── Store/
│ ├── campaign/
│ │ ├── campaign.selector.ts
│ │ ├── campaign.effect.ts
│ │ └── campaign.reducer.ts
│ ├── auth/
│ └── transaction/
├── Services/
│ ├── campaign.service.ts
│ ├── auth.service.ts
│ └── admin.service.ts
├── Models/
│ ├── Campaign.ts
│ ├── Transaction.ts
│ └── enums/
├── Guards/
│ ├── auth.guard.ts
│ └── admin.guard.ts
├── Interceptors/
│ ├── auth.interceptor.ts
│ ├── error.interceptor.ts
│ └── logging.interceptor.ts
├── Config/
│ └── config.ts
├── Utilities/
│ ├── validators/
│ └── helpers/
└── Modules/
├── core/
├── shared/
└── features/

NEW FILES:
☐ .env files (configuration)
☐ Auth guard implementation
☐ HTTP interceptors
☐ Error handling service
☐ NgRx effects
☐ Validators shared module

````

---

## 📈 Checklist Implémentation Progressive

### Phase 1: Infrastructure (1-2 semaines)

- [ ] Java 21 installation & upgrade all services
- [ ] Docker Compose complete (add RabbitMQ)
- [ ] API Gateway complete configuration
- [ ] Service Discovery setup
- [ ] Shared library module creation
- [ ] Common DTO definitions

### Phase 2: Services (2-3 semaines)

- [ ] Wallet Service creation
- [ ] Notification Service creation
- [ ] Payment Service completion
- [ ] Blockchain Service completion
- [ ] Testing setup (TestContainers)

### Phase 3: Clean Architecture (2-3 semaines)

- [ ] Mobile refactoring
- [ ] Web refactoring
- [ ] Backend service standardization

### Phase 4: Security & Monitoring (1-2 semaines)

- [ ] Security implementation
- [ ] Testing coverage
- [ ] Logging setup
- [ ] Metrics & monitoring

---

## 🚀 Commandes de Démarrage

```bash
# Setup complet dev environment
make setup

# Démarrer services
docker-compose up -d

# Build all microservices
make build-backend

# Test all services
make test

# Deploy staging
make deploy-staging
````

---

## 📞 Prochaines Étapes Immédiat

1. ✅ Review ce document
2. ⏭️ Appliquer les changements priorité 1 (Infrastructure)
3. ✅ Test chaque changement
4. ⏭️ Progresser vers priorité 2, 3, 4...

---

**Status**: 🟡 EN COURS
**Next Update**: Après application priorité 1

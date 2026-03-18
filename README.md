# ActForGood - Donation Platform for Cameroon 🇨🇲

[![Build Status](https://img.shields.io/badge/status-active-success?style=flat-square)](https://github.com/your-org/actforgood)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](./LICENSE)
[![Node](https://img.shields.io/badge/node-18.0+-brightgreen?style=flat-square)](https://nodejs.org/)
[![Java](https://img.shields.io/badge/java-21-red?style=flat-square)](https://www.oracle.com/java/)
[![Docker](https://img.shields.io/badge/docker-compose-blue?style=flat-square)](https://docs.docker.com/compose/)

A modern, open-source donation platform connecting donors with verified charitable organizations in Cameroon. Built with microservices architecture, featuring mobile (React Native) and web (Angular) interfaces.

##  Quick Start

```bash
# 1. Clone repository
git clone https://github.com/your-org/actforgood.git
cd actforgood

# 2. Setup environment
cp .env.example .env    # Edit with your values
make setup              # Install dependencies

# 3. Start services
make start              # Docker services: PostgreSQL, Redis, RabbitMQ, MongoDB

# 4. Run applications
# Backend
cd AcrForGood\ Microservices && mvn spring-boot:run -pl api-gateway

# Web (new terminal)
cd ActForGood\ Web && npm start  # http://localhost:4200

# Mobile (new terminal)
cd ActForGood\ Mobile && npm start  # Scan QR code with Expo Go

# ✅ You're ready! API running on http://localhost:8080
```

**New to the project?** → See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed setup instructions.

##  Platform Overview

### For Donors

- ✅ Discover verified charitable campaigns
- ✅ Donate securely with multiple payment methods
- ✅ Track donation impact with blockchain transparency
- ✅ Get tax receipts automatically

### For Organizations (ONGs)

- ✅ Create and manage fundraising campaigns
- ✅ Receive verified, transparent donations
- ✅ Report impact to donors
- ✅ Access financial analytics

### For Administrators

- ✅ Verify and onboard organizations
- ✅ Monitor platform health and metrics
- ✅ Manage disputes and compliance
- ✅ View comprehensive analytics

## 🏗️ Architecture

### Technology Stack

**Backend:**

- Java 21 + Spring Boot 3.2
- PostgreSQL 15 (main data)
- Redis 7 (caching & sessions)
- RabbitMQ (async messaging)
- MongoDB (logs & analytics)

**Mobile:**

- React Native + Expo
- Redux Toolkit (state management)
- React Navigation 7
- TypeScript

**Web:**

- Angular 17 + TypeScript
- NgRx (state management)
- Angular Material (UI)

**Infrastructure:**

- Docker & Docker Compose (local)
- Kubernetes (production)
- AWS ECS/EKS (preferred)

### Microservices (9 Services)

| Service                | Purpose                          | Status         |
| ---------------------- | -------------------------------- | -------------- |
| `api-gateway`          | API entry point, routing, auth   | ✅ Ready       |
| `user-service`         | User management, profiles        | ✅ Ready       |
| `campaign-service`     | Campaign CRUD & management       | ✅ Ready       |
| `payment-service`      | Payment processing & refunds     | ✅ Ready       |
| `wallet-service`       | Wallet & portfolio management    | 🔄 In Progress |
| `notification-service` | Email, SMS, push notifications   | 🔄 In Progress |
| `blockchain-service`   | Transaction traceability         | ✅ Ready       |
| `matching-service`     | ML-based donor-campaign matching | ✅ Ready       |
| `service-discovery`    | Service registry (Eureka)        | ✅ Ready       |

##  Documentation

| Document                                                             | Purpose                                   |
| -------------------------------------------------------------------- | ----------------------------------------- |
| [GETTING_STARTED.md](./GETTING_STARTED.md)                         | **Start here!** Setup guide & quick start |
| [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)                   | Complete docs index & navigation          |
| [ARCHITECTURE_COMPLETE.md](./documentation/ARCHITECTURE_COMPLETE.md) | Technical architecture details            |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                                 | Contribution guide & code standards       |
| [DEVELOPMENT_BEST_PRACTICES.md](./DEVELOPMENT_BEST_PRACTICES.md)     | Coding standards & patterns               |
| [DEPLOYMENT.md](./DEPLOYMENT.md)                                     | Deployment to staging/production          |
| [ENVIRONMENT_CONFIGURATION.md](./ENVIRONMENT_CONFIGURATION.md)       | Environment variables guide               |
| [ROADMAP.md](./documentation/ROADMAP.md)                             | 6-month development timeline              |
| [IMPROVEMENT_PLAN.md](./documentation/IMPROVEMENT_PLAN.md)           | Priority matrix & implementation          |

##  Common Commands

```bash
make help               # Show all available commands
make setup              # Complete project setup
make start              # Start Docker services
make build              # Build all components
make test               # Run all tests
make clean              # Clean build artifacts
```

**Full Makefile reference:** See [Makefile](./Makefile)

##  Project Structure

```
actforgood/
├── ActForGood Microservices/    # Java backend (7 services)
├── ActForGood Mobile/            # React Native app with Expo
├── ActForGood Web/               # Angular 17 admin dashboard
├── Docker/                       # Container configurations
├── documentation/                # Architecture & guides
│   ├── ARCHITECTURE_COMPLETE.md
│   ├── WALLET_BANKING_SYSTEM.md
│   ├── ROADMAP.md
│   └── IMPROVEMENT_PLAN.md
├── docker-compose.yml            # Local infrastructure
├── Makefile                      # Build automation
├── .env.example                  # Environment template
└── [Setup & Config Files]
    ├── .vscode/settings.json
    ├── .vscode/launch.json
    ├── .gitignore
    └── DOCUMENTATION_INDEX.md
```

##  Security

- **Authentication:** JWT with bcrypt hashing
- **Authorization:** Role-based access control (Admin, ONG, Donor)
- **Payments:** PCI-compliant with Stripe integration
- **Data:** End-to-end encryption for sensitive data
- **Blockchain:** Transaction immutability and traceability

See [DEVELOPMENT_BEST_PRACTICES.md - Security](./DEVELOPMENT_BEST_PRACTICES.md#security) for details.

##  Testing

```bash
make test               # Run all tests
make test-backend       # Backend tests only
make test-module        # Test specific module
make coverage           # Generate coverage report
```

**Targets:**

- 80%+ code coverage for backend services
- Unit tests for business logic
- Integration tests with TestContainers
- E2E tests for critical flows

##  Deployment

### Development

```bash
make start              # Start Docker Compose
# Services available on localhost
```

### Staging

```bash
make deploy-staging     # Deploy to staging environment
```

### Production

```bash
make deploy-prod        # Deploy to production (requires approval)
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

##  Current Status

**Active Development** - Public Beta

- ✅ Core platform features implemented
- ✅ User authentication & authorization
- ✅ Campaign creation & management
- ✅ Payment processing
- ✅ Mobile app (React Native)
- ✅ Web admin dashboard
- 🔄 Wallet service (in progress)
- 🔄 Notification service (in progress)
- 🔜 Advanced analytics
- 🔜 AI-powered recommendations

##  Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Code of conduct
- Development setup
- Code style guidelines
- Testing requirements
- Pull request process

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Write/update tests
5. Follow code style: `make format`
6. Commit with clear message: `git commit -m "feat(module): description"`
7. Push to branch and create Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

##  Learning Resources

### For Backend Developers

- [Spring Boot Best Practices](./DEVELOPMENT_BEST_PRACTICES.md)
- [Microservices Architecture](./documentation/ARCHITECTURE_COMPLETE.md)
- [Payment System](./documentation/WALLET_BANKING_SYSTEM.md)

### For Frontend Developers

- [Clean Architecture](./documentation/ARCHITECTURE_COMPLETE.md#clean-architecture)
- [API Design](./DEVELOPMENT_BEST_PRACTICES.md#api-design)
- [Component Patterns](./CONTRIBUTING.md#component-patterns)

### For DevOps Engineers

- [Deployment Guide](./DEPLOYMENT.md)
- [Environment Configuration](./ENVIRONMENT_CONFIGURATION.md)
- [Docker & Kubernetes](./DEPLOYMENT.md#docker--kubernetes)

##  Issues & Bug Reports

Found a bug? Please help us improve!

1. Check [existing issues](https://github.com/your-org/actforgood/issues)
2. Create a **detailed issue** with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs
   - Environment details

[Create Issue →](https://github.com/your-org/actforgood/issues/new)

##  Feature Requests

Have an idea? We'd love to hear it!

1. Check [discussions](https://github.com/your-org/actforgood/discussions) first
2. Create a feature request with clear use case
3. Vote on existing proposals

[Suggest Feature →](https://github.com/your-org/actforgood/discussions)

##  Support & Community

- **Slack:** [#actforgood-dev](slack://channel) - Development discussions
- **Email:** dev-team@actforgood.org
- **GitHub Discussions:** [Ask questions](https://github.com/your-org/actforgood/discussions)
- **Documentation:** [Complete Guides](./DOCUMENTATION_INDEX.md)

##  Roadmap

Our 6-month development roadmap is available in [ROADMAP.md](./documentation/ROADMAP.md) covering:

- Phase 1: Foundation (Weeks 1-2)
- Phase 2: Core Services (Weeks 3-6)
- Phase 3: Advanced Features (Weeks 7-18)
- Phase 4: Launch & Scale (Weeks 19-26)

##  Performance & Metrics

- **API Response Time:** < 200ms (p95)
- **Uptime Target:** 99.9%
- **Database Query Time:** < 50ms (p95)
- **Mobile App:** < 3MB bundle size
- **Web App:** < 500KB gzipped

##  Environment Variables

All required environment variables are documented in:

- [.env.example](./.env.example) - Template with all variables
- [ENVIRONMENT_CONFIGURATION.md](./ENVIRONMENT_CONFIGURATION.md) - Detailed guide

**Setup:**

```bash
cp .env.example .env
# Edit .env with your values (database passwords, API keys, etc.)
```

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern, open-source technologies
- Inspired by successful donation platforms worldwide
- Dedicated to supporting charitable causes in Cameroon

## 💬 Questions?

- 📖 Check [GETTING_STARTED.md](./GETTING_STARTED.md)
- 📚 Browse [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
- 💬 Ask in [GitHub Discussions](https://github.com/your-org/actforgood/discussions)
- 📧 Email: dev-team@actforgood.org

---

<div align="center">

**Made with ❤️ for Cameroon by the ActForGood Team**

[GitHub](https://github.com/your-org/actforgood) • [Website](https://actforgood.org) • [Slack](slack://channel) • [Twitter](https://twitter.com/actforgood)

[![Stars Badge](https://img.shields.io/github/stars/your-org/actforgood?style=social)](https://github.com/your-org/actforgood)
[![Fork Badge](https://img.shields.io/github/forks/your-org/actforgood?style=social)](https://github.com/your-org/actforgood)

</div>
- React Navigation
- Redux Toolkit
- React Native Paper

## Démarrage Rapide

### Prérequis

- Java 17+
- Node.js 18+
- MongoDB
- Redis
- Docker (optionnel)

### Installation

Voir les README spécifiques dans chaque dossier :

- [Microservices](./microservices/README.md)
- [Web](./web/README.md)
- [Mobile](./mobile/README.md)

## Fonctionnalités

1. **Inscription et profilage** : ONG et bienfaiteurs
2. **Matching IA** : Recommandations personnalisées
3. **Dons sécurisés** : Mobile Money, crypto, cartes
4. **Transparence blockchain** : Traçabilité des fonds
5. **Mesure d'impact** : Dashboards et métriques
6. **Communauté** : Forums et échanges
7. **Gamification** : Badges et challenges

## Licence

Propriétaire - ActForGood

# 🚀 Getting Started with ActForGood

Welcome to the ActForGood platform! This guide will help you set up your development environment and get the project running locally.

## 📋 Prerequisites

Ensure you have these installed on your system:

- **Node.js** v18+ (for mobile and web apps)

  ```bash
  node --version  # Check version
  ```

- **Java 21** (for backend microservices)

  ```bash
  java -version  # Check version
  ```

- **Maven 3.8+** (for building Java projects)

  ```bash
  mvn --version  # Check version
  ```

- **Docker & Docker Compose** (for databases and services)

  ```bash
  docker --version      # Check Docker
  docker-compose --version  # Check Docker Compose
  ```

- **Git** (for version control)
  ```bash
  git --version  # Check version
  ```

## 🔧 Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/actforgood.git
cd actforgood
```

### 2. Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration (database passwords, API keys, etc.)
nano .env  # Or use your preferred editor
```

**Key variables to set:**

```env
# Database
DB_NAME=actforgood
DB_USER=postgres
DB_PASSWORD=your_secure_password  # Change this!

# Redis
REDIS_PASSWORD=your_redis_password  # Change this!

# JWT tokens
JWT_SECRET=your_super_secret_jwt_key_here  # Generate: openssl rand -hex 32
JWT_EXPIRATION=86400

# API Base URL (for development)
API_BASE_URL=http://localhost:8080

# Stripe (if you have an account)
STRIPE_API_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

### 3. Install Dependencies

```bash
# This runs all npm installs and Maven builds
make install
```

Or manually:

```bash
# Backend
cd AcrForGood\ Microservices
mvn clean install
cd ..

# Mobile
cd ActForGood\ Mobile
npm install
cd ..

# Web
cd ActForGood\ Web
npm install
cd ..
```

### 4. Start Docker Services

```bash
make start
```

This launches:

- **PostgreSQL 15** - Main database (port 5432)
- **Redis 7** - Cache & sessions (port 6379)
- **RabbitMQ** - Message queue with UI (ports 5672, 15672)
- **MongoDB** - Document storage for logs (port 27017)

Check status:

```bash
docker-compose ps
```

### 5. Run the Backend

```bash
cd AcrForGood\ Microservices

# Option 1: Run all services
mvn spring-boot:run -pl api-gateway

# Option 2: Run a specific service
mvn spring-boot:run -pl user-service

# Option 3: Use the Makefile
make dev-backend
```

Backend runs on **http://localhost:8080**

### 6. Run the Mobile App

```bash
cd ActForGood\ Mobile
npm start

# Then press 'i' for iOS or 'a' for Android emulator
# Or scan QR code with Expo Go app
```

### 7. Run the Web App

```bash
cd ActForGood\ Web
npm start
```

Web app runs on **http://localhost:4200**

## 📚 Available Commands

```bash
# See all available commands
make help

# Useful shortcuts
make start              # Start Docker services
make stop               # Stop Docker services
make build              # Build everything
make test               # Run all tests
make clean              # Clean build artifacts
make check-services     # Check if services are healthy
make info               # Show project information
```

## 🗄️ Database Access

### PostgreSQL

```bash
# Connect to PostgreSQL
docker exec -it actforgood-postgres psql -U postgres -d actforgood

# Useful queries
\dt                 # List all tables
\d table_name       # Describe table structure
SELECT * FROM users; # Query data
```

### MongoDB

```bash
# Connect to MongoDB
docker exec -it actforgood-mongodb mongosh

# List databases and collections
show dbs
use actforgood
show collections
```

### Redis

```bash
# Connect to Redis
docker exec -it actforgood-redis redis-cli

# Useful commands
PING                # Test connection
KEYS *              # List all keys
GET key_name        # Get value
```

### RabbitMQ Management UI

Open http://localhost:15672

- Username: `guest`
- Password: `guest`

View queues, messages, and exchange configurations.

## 🧪 Running Tests

```bash
# All tests
make test

# Backend tests only
make test-backend

# Mobile tests only
make test-mobile

# Web tests only
make test-web

# With coverage report
make coverage
```

## 📁 Project Structure

```
actforgood/
├── ActForGood Microservices/    # Java Spring Boot backend
│   ├── api-gateway/             # API Gateway (entry point)
│   ├── user-service/            # User management
│   ├── campaign-service/        # Donation campaigns
│   ├── payment-service/         # Payment processing
│   ├── wallet-service/          # Wallet & portfolio
│   ├── notification-service/    # Email, SMS, push
│   ├── blockchain-service/      # Blockchain tracking
│   ├── matching-service/        # ML-based matching
│   ├── service-discovery/       # Eureka service discovery
│   └── shared-library/          # Common DTOs & utilities
│
├── ActForGood Mobile/           # React Native + Expo
│   ├── src/
│   │   ├── Presentation/        # Screens & components
│   │   ├── Components/          # Reusable UI components
│   │   ├── Services/            # API & business logic
│   │   ├── Store/               # Redux state management
│   │   ├── Navigation/          # Navigation setup
│   │   └── Infrastructure/      # Config & setup
│   └── package.json
│
├── ActForGood Web/              # Angular 17 admin dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/            # Singleton services
│   │   │   ├── shared/          # Shared components
│   │   │   ├── features/        # Feature modules
│   │   │   └── app.component.ts
│   │   ├── assets/              # Images, icons
│   │   └── environments/        # Environment configs
│   └── package.json
│
├── Docker/
│   ├── postgres/                # PostgreSQL initialization
│   └── ... (other configs)
│
├── documentation/               # Architecture & guides
├── docker-compose.yml           # Docker services config
├── .env.example                 # Environment variables template
├── Makefile                     # Build automation
└── README.md                    # Project overview
```

## 🔗 API Endpoints

### Gateway (http://localhost:8080)

```
POST   /api/auth/login              # User login
POST   /api/auth/register           # User registration
GET    /api/users/profile           # Get user profile
GET    /api/campaigns               # List campaigns
POST   /api/campaigns               # Create campaign
POST   /api/donations               # Make donation
GET    /api/wallet                  # Get wallet balance
```

Full API documentation available in [ARCHITECTURE_COMPLETE.md](./ARCHITECTURE_COMPLETE.md)

## ⚠️ Common Issues & Solutions

### Port Already in Use

```bash
# Find and kill process on port 5432 (PostgreSQL example)
lsof -i :5432
kill -9 <PID>

# Or change port in docker-compose.yml and .env
```

### Docker Permission Denied

```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
sudo systemctl restart docker
newgrp docker  # Activate new group
```

### Java Version Mismatch

```bash
# Check Java version
java -version

# Install Java 21 if needed
# macOS (Homebrew): brew install java@21
# Ubuntu: sudo apt install openjdk-21-jdk
# Windows: Download from oracle.com
```

### Database Connection Failed

```bash
# Ensure Docker containers are running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart services
make restart
```

### Mobile App Won't Start

```bash
cd ActForGood\ Mobile

# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
npm start
```

### Angular Build Error

```bash
cd ActForGood\ Web

# Update Angular CLI
npm install -g @angular/cli@latest

# Reinstall dependencies
rm -rf node_modules
npm install
npm start
```

## 🚀 Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Backend: Edit microservice code in `ActForGood Microservices/`
- Mobile: Edit components in `ActForGood Mobile/src/`
- Web: Edit modules in `ActForGood Web/src/app/`

### 3. Run Tests

```bash
make test  # Run all tests
```

### 4. Format Code

```bash
make format  # Auto-format code
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Use meaningful PR title and description
- Link related issues
- Wait for code review and CI/CD tests to pass

## 📖 Documentation

- **[ARCHITECTURE_COMPLETE.md](./documentation/ARCHITECTURE_COMPLETE.md)** - Technical architecture
- **[WALLET_BANKING_SYSTEM.md](./documentation/WALLET_BANKING_SYSTEM.md)** - Payment & wallet system
- **[ROADMAP.md](./documentation/ROADMAP.md)** - Development roadmap
- **[IMPROVEMENT_PLAN.md](./documentation/IMPROVEMENT_PLAN.md)** - Implementation priorities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ❓ Getting Help

- Check [ARCHITECTURE_COMPLETE.md](./documentation/ARCHITECTURE_COMPLETE.md) for architectural questions
- Review existing issues on GitHub
- Ask in the team Slack channel
- Create a GitHub issue with detailed description

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 You're Ready!

You now have:

- ✅ Docker services running
- ✅ Backend microservices ready
- ✅ Mobile app configured
- ✅ Web dashboard ready
- ✅ Development environment set up

**Next steps:**

1. Read [ARCHITECTURE_COMPLETE.md](./documentation/ARCHITECTURE_COMPLETE.md)
2. Explore the codebase
3. Run tests: `make test`
4. Start developing!

---

**Questions?** Check the documentation or ask the team! 🚀

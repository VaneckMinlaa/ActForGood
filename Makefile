.PHONY: help setup build test clean start stop restart logs build-backend build-mobile build-web deploy-staging deploy-prod

# Default target
help:
	@echo "ActForGood Build & DevOps Commands"
	@echo "===================================="
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make setup              - Complete project setup"
	@echo "  make install            - Install dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make start              - Start all services (Docker Compose)"
	@echo "  make stop               - Stop all services"
	@echo "  make restart            - Restart all services"
	@echo "  make logs               - View all service logs"
	@echo "  make logs-backend       - View backend service logs"
	@echo ""
	@echo "Building:"
	@echo "  make build              - Build everything"
	@echo "  make build-backend      - Build Java microservices"
	@echo "  make build-mobile       - Build React Native app"
	@echo "  make build-web          - Build Angular web app"
	@echo ""
	@echo "Testing:"
	@echo "  make test               - Run all tests"
	@echo "  make test-backend       - Run backend tests"
	@echo "  make test-mobile        - Run mobile tests"
	@echo "  make test-web           - Run web tests"
	@echo "  make coverage           - Generate test coverage report"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-staging     - Deploy to staging environment"
	@echo "  make deploy-prod        - Deploy to production"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean              - Clean all build artifacts"
	@echo "  make clean-docker       - Remove Docker containers & volumes"
	@echo ""

# ============================================================
# SETUP & INSTALLATION
# ============================================================

setup:
	@echo "🔧 Setting up ActForGood project..."
	@echo ""
	@echo "1️⃣  Installing Node dependencies..."
	cd "ActForGood Mobile" && npm install
	cd "../ActForGood Web" && npm install
	@echo ""
	@echo "2️⃣  Building Java microservices..."
	cd "ActForGood Microservices" && mvn clean install
	@echo ""
	@echo "3️⃣  Creating .env file from template..."
	@if [ ! -f .env ]; then cp .env.example .env && echo "✅ Created .env - please update with your values"; fi
	@echo ""
	@echo "✅ Setup complete! Run 'make start' to launch services."

install:
	@echo "📦 Installing dependencies..."
	cd "ActForGood Mobile" && npm install
	cd "../ActForGood Web" && npm install
	cd "../ActForGood Microservices" && mvn clean install

# ============================================================
# DOCKER OPERATIONS
# ============================================================

start:
	@echo "🚀 Starting ActForGood services..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo ""
	@echo "📍 URLs:"
	@echo "   PostgreSQL: localhost:5432"
	@echo "   Redis:      localhost:6379"
	@echo "   RabbitMQ:   http://localhost:15672 (guest:guest)"
	@echo "   MongoDB:    localhost:27017"
	@echo ""
	@sleep 5
	@docker-compose logs

stop:
	@echo "🛑 Stopping ActForGood services..."
	docker-compose down

restart: stop start

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f postgres redis rabbitmq mongodb

clean-docker:
	@echo "🧹 Cleaning Docker containers & volumes..."
	docker-compose down -v
	@echo "✅ Docker cleanup complete"

# ============================================================
# BACKEND BUILD & TEST
# ============================================================

build-backend:
	@echo "🏗️  Building Java microservices..."
	cd "ActForGood Microservices" && mvn clean package -DskipTests
	@echo "✅ Backend build complete"

test-backend:
	@echo "🧪 Running backend tests..."
	cd "ActForGood Microservices" && mvn clean test
	@echo "✅ Backend tests complete"

# ============================================================
# MOBILE BUILD & TEST
# ============================================================

build-mobile:
	@echo "🏗️  Building React Native app..."
	cd "ActForGood Mobile" && npm run build
	@echo "✅ Mobile build complete"

test-mobile:
	@echo "🧪 Running mobile tests..."
	cd "ActForGood Mobile" && npm test
	@echo "✅ Mobile tests complete"

# ============================================================
# WEB BUILD & TEST
# ============================================================

build-web:
	@echo "🏗️  Building Angular web app..."
	cd "ActForGood Web" && npm run build
	@echo "✅ Web build complete"

test-web:
	@echo "🧪 Running web tests..."
	cd "ActForGood Web" && npm test
	@echo "✅ Web tests complete"

# ============================================================
# COMPLETE BUILD & TEST
# ============================================================

build: build-backend build-mobile build-web
	@echo "✅ All builds complete"

test: test-backend test-mobile test-web
	@echo "✅ All tests complete"

coverage:
	@echo "📊 Generating test coverage reports..."
	cd "ActForGood Microservices" && mvn jacoco:report
	@echo "✅ Coverage report generated"
	@echo "   Backend: ActForGood Microservices/target/site/jacoco/index.html"

# ============================================================
# DEPLOYMENT
# ============================================================

deploy-staging:
	@echo "🚀 Deploying to staging..."
	@echo "TODO: Implement staging deployment"

deploy-prod:
	@echo "⚠️  Production deployment requires approval!"
	@echo "🚀 Deploying to production..."
	@echo "TODO: Implement production deployment"

# ============================================================
# CLEANUP
# ============================================================

clean:
	@echo "🧹 Cleaning build artifacts..."
	cd "ActForGood Microservices" && mvn clean
	cd "../ActForGood Mobile" && rm -rf node_modules dist build
	cd "../ActForGood Web" && rm -rf node_modules dist
	@echo "✅ Cleanup complete"

format:
	@echo "💅 Formatting code..."
	cd "ActForGood Mobile" && npm run lint -- --fix
	cd "../ActForGood Web" && npm run lint -- --fix
	@echo "✅ Code formatting complete"

# ============================================================
# DEBUGGING
# ============================================================

check-services:
	@echo "🔍 Checking service health..."
	@echo "PostgreSQL:"
	docker exec actforgood-postgres pg_isready -U postgres || echo "❌ DOWN"
	@echo ""
	@echo "Redis:"
	docker exec actforgood-redis redis-cli ping || echo "❌ DOWN"
	@echo ""
	@echo "RabbitMQ:"
	docker exec actforgood-rabbitmq rabbitmq-diagnostics ping || echo "❌ DOWN"
	@echo ""
	@echo "MongoDB:"
	docker exec actforgood-mongodb mongosh --eval "db.adminCommand('ping')" || echo "❌ DOWN"

# ============================================================
# DEVELOPMENT
# ============================================================

dev-mobile:
	cd "ActForGood Mobile" && npm start

dev-web:
	cd "ActForGood Web" && npm start

dev-backend:
	cd "ActForGood Microservices" && mvn spring-boot:run

# ============================================================
# DATABASE
# ============================================================

db-migrate:
	@echo "📦 Running database migrations..."
	cd "ActForGood Microservices" && mvn flyway:migrate
	@echo "✅ Migrations complete"

db-seed:
	@echo "🌱 Seeding database..."
	docker exec actforgood-postgres psql -U postgres -d actforgood -f /seed-data.sql
	@echo "✅ Database seeded"

# ============================================================
# GIT OPERATIONS
# ============================================================

git-setup:
	@echo "🔧 Setting up git hooks..."
	@echo "TODO: Setup pre-commit hooks"

# ============================================================
# INFO
# ============================================================

info:
	@echo "🛠️  ActForGood Project Information"
	@echo "===================================="
	@echo ""
	@echo "📁 Project Structure:"
	@echo "   ActForGood Microservices/ - Java Backend (Spring Boot)"
	@echo "   ActForGood Mobile/         - React Native App"
	@echo "   ActForGood Web/            - Angular Admin Dashboard"
	@echo ""
	@echo "🚀 Tech Stack:"
	@echo "   Backend:   Java 21 + Spring Boot 3.2"
	@echo "   Mobile:    React Native + Expo"
	@echo "   Web:       Angular 17 + NgRx"
	@echo "   Database:  PostgreSQL 15 + MongoDB + Redis 7"
	@echo "   Queue:     RabbitMQ"
	@echo ""
	@echo "📚 Documentation:"
	@echo "   ARCHITECTURE_COMPLETE.md - Complete technical architecture"
	@echo "   WALLET_BANKING_SYSTEM.md - Payment system details"
	@echo "   ROADMAP.md               - Development roadmap"
	@echo "   IMPROVEMENT_PLAN.md      - Implementation plan"
	@echo ""

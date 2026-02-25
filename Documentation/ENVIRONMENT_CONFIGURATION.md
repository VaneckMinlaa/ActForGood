# Environment Configuration Management

This document explains how to manage environment variables and secrets in the ActForGood project.

## Overview

Environment variables and secrets are managed through `.env` files with a stricter hierarchy:

1. `.env.example` - Template with all required variables (version controlled)
2. `.env` - Local development configuration (git-ignored, created from `.env.example`)
3. `.local.env` - Machine-specific overrides (git-ignored, optional)
4. Environment-specific files - `docker-compose.override.yml` (git-ignored)

## Setup Instructions

### 1. Create Local Environment File

```bash
# Copy the template
cp .env.example .env

# Edit with your local values
nano .env
```

### 2. Required Variables

Minimum required variables to set in `.env`:

```env
# Database Configuration
DB_PASSWORD=your_secure_password          # CHANGE THIS!
DB_ROOT_PASSWORD=your_root_password       # CHANGE THIS!

# JWT Configuration
JWT_SECRET=$(openssl rand -hex 32)        # Generate: openssl rand -hex 32

# API Configuration
API_BASE_URL=http://localhost:8080
WEB_BASE_URL=http://localhost:4200
MOBILE_BASE_URL=http://localhost:3000

# Redis Configuration
REDIS_PASSWORD=your_redis_password        # CHANGE THIS!

# Spring Profiles
SPRING_PROFILES_ACTIVE=dev
```

### 3. Generate Secure Secrets

```bash
# Generate JWT secret (32 bytes = 64 hex characters)
openssl rand -hex 32

# Generate passwords
openssl rand -base64 16

# Generate API keys (if needed)
openssl rand -hex 16
```

## Environment Variables Structure

### Database Section
```env
# PostgreSQL Main Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=actforgood
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_ROOT_PASSWORD=root_secure_password
DB_CONNECTION_POOL_SIZE=10
DB_IDLE_TIMEOUT=600000
DB_MAX_LIFETIME=1800000

# MongoDB (for ML logs and caching)
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=actforgood
MONGO_USER=admin
MONGO_PASSWORD=admin_password
```

### Cache & Queue Section
```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DATABASE=0
REDIS_TIMEOUT=5000

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_VHOST=/
```

### Application Configuration
```env
# Server Configuration
SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/api

# API Configuration
API_BASE_URL=http://localhost:8080
WEB_BASE_URL=http://localhost:4200
MOBILE_BASE_URL=http://localhost:3000

# Application Name & Version
APP_NAME=ActForGood
APP_VERSION=1.0.0
APP_ENVIRONMENT=development
```

### Security - JWT
```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_at_least_32_chars
JWT_EXPIRATION=86400
JWT_REFRESH_EXPIRATION=604800
JWT_ISSUER=actforgood
JWT_AUDIENCE=actforgood-app

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200,http://localhost:5173
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With
CORS_EXPOSED_HEADERS=X-Total-Count,X-Page-Number
CORS_ALLOW_CREDENTIALS=true
CORS_MAX_AGE=3600
```

### Payment Integration
```env
# Stripe Configuration
STRIPE_API_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# PayPal Configuration (if integrated)
PAYPAL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx
PAYPAL_MODE=sandbox

# MTN Mobile Money (Cameroon)
MTN_API_KEY=xxxxxxxxxxxxxxxxxxxx
MTN_API_USER=xxxxxxxxxxxxxxxxxxxx
MTN_PRIMARY_KEY=xxxxxxxxxxxxxxxxxxxx
MTN_SECONDARY_KEY=xxxxxxxxxxxxxxxxxxxx

# Orange Money (Cameroon)
ORANGE_API_KEY=xxxxxxxxxxxxxxxxxxxx
ORANGE_API_USER=xxxxxxxxxxxxxxxxxxxx
ORANGE_API_PASSWORD=xxxxxxxxxxxxxxxxxxxx
```

### Email & Notifications
```env
# Brevo (Sendinblue) Email Service
BREVO_API_KEY=xxxxxxxxxxxxxxxxxxxx
BREVO_FROM_EMAIL=noreply@actforgood.org
BREVO_FROM_NAME=ActForGood

# SMS Service (Twilio or local)
TWILIO_ACCOUNT_SID=xxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Firebase Cloud Messaging (Push Notifications)
FCM_PROJECT_ID=xxxxxxxxxxxxxxxxxxxx
FCM_PRIVATE_KEY=xxxxxxxxxxxxxxxxxxxx
FCM_CLIENT_EMAIL=xxxxxxxxxxxxxxxxxxxx
```

### Blockchain Configuration
```env
# Blockchain (Hyperledger or similar)
BLOCKCHAIN_NETWORK=hyperledger-fabric
BLOCKCHAIN_CHANNEL=actforgood-channel
BLOCKCHAIN_CHAINCODE=actforgood-chaincode
BLOCKCHAIN_PEER_ORG=org1.actforgood.com
BLOCKCHAIN_CA_URL=https://ca-org1:7054
BLOCKCHAIN_PEER_URL=grpcs://peer0-org1:7051
BLOCKCHAIN_ORDERER_URL=grpcs://orderer:7050
BLOCKCHAIN_TLS_CERT_PATH=/certs/blockchain/ca.pem
```

### File Storage
```env
# AWS S3 (or MinIO for local S3)
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxx
AWS_S3_BUCKET=actforgood-documents
AWS_S3_ENDPOINT=https://s3.eu-west-2.amazonaws.com

# Local file storage (for development)
FILE_STORAGE_PATH=./uploads
FILE_MAX_SIZE=10485760  # 10MB in bytes
FILE_ALLOWED_TYPES=pdf,doc,docx,jpg,png,gif
```

### External Services
```env
# Google Maps API
GOOGLE_MAPS_API_KEY=xxxxxxxxxxxxxxxxxxxx

# Google Analytics
GOOGLE_ANALYTICS_ID=G-xxxxxxxxxxxx

# SendGrid (alternative email)
SENDGRID_API_KEY=xxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@actforgood.org
```

### Spring Profiles & Logging
```env
# Spring Profiles
SPRING_PROFILES_ACTIVE=dev
SPRING_APPLICATION_NAME=api-gateway

# Logging Configuration
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_ACTFORGOOD=DEBUG
LOGGING_PATTERN_CONSOLE=%d{yyyy-MM-dd HH:mm:ss} - %logger{36} - %msg%n
LOGGING_FILE_NAME=logs/application.log
LOGGING_FILE_MAX_SIZE=10MB
LOGGING_FILE_MAX_HISTORY=30
```

### Monitoring & Observability
```env
# Micrometer / Prometheus
MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,metrics,prometheus
MANAGEMENT_ENDPOINTS_WEB_BASE_PATH=/actuator
MANAGEMENT_METRICS_EXPORT_PROMETHEUS_ENABLED=true

# Jaeger (Distributed Tracing)
JAEGER_AGENT_HOST=localhost
JAEGER_AGENT_PORT=6831
JAEGER_SAMPLER_TYPE=const
JAEGER_SAMPLER_PARAM=1

# New Relic (if using)
NEW_RELIC_LICENSE_KEY=xxxxxxxxxxxxxxxxxxxx
NEW_RELIC_APP_NAME=actforgood-backend
NEW_RELIC_ENABLE_AUTO_INSTRUMENTATION=true
```

### Feature Toggles
```env
# Feature Flags
FEATURE_BLOCKCHAIN_ENABLED=true
FEATURE_ML_MATCHING_ENABLED=true
FEATURE_WALLET_SERVICE_ENABLED=true
FEATURE_NOTIFICATION_SERVICE_ENABLED=true
FEATURE_REPORT_SERVICE_ENABLED=false
```

## Best Practices

### 1. Secret Management

**DO:**
- ✅ Generate strong passwords: `openssl rand -base64 16`
- ✅ Use environment variables for all secrets
- ✅ Never commit `.env` files
- ✅ Use `.env.example` as template with placeholder values
- ✅ Rotate secrets regularly in production
- ✅ Use different secrets per environment

**DON'T:**
- ❌ Commit `.env` files to version control
- ❌ Expose secrets in code
- ❌ Use same secrets across environments
- ❌ Check secrets into Git history
- ❌ Use weak passwords
- ❌ Share secrets in Slack/email

### 2. Environment Separation

Create separate configuration for each environment:

```bash
# Development (local)
.env  # Local development only, git-ignored

# Staging
export SPRING_PROFILES_ACTIVE=staging
# Use staging secrets from secure vault

# Production
export SPRING_PROFILES_ACTIVE=production
# Use production secrets from secure vault (AWS Secrets Manager, HashiCorp Vault, etc.)
```

### 3. Secure Storage

For production, use a secrets management system:

**AWS:**
```bash
# Store secrets in AWS Secrets Manager
aws secretsmanager create-secret --name actforgood/prod/db-password
```

**HashiCorp Vault:**
```bash
# Store and retrieve secrets from Vault
vault write secret/actforgood/prod/database password=xxxx
vault read secret/actforgood/prod/database
```

**GitHub Secrets (for CI/CD):**
```bash
# Set GitHub Actions secrets
gh secret set DB_PASSWORD --body "your_secure_password"
```

### 4. Spring Boot Integration

Spring Boot automatically loads from `.env`:

```properties
# application.properties
spring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQL15Dialect

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
```

### 5. Docker Compose Integration

In `docker-compose.yml`, reference `.env`:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "${DB_PORT}:5432"

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "${REDIS_PORT}:6379"
```

### 6. Distribution to Team Members

```bash
# Steps to share environment setup:

# 1. Create .env.example with placeholders
cp .env.example .env
# Edit with real values

# 2. Share instructions (not the .env file!)
cat ENVIRONMENT_CONFIGURATION.md

# 3. Team member sets up locally:
cp .env.example .env
# Edit .env with their own values (or shared staging/prod values)
```

## Troubleshooting

### Environment Variables Not Loading

```bash
# Verify variables are loaded
echo $JWT_SECRET

# Check .env file syntax
bash -n .env

# Source manually if needed
source .env
echo $JWT_SECRET
```

### Spring Boot Not Picking Up Variables

```bash
# Check which profile is active
curl http://localhost:8080/actuator/env

# Ensure spring.config.name is set (usually 'application')
# in src/main/resources/application.properties

# Make sure .env is in the project root
ls -la .env
```

### Docker Secrets Not Available

```bash
# Ensure docker-compose.yml references .env correctly
docker-compose config | grep MYSQL_PASSWORD

# Check container environment
docker exec <container-id> env | grep DB_
```

## Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` is version controlled
- [ ] No secrets in code or logs
- [ ] `.env` has restrictive permissions: `chmod 600 .env`
- [ ] Production uses secure secrets vault
- [ ] Secrets rotated regularly
- [ ] Team trained on secret handling
- [ ] Secrets audit logging enabled
- [ ] No plaintext secrets in error messages
- [ ] Staging uses different secrets than production

## Reference

- [12factor.net - Environment Variables](https://12factor.net/config)
- [Spring Boot External Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [OWASP Secrets Management](https://owasp.org/www-community/Sensitive_Data_Exposure)

---

**Questions?** Check with your team lead or review the CONTRIBUTING.md guide.

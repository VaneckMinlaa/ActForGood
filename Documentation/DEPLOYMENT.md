# Deployment Guide

This guide covers deploying the ActForGood platform to different environments: development, staging, and production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Deployment](#development-deployment)
3. [Staging Deployment](#staging-deployment)
4. [Production Deployment](#production-deployment)
5. [Docker & Kubernetes](#docker--kubernetes)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring & Logging](#monitoring--logging)
8. [Rollback Procedures](#rollback-procedures)
9. [Security Hardening](#security-hardening)

## Prerequisites

### Tools Required

```bash
# Docker & Docker Compose
docker --version      # v24.0+
docker-compose --version  # v2.20+

# Kubernetes (for production)
kubectl version --client  # v1.27+

# Cloud CLI
aws --version         # or gcloud, az depending on cloud provider

# Build Tools
java -version         # Java 21
mvn --version         # Maven 3.8+
node --version        # Node 18+
npm --version         # npm 9+

# Other
git --version
git-lfs --version     # For large file handling
helm version          # For Kubernetes (optional)
```

### Access Requirements

- Git repository access
- Docker registry credentials
- Cloud provider credentials (AWS/GCP/Azure)
- Kubernetes cluster access (for production)
- SSL/TLS certificates
- Domain access for DNS configuration

## Development Deployment

### Local Development

```bash
# 1. Setup environment
make setup

# 2. Create .env file
cp .env.example .env
# Edit .env with local development values

# 3. Start Docker services
make start

# 4. Build the project
make build

# 5. Run services
# Backend
cd AcrForGood\ Microservices
mvn spring-boot:run -pl api-gateway

# Web
cd ../ActForGood\ Web
npm start

# Mobile
cd ../ActForGood\ Mobile
npm start
```

### Docker Compose Development

```bash
# Build and start all services
docker-compose build
docker-compose up -d

# View logs
docker-compose logs -f

# Access services:
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - RabbitMQ UI: http://localhost:15672
# - MongoDB: localhost:27017
# - API Gateway: http://localhost:8080
# - Web App: http://localhost:4200
# - Mobile (Expo): http://localhost:19000
```

## Staging Deployment

### Infrastructure Setup (AWS Example)

```bash
# 1. Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier actforgood-staging \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.3 \
  --allocated-storage 100 \
  --master-username postgres \
  --master-user-password <SECURE_PASSWORD>

# 2. Create ElastiCache Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id actforgood-staging-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0

# 3. Create S3 bucket for file storage
aws s3 mb s3://actforgood-staging-files \
  --region eu-west-2

# 4. Create IAM role for EC2/ECS
aws iam create-role --role-name ActForGoodStagingRole

# 5. Create security groups
aws ec2 create-security-group \
  --group-name actforgood-staging-sg \
  --description "ActForGood staging security group"
```

### Build & Push Docker Images

```bash
# 1. Build Docker images
docker build -t actforgood/api-gateway:staging ./AcrForGood\ Microservices/api-gateway
docker build -t actforgood/user-service:staging ./AcrForGood\ Microservices/user-service
docker build -t actforgood/campaign-service:staging ./AcrForGood\ Microservices/campaign-service
docker build -t actforgood/payment-service:staging ./AcrForGood\ Microservices/payment-service

# 2. Tag for registry
docker tag actforgood/api-gateway:staging <REGISTRY>/actforgood/api-gateway:staging

# 3. Login to registry
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin <REGISTRY>

# 4. Push images
docker push <REGISTRY>/actforgood/api-gateway:staging
docker push <REGISTRY>/actforgood/user-service:staging
# ... push all services
```

### Deploy to ECS (AWS)

```bash
# 1. Create ECS cluster
aws ecs create-cluster --cluster-name actforgood-staging

# 2. Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition-staging.json

# 3. Create service
aws ecs create-service \
  --cluster actforgood-staging \
  --service-name api-gateway \
  --task-definition actforgood-api-gateway:1 \
  --desired-count 2 \
  --launch-type EC2

# 4. Create load balancer
aws elbv2 create-load-balancer \
  --name actforgood-staging-alb \
  --subnets subnet-xxxxx subnet-xxxxx \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --type application
```

### Configuration for Staging

Create `docker-compose.staging.yml`:

```yaml
version: '3.8'

services:
  api-gateway:
    image: <REGISTRY>/actforgood/api-gateway:staging
    environment:
      SPRING_PROFILES_ACTIVE: staging
      DB_HOST: actforgood-staging.cdxxxxxx.eu-west-2.rds.amazonaws.com
      REDIS_HOST: actforgood-staging-redis.xxxxx.ng.0001.euw2.cache.amazonaws.com
      JWT_SECRET: ${STAGING_JWT_SECRET}
    depends_on:
      - rabbitmq
    ports:
      - '8080:8080'

  user-service:
    image: <REGISTRY>/actforgood/user-service:staging
    environment:
      SPRING_PROFILES_ACTIVE: staging
      DB_HOST: actforgood-staging.cdxxxxxx.eu-west-2.rds.amazonaws.com
    depends_on:
      - api-gateway

  web:
    image: <REGISTRY>/actforgood/web:staging
    environment:
      API_BASE_URL: https://staging-api.actforgood.org
    ports:
      - '80:80'

  # Database and cache point to managed services
```

### Database Migration for Staging

```bash
# 1. Create database backup
pg_dump -h staging-db.example.com -U postgres -d actforgood > backup-staging.sql

# 2. Run Flyway migrations
mvn flyway:migrate \
  -Dflyway.url=jdbc:postgresql://staging-db.example.com:5432/actforgood

# 3. Verify migration
psql -h staging-db.example.com -U postgres -d actforgood -c "SELECT version FROM flyway_schema_history ORDER BY version DESC LIMIT 1;"
```

## Production Deployment

### Pre-Deployment Checklist

- [ ] All tests pass: `make test`
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Load testing completed
- [ ] Database backup created
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Maintenance window scheduled

### Infrastructure Setup (Kubernetes on AWS EKS)

```bash
# 1. Create EKS cluster
eksctl create cluster --name actforgood-prod --version 1.27 --region eu-west-2

# 2. Create node group
eksctl create nodegroup \
  --cluster=actforgood-prod \
  --name=actforgood-nodes \
  --node-type=t3.large \
  --nodes=3 \
  --nodes-min=3 \
  --nodes-max=10

# 3. Configure kubectl
aws eks update-kubeconfig --name actforgood-prod --region eu-west-2

# 4. Verify cluster
kubectl get nodes
```

### Build & Push Production Images

```bash
# 1. Build with production optimizations
mvn clean package -Pprod -DskipTests

# 2. Build Docker images with version tag
VERSION="1.0.0"
docker build -t <REGISTRY>/actforgood/api-gateway:$VERSION ./AcrForGood\ Microservices/api-gateway
docker build -t <REGISTRY>/actforgood/api-gateway:latest ./AcrForGood\ Microservices/api-gateway

# 3. Scan image for vulnerabilities
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image <REGISTRY>/actforgood/api-gateway:$VERSION

# 4. Push to registry
docker push <REGISTRY>/actforgood/api-gateway:$VERSION
docker push <REGISTRY>/actforgood/api-gateway:latest
```

### Deploy to Kubernetes

Create `kubernetes-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: actforgood-api-gateway
  labels:
    app: actforgood
    component: api-gateway
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: actforgood
      component: api-gateway
  template:
    metadata:
      labels:
        app: actforgood
        component: api-gateway
    spec:
      containers:
        - name: api-gateway
          image: <REGISTRY>/actforgood/api-gateway:1.0.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
              name: http
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: 'production'
            - name: DB_HOST
              valueFrom:
                configMapKeyRef:
                  name: actforgood-config
                  key: db-host
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: actforgood-secrets
                  key: db-password
          resources:
            requests:
              memory: '512Mi'
              cpu: '250m'
            limits:
              memory: '1Gi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /actuator/health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: actforgood-api-gateway-service
spec:
  selector:
    app: actforgood
    component: api-gateway
  ports:
    - port: 80
      targetPort: 8080
  type: LoadBalancer

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: actforgood-api-gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: actforgood-api-gateway
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

Deploy to Kubernetes:

```bash
# 1. Create namespace
kubectl create namespace actforgood-prod

# 2. Create secrets
kubectl create secret generic actforgood-secrets \
  --from-literal=db-password=<SECURE_PASSWORD> \
  -n actforgood-prod

# 3. Create config map
kubectl create configmap actforgood-config \
  --from-literal=db-host=actforgood-prod.cdxxxxxx.eu-west-2.rds.amazonaws.com \
  -n actforgood-prod

# 4. Apply deployments
kubectl apply -f kubernetes-deployment.yaml -n actforgood-prod

# 5. Verify deployment
kubectl get pods -n actforgood-prod
kubectl get services -n actforgood-prod

# 6. Check logs
kubectl logs -f deployment/actforgood-api-gateway -n actforgood-prod
```

### SSL/TLS Certificate

```bash
# 1. Create certificate with Let's Encrypt
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# 2. Create Ingress with TLS
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: actforgood-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  rules:
  - host: api.actforgood.org
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: actforgood-api-gateway-service
            port:
              number: 80
  - host: web.actforgood.org
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: actforgood-web-service
            port:
              number: 80
  tls:
  - hosts:
    - api.actforgood.org
    - web.actforgood.org
    secretName: actforgood-tls-cert
EOF
```

## Docker & Kubernetes

### Docker Best Practices

```dockerfile
# Use specific base image version
FROM openjdk:21-slim-bullseye

# Set working directory
WORKDIR /app

# Copy only necessary files
COPY --chown=appuser:appgroup target/app.jar app.jar

# Create non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Set resource limits
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.JarLauncher \
  org.springframework.boot.actuate.health.HealthEndpointWebEndpoint check

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Kubernetes Namespaces

```bash
# Create namespaces
kubectl create namespace actforgood-prod
kubectl create namespace actforgood-staging
kubectl create namespace actforgood-dev

# Set default namespace
kubectl config set-context --current --namespace=actforgood-prod

# List all resources
kubectl get all -n actforgood-prod
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags: [v*]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: 21
          distribution: temurin

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Build All
        run: make build

      - name: Test All
        run: make test

      - name: Upload Coverage
        uses: codecov/codecov-action@v3

  build-images:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build and Push Images
        uses: docker/build-push-action@v4
        with:
          context: ./ActForGood Microservices/api-gateway
          push: true
          tags: |
            ${{ secrets.REGISTRY }}/actforgood/api-gateway:${{ github.sha }}
            ${{ secrets.REGISTRY }}/actforgood/api-gateway:latest

  deploy:
    needs: build-images
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/')
    steps:
      - uses: actions/checkout@v3

      - name: Configure kubectl
        run: |
          aws eks update-kubeconfig --name actforgood-prod --region eu-west-2

      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f kubernetes-deployment.yaml -n actforgood-prod
          kubectl set image deployment/actforgood-api-gateway \
            api-gateway=${{ secrets.REGISTRY }}/actforgood/api-gateway:${{ github.sha }} \
            -n actforgood-prod

      - name: Wait for deployment
        run: |
          kubectl rollout status deployment/actforgood-api-gateway -n actforgood-prod
```

## Monitoring & Logging

### Prometheus Metrics

```yaml
# prometheus-config.yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'actforgood'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels:
          [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
```

### Elasticsearch & Kibana Logging

```yaml
# elasticsearch-deployment.yaml
apiVersion: v1
kind: Service
metadata:
  name: elasticsearch
spec:
  ports:
    - port: 9200
  selector:
    app: elasticsearch

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: elasticsearch
spec:
  replicas: 1
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
        - name: elasticsearch
          image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
          env:
            - name: discovery.type
              value: single-node
            - name: xpack.security.enabled
              value: 'false'
          ports:
            - containerPort: 9200
```

### Log Aggregation with Logstash

```json
{
  "input": {
    "tcp": {
      "port": 5000,
      "codec": "json"
    }
  },
  "filter": {
    "if": "[type] == \"java-app\"",
    "mutate": {
      "add_field": { "[@metadata][application]": "%{application}" }
    }
  },
  "output": {
    "elasticsearch": {
      "hosts": ["elasticsearch:9200"],
      "index": "actforgood-%{+YYYY.MM.dd}"
    }
  }
}
```

## Rollback Procedures

### Kubernetes Rollback

```bash
# 1. Check deployment history
kubectl rollout history deployment/actforgood-api-gateway -n actforgood-prod

# 2. View details of a revision
kubectl rollout history deployment/actforgood-api-gateway -n actforgood-prod --revision=5

# 3. Rollback to previous version
kubectl rollout undo deployment/actforgood-api-gateway -n actforgood-prod

# 4. Rollback to specific revision
kubectl rollout undo deployment/actforgood-api-gateway --to-revision=5 -n actforgood-prod

# 5. Verify rollback
kubectl get pods -n actforgood-prod
kubectl logs -f deployment/actforgood-api-gateway -n actforgood-prod
```

### Database Rollback

```bash
# 1. List migration history
mvn flyway:info

# 2. Migrate to previous version
mvn flyway:undo

# 3. Restore from backup if needed
psql -h prod-db.example.com -U postgres -d actforgood < backup-prod.sql
```

## Security Hardening

### Network Security

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: actforgood-network-policy
spec:
  podSelector:
    matchLabels:
      app: actforgood
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: actforgood-prod
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: actforgood-prod
      ports:
        - protocol: TCP
          port: 5432
        - protocol: TCP
          port: 6379
```

### Pod Security Policy

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: actforgood-restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'MustRunAs'
    seLinuxOptions:
      level: 's0:c123,c456'
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1000
        max: 65535
  readOnlyRootFilesystem: false
```

---

**Need help?** Check GitHub Projects, CONTRIBUTING.md, or contact the DevOps team.

#!/usr/bin/env bash
#
# Lance tous les microservices ActForGood dans le bon ordre.
# À exécuter depuis la racine du projet actforgood.
#

set -e

# Répertoire racine du projet (parent du dossier scripts)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MS_DIR="$ROOT_DIR/ActForGood Microservices"

cd "$ROOT_DIR"

echo "=== ActForGood - Démarrage des microservices ==="
echo "Racine projet: $ROOT_DIR"
echo ""

# Option: démarrer PostgreSQL (et Redis) avec Docker
if [ "$1" = "--with-docker" ] || [ "$1" = "-d" ]; then
  echo ">> Démarrage des bases de données (Docker)..."
  docker-compose up -d postgres redis rabbitmq mongodb
  echo "   Attente 10s que les bases soient prêtes..."
  sleep 10
  echo ""
fi

if [ ! -d "$MS_DIR" ]; then
  echo "Erreur: dossier microservices introuvable: $MS_DIR"
  exit 1
fi

# Créer le dossier des logs et fichier PIDs
mkdir -p "$ROOT_DIR/logs"
PID_FILE="$ROOT_DIR/logs/microservices.pid"
: > "$PID_FILE"

start_service() {
  local name="$1"
  local dir="$2"
  local port="${3:-}"
  echo ">> Démarrage de $name..."
  (cd "$dir" && mvn spring-boot:run -q >> "$ROOT_DIR/logs/${name}.log" 2>&1 &)
  local pid=$!
  echo $pid >> "$PID_FILE"
  echo "   PID: $pid"
}

# 1. Config Server - doit être lancé en premier
echo ""
echo "--- 1/12 Config Server ---"
start_service "config-server" "$MS_DIR/config-server" "8888"
sleep 15

# 2. Service Discovery (Eureka)
echo "--- 2/12 Service Discovery (Eureka) ---"
start_service "service-discovery" "$MS_DIR/service-discovery" "8761"
sleep 15
echo "   Config et Eureka démarrés. Attente 15s..."
echo ""

# 3. User Service
echo "--- 3/12 User Service ---"
start_service "user-service" "$MS_DIR/user-service" "8081"
sleep 5

# 4. Campaign Service
echo "--- 4/12 Campaign Service ---"
start_service "campaign-service" "$MS_DIR/campaign-service" "8082"
sleep 5

# 5. Matching Service
echo "--- 5/12 Matching Service ---"
start_service "matching-service" "$MS_DIR/matching-service" "8083"
sleep 5

# 6. Donation Service
echo "--- 6/12 Donation Service ---"
start_service "donation-service" "$MS_DIR/donation-service" "8084"
sleep 5

# 7. Wallet Service
echo "--- 7/12 Wallet Service ---"
start_service "wallet-service" "$MS_DIR/wallet-service" "8085"
sleep 5

# 8. Transaction Service
echo "--- 8/12 Transaction Service ---"
start_service "transaction-service" "$MS_DIR/transaction-service" "8086"
sleep 5

# 9. Notification Service
echo "--- 9/12 Notification Service ---"
start_service "notification-service" "$MS_DIR/notification-service" "8087"
sleep 5

# 10. Payment Service
echo "--- 10/12 Payment Service ---"
start_service "payment-service" "$MS_DIR/payment-service" "8088"
sleep 5

# 11. Blockchain Service
echo "--- 11/12 Blockchain Service ---"
start_service "blockchain-service" "$MS_DIR/blockchain-service" "8089"
sleep 5

# 12. API Gateway
echo "--- 12/12 API Gateway ---"
start_service "api-gateway" "$MS_DIR/api-gateway" "8080"
sleep 5

echo ""
echo "=== Tous les microservices ont été lancés en arrière-plan ==="
echo ""
echo "Ports principaux:"
echo "  - Config Server:   http://localhost:8888"
echo "  - Eureka:          http://localhost:8761"
echo "  - API Gateway:     http://localhost:8080"
echo "  - User Service:    http://localhost:8081"
echo "  - Campaign:        http://localhost:8082"
echo "  - Matching:        http://localhost:8083"
echo "  - Donation:        http://localhost:8084"
echo "  - Wallet:          http://localhost:8085"
echo "  - Transaction:     http://localhost:8086"
echo "  - Notification:    http://localhost:8087"
echo "  - Payment:         http://localhost:8088"
echo "  - Blockchain:      http://localhost:8089"
echo ""
echo "Logs: $ROOT_DIR/logs/"
echo "Pour arrêter: ./scripts/stop-microservices.sh"
echo ""

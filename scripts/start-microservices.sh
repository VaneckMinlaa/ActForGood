#!/usr/bin/env bash
#
# Lance tous les microservices ActForGood dans le bon ordre.
# À exécuter depuis la racine du projet actforgood.
#

set -e

# Répertoire racine du projet (parent du dossier scripts)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MS_DIR="$ROOT_DIR/AcrForGood Microservices"

cd "$ROOT_DIR"

echo "=== ActForGood - Démarrage des microservices ==="
echo "Racine projet: $ROOT_DIR"
echo ""

# Option: démarrer PostgreSQL (et Redis) avec Docker
if [ "$1" = "--with-docker" ] || [ "$1" = "-d" ]; then
  echo ">> Démarrage de PostgreSQL (Docker)..."
  docker-compose up -d postgres
  echo "   Attente 5s que PostgreSQL soit prêt..."
  sleep 5
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
  echo $! >> "$PID_FILE"
  echo "   PID: $!"
}

# 1. Service Discovery (Eureka) - doit être lancé en premier
echo ""
echo "--- 1/7 Service Discovery (Eureka) ---"
start_service "service-discovery" "$MS_DIR/service-discovery" "8761"
sleep 15
echo "   Eureka démarré (port 8761). Attente 15s..."
echo ""

# 2. User Service
echo "--- 2/7 User Service ---"
start_service "user-service" "$MS_DIR/user-service" "8081"
sleep 5

# 3. Campaign Service
echo "--- 3/7 Campaign Service ---"
start_service "campaign-service" "$MS_DIR/campaign-service" "8082"
sleep 3

# 4. Matching Service
echo "--- 4/7 Matching Service ---"
start_service "matching-service" "$MS_DIR/matching-service" "8083"
sleep 3

# 5. Payment Service
echo "--- 5/7 Payment Service ---"
start_service "payment-service" "$MS_DIR/payment-service" "8084"
sleep 3

# 6. Blockchain Service
echo "--- 6/7 Blockchain Service ---"
start_service "blockchain-service" "$MS_DIR/blockchain-service" "8085"
sleep 5

# 7. API Gateway
echo "--- 7/7 API Gateway ---"
start_service "api-gateway" "$MS_DIR/api-gateway" "8080"

echo ""
echo "=== Tous les microservices ont été lancés en arrière-plan ==="
echo ""
echo "Ports:"
echo "  - Eureka:          http://localhost:8761"
echo "  - API Gateway:     http://localhost:8080"
echo "  - User Service:    http://localhost:8081"
echo "  - Campaign:        http://localhost:8082"
echo "  - Matching:        http://localhost:8083"
echo "  - Payment:         http://localhost:8084"
echo "  - Blockchain:      http://localhost:8085"
echo ""
echo "Logs: $ROOT_DIR/logs/"
echo "Pour arrêter: ./scripts/stop-microservices.sh"
echo ""

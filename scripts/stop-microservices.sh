#!/usr/bin/env bash
#
# Arrête tous les microservices ActForGood (processus Spring Boot).
# À exécuter depuis la racine du projet actforgood.
#

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$ROOT_DIR/logs/microservices.pid"

echo "=== Arrêt des microservices ActForGood ==="

# D'abord tuer les PIDs enregistrés par start-microservices.sh
if [ -f "$PID_FILE" ]; then
  while read -r pid; do
    [ -z "$pid" ] && continue
    if kill -0 "$pid" 2>/dev/null; then
      echo "Arrêt du PID $pid..."
      kill "$pid" 2>/dev/null || kill -9 "$pid" 2>/dev/null
    fi
  done < "$PID_FILE"
  echo "" > "$PID_FILE"
  sleep 2
fi

# Ensuite tuer tout processus spring-boot:run restant (actforgood)
pids=$(pgrep -f "spring-boot:run" 2>/dev/null || true)
if [ -n "$pids" ]; then
  echo "Processus Spring Boot restants: $pids"
  echo "$pids" | xargs -r kill -- 2>/dev/null || true
  sleep 2
  pids=$(pgrep -f "spring-boot:run" 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "$pids" | xargs -r kill -9 -- 2>/dev/null || true
  fi
fi

# Libérer les ports au cas où un processus n'a pas été tué
PORTS="8761 8080 8081 8082 8083 8084 8085"
for port in $PORTS; do
  pid=$(lsof -ti ":$port" 2>/dev/null || true)
  if [ -n "$pid" ]; then
    echo "Libération du port $port (PID $pid)..."
    echo "$pid" | xargs -r kill -9 -- 2>/dev/null || true
  fi
done

echo "Microservices arrêtés."

# Option: arrêter Docker
if [ "$1" = "--docker" ] || [ "$1" = "-d" ]; then
  echo ""
  echo ">> Arrêt des conteneurs Docker (postgres, redis)..."
  (cd "$ROOT_DIR" && docker-compose down 2>/dev/null || true)
  echo "   Docker arrêté."
fi

echo ""
echo "Terminé."

#!/bin/bash

# ActForGood - Script de lancement des microservices en environnement de développement
# Ce script configure l'infrastructure via Docker et lance chaque microservice
# en arrière-plan, en redirigeant les logs vers un dossier spécifique.

echo " Initialisation du projet ActForGood - Microservices"

# 1. Identifier les dossiers
SCRIPT_DIR=$(dirname "$0")
BASE_DIR=$(cd "$SCRIPT_DIR/.." || exit; pwd)
TARGET_DIR="$BASE_DIR/ActForGood Microservices"
LOG_DIR="$BASE_DIR/Logs"

# Créer le répertoire de logs s'il n'existe pas
mkdir -p "$LOG_DIR"
echo " Les logs seront sauvegardés dans : $LOG_DIR"

# Fichier pour stocker les PIDs des processus
PID_FILE="$SCRIPT_DIR/microservices.pid"
> "$PID_FILE" # Vider le fichier s'il existe

# 2. Lancement des dépendances d'infrastructure
cd "$BASE_DIR" || exit
echo " 1. Démarrage de l'infrastructure via Docker (Postgres, Redis, RabbitMQ, MongoDB)..."
docker-compose up -d postgres redis rabbitmq mongodb

echo " Attente de l'initialisation des bases de données (15 secondes)..."
sleep 15
echo " Infrastructure démarrée."

# 3. Méthode pour démarrer un service Spring Boot en arrière-plan
start_service() {
    SERVICE=$1
    WAIT_TIME=$2
    LOG_FILE="$LOG_DIR/$SERVICE.log"
    
    echo " Démarrage de: $SERVICE... (Logs => $LOG_FILE)"
    
    cd "$TARGET_DIR/$SERVICE" || { echo " Dossier introuvable: $TARGET_DIR/$SERVICE"; return; }
    
    # Lancement en arrière-plan
    nohup mvn spring-boot:run > "$LOG_FILE" 2>&1 &
    PID=$!
    
    # Écriture du nom du service et de son PID
    echo "$SERVICE:$PID" >> "$PID_FILE"
    
    if [ "$WAIT_TIME" -gt 0 ]; then
        echo " Attente de $WAIT_TIME secondes pour permettre l'initialisation du service..."
        sleep "$WAIT_TIME"
    fi
}

echo " 2. Démarrage de l'infrastructure Spring Cloud"

# L'ordre est très important pour Spring Cloud
start_service "config-server" 15
start_service "service-discovery" 20
start_service "api-gateway" 15

echo " 3. Démarrage des microservices métiers"

SERVICES=(
    "user-service"
    "campaign-service"
    "matching-service"
    "donation-service"
    "wallet-service"
    "transaction-service"
    "payment-service"
    "notification-service"
    "blockchain-service"
)

# On boucle sur tous les autres microservices
for service in "${SERVICES[@]}"; do
    start_service "$service" 5
done

# Retour au dossier de base
cd "$BASE_DIR" || exit

echo " TERMINÉ : Tous les services ont été démarrés en arrière-plan !"
echo " Les logs sont tous situés dans    : $LOG_DIR"
echo " Pour arrêter les services, lancez : bash scripts/stop-microservices.sh"
echo " Eureka Dashboard                  : http://localhost:8761"
echo " API Gateway                       : http://localhost:8080"

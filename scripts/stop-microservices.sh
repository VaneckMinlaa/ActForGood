#!/bin/bash

# ActForGood - Script d'arrêt des microservices

echo "========================================================"
echo "🛑 Arrêt des microservices ActForGood"
echo "========================================================"

SCRIPT_DIR=$(dirname "$0")
PID_FILE="$SCRIPT_DIR/microservices.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "⚠️ Aucun fichier PID ($PID_FILE) trouvé. Les microservices ne semblent pas tourner."
else
    echo "📄 Fichier de PIDs trouvé. Arrêt des processus..."
    
    # Lire chaque ligne: "service:pid"
    while IFS=: read -r SERVICE PID; do
        if [ -n "$PID" ]; then
            echo "🛑 Arrêt de $SERVICE (PID: $PID)..."
            
            # Sous Windows (Git Bash), utilise taskkill pour s'assurer que l'arbre des processus Java/Maven est tué.
            if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
                # Utilise taskkill pour forcer l'arrêt du processus et de ses enfants
                taskkill //PID "$PID" //T //F > /dev/null 2>&1
            else
                kill -9 "$PID" > /dev/null 2>&1
            fi
            echo "✅ $SERVICE intercepté et arrêté."
        fi
    done < "$PID_FILE"
    
    # Supprimer le fichier PID une fois terminé
    rm -f "$PID_FILE"
    echo "✅ Les microservices Java ont été arrêtés."
fi

echo "========================================================"
echo "📦 Arrêt de l'infrastructure Docker ?"
echo "========================================================"
read -p "Voulez-vous aussi arrêter Postgres, Redis, RabbitMQ et MongoDB ? (o/N) " RESP

if [[ "$RESP" == "o" || "$RESP" == "O" || "$RESP" == "y" || "$RESP" == "Y" ]]; then
    BASE_DIR=$(cd "$SCRIPT_DIR/.." || exit; pwd)
    cd "$BASE_DIR" || exit
    docker-compose stop postgres redis rabbitmq mongodb
    echo "✅ Infrastructure de base de données arrêtée."
else
    echo "ℹ️ L'infrastructure via Docker continue de tourner en arrière-plan."
fi

echo "========================================================"
echo "✅ Script terminé."
echo "========================================================"

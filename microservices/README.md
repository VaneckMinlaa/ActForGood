# Microservices ActForGood

Architecture orientée microservices avec Spring Boot et Spring Cloud.

## Services

1. **service-discovery** : Eureka Server pour la découverte de services
2. **api-gateway** : Spring Cloud Gateway pour le routage et la gestion des requêtes
3. **user-service** : Gestion des utilisateurs (ONG, bienfaiteurs)
4. **campaign-service** : Gestion des campagnes de dons
5. **matching-service** : Service de matching IA pour recommandations
6. **payment-service** : Gestion des paiements (Mobile Money, crypto, cartes)
7. **blockchain-service** : Traçabilité blockchain des transactions

## Architecture

Chaque service suit une architecture en couches :

```
service/
├── src/main/java/com/actforgood/[service]/
│   ├── config/          # Configuration Spring
│   ├── controller/      # Contrôleurs REST
│   ├── service/         # Logique métier
│   ├── repository/      # Accès aux données
│   ├── model/           # Entités et DTOs
│   ├── dto/             # Data Transfer Objects
│   ├── exception/       # Gestion des exceptions
│   └── util/            # Utilitaires
├── src/main/resources/
│   └── application.yml
└── pom.xml
```

## Communication Inter-Services

- **Synchronous** : Feign Client (REST)
- **Asynchronous** : RabbitMQ / Kafka (pour événements)

## Base de Données

- **MongoDB** : Base de données principale pour chaque service
- **Redis** : Cache distribué

## Démarrage

1. Démarrer MongoDB et Redis
2. Démarrer service-discovery
3. Démarrer api-gateway
4. Démarrer les autres services dans n'importe quel ordre

```bash
# Avec Docker Compose
docker-compose up -d

# Ou manuellement
cd service-discovery && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run
# etc.
```

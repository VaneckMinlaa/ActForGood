# ActForGood

Une plateforme de matching intelligent et transparent pour dons sociaux

## Description

ActForGood est une application mobile et web qui connecte les bienfaiteurs (locaux ou diaspora) aux ONG, orphelinats et associations camerounaises, en utilisant l'IA pour personnaliser les matchs, assurer la transparence des fonds via blockchain, et mesurer l'impact en temps réel.

## Architecture

Le projet est structuré en trois parties principales :

1. **Microservices Java** : Architecture orientée microservices avec Spring Boot
2. **Application Web Angular** : Interface web avec architecture propre
3. **Application Mobile React Native** : Application mobile cross-platform

## Structure du Projet

```
actforgood/
├── microservices/          # Services backend en Java
│   ├── api-gateway/        # API Gateway (Spring Cloud Gateway)
│   ├── service-discovery/  # Service Discovery (Eureka)
│   ├── user-service/       # Service de gestion des utilisateurs
│   ├── campaign-service/   # Service de gestion des campagnes
│   ├── matching-service/   # Service de matching IA
│   ├── payment-service/    # Service de paiement
│   └── blockchain-service/ # Service blockchain pour traçabilité
├── web/                    # Application web Angular
└── mobile/                 # Application mobile React Native
```

## Technologies

### Backend (Microservices)
- Java 17+
- Spring Boot 3.x
- Spring Cloud (Gateway, Eureka, Config)
- MongoDB
- Redis (cache)
- JWT (authentification)

### Frontend Web
- Angular 17+
- RxJS
- Angular Material
- NgRx (state management)

### Mobile
- React Native
- React Navigation
- Redux Toolkit
- React Native Paper

## Démarrage Rapide

### Prérequis
- Java 17+
- Node.js 18+
- MongoDB
- Redis
- Docker (optionnel)

### Installation

Voir les README spécifiques dans chaque dossier :
- [Microservices](./microservices/README.md)
- [Web](./web/README.md)
- [Mobile](./mobile/README.md)

## Fonctionnalités

1. **Inscription et profilage** : ONG et bienfaiteurs
2. **Matching IA** : Recommandations personnalisées
3. **Dons sécurisés** : Mobile Money, crypto, cartes
4. **Transparence blockchain** : Traçabilité des fonds
5. **Mesure d'impact** : Dashboards et métriques
6. **Communauté** : Forums et échanges
7. **Gamification** : Badges et challenges

## Licence

Propriétaire - ActForGood

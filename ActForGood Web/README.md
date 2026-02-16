# ActForGood Web Application

Application web Angular pour la plateforme ActForGood.

## Architecture

Architecture modulaire et propre avec séparation des responsabilités :

```
src/
├── app/
│   ├── core/              # Services singleton, guards, interceptors
│   ├── shared/            # Composants, directives, pipes réutilisables
│   ├── features/          # Modules fonctionnels
│   │   ├── auth/          # Authentification
│   │   ├── campaigns/     # Gestion des campagnes
│   │   ├── donations/     # Dons
│   │   ├── matching/      # Matching et recommandations
│   │   ├── profile/       # Profils utilisateurs
│   │   └── dashboard/     # Tableaux de bord
│   └── layout/            # Layout principal
├── assets/                # Ressources statiques
└── environments/          # Configuration par environnement
```

## Technologies

- Angular 17+
- RxJS
- Angular Material
- NgRx (State Management)
- Angular Router

## Installation

```bash
npm install
```

## Développement

```bash
ng serve
```

L'application sera accessible sur `http://localhost:4200`

## Build

```bash
ng build --prod
```

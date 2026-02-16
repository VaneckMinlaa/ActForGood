# ActForGood Mobile Application

Application mobile React Native pour la plateforme ActForGood.

## Architecture

Architecture modulaire et propre avec séparation des responsabilités :

```
src/
├── screens/          # Écrans de l'application
├── components/       # Composants réutilisables
├── services/         # Services API et logique métier
├── navigation/       # Configuration de navigation
├── store/            # Redux store (state management)
├── utils/            # Utilitaires et helpers
├── constants/        # Constantes
└── types/            # TypeScript types
```

## Technologies

- React Native 0.72 + Expo SDK 49
- React Navigation
- Redux Toolkit
- React Native Paper (UI)
- fetch (API, sans axios)

## Prérequis

- Node.js 18+
- Java JDK 17+ (pour Android)
- Android Studio (pour Android)
- Xcode (pour iOS - macOS uniquement)
- **Expo Go** installé sur l’appareil/émulateur (pour le mode Expo)

## Installation

En cas d’erreur **« PlatformConstants could not be found »**, **« flushOperations is not a function »**, **« @babel/runtime could not be found »** ou **« Unable to resolve expo/AppEntry »** :

1. **Réinstaller les dépendances** (surtout si vous avez un `node_modules` dans votre répertoire personnel `~/node_modules`) :
   ```bash
   cd mobile
   rm -rf node_modules package-lock.json
   npm install
   npx expo install --fix
   ```
2. **Lancer avec cache vide** :
   ```bash
   npx expo start --clear
   ```
3. Vérifier que **Expo Go** sur l’appareil/émulateur est compatible **SDK 49** (ou exécuter `npx expo install --fix` pour aligner le projet sur la version d’Expo Go installée).

Pour iOS (macOS uniquement) : `cd ios && pod install && cd ..`

## Développement

### Option 1 : Expo (Expo Go)

```bash
npm install
npx expo start --clear
```

Scannez le QR code avec **Expo Go** (Android) ou l’app **Appareil photo** (iOS). Vérifiez que **Expo Go** est à jour et compatible **SDK 49**.

### Option 2 : React Native CLI

```bash
npx react-native start
```

`npx react-native run-android` ou `npx react-native run-ios` (macOS).

Le projet supporte **Expo** (Expo Go) et **React Native CLI**.  
- Utilisez `npm start` puis `npm run android` (ou `npx react-native run-android`).  
- **Ne lancez pas l’app avec Expo Go** (QR code) : vous obtiendriez l’erreur « Property 'require' doesn't exist » car Expo Go est prévu pour des projets Expo, pas pour ce projet React Native CLI.

## Build

### iOS
```bash
cd ios && pod install && cd ..
npx react-native run-ios --configuration Release
```

### Android
```bash
npx react-native run-android --variant=release
```

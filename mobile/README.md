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

- React Native
- React Navigation
- Redux Toolkit
- React Native Paper (UI)
- Axios

## Installation

```bash
npm install
```

## Prérequis

- Node.js 18+
- Java JDK 17+ (pour Android)
- Android Studio (pour Android)
- Xcode (pour iOS - macOS uniquement)
- React Native CLI : `npm install -g react-native-cli`

## Installation

```bash
# Installer les dépendances
npm install

# Pour iOS (macOS uniquement)
cd ios && pod install && cd ..
```

## Développement

### Démarrer le serveur Metro
```bash
npm start
# ou
npx react-native start
```

### Lancer sur Android
Dans un autre terminal :
```bash
npm run android
# ou
npx react-native run-android
```

### Lancer sur iOS (macOS uniquement)
Dans un autre terminal :
```bash
npm run ios
# ou
npx react-native run-ios
```

**Note importante** : Ce projet utilise React Native CLI, pas Expo. Utilisez `npm start` et non `npm expo start`.

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

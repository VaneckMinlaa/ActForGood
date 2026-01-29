# Guide de Démarrage Rapide - ActForGood Mobile

## ⚠️ Important

Ce projet utilise **React Native CLI**, pas Expo. Utilisez les commandes suivantes :

## Commandes Correctes

### 1. Démarrer le serveur Metro (Bundler)
```bash
npm start
# ou
npx react-native start
```

**❌ Ne pas utiliser** : `npm expo start` (cette commande est pour Expo)

### 2. Lancer sur Android
Dans un **nouveau terminal** (pendant que Metro tourne) :
```bash
npm run android
# ou
npx react-native run-android
```

### 3. Lancer sur iOS (macOS uniquement)
Dans un **nouveau terminal** (pendant que Metro tourne) :
```bash
npm run ios
# ou
npx react-native run-ios
```

## Prérequis

### Pour Android
- Android Studio installé
- Android SDK configuré
- Émulateur Android ou appareil physique connecté
- Variable d'environnement `ANDROID_HOME` configurée

### Pour iOS (macOS uniquement)
- Xcode installé
- CocoaPods : `sudo gem install cocoapods`
- Installer les pods : `cd ios && pod install && cd ..`

## Dépannage

### Erreur "Unknown command: expo"
➡️ C'est normal ! Ce projet n'utilise pas Expo. Utilisez `npm start` à la place.

### Erreur Metro bundler
```bash
# Nettoyer le cache
npm start -- --reset-cache
```

### Erreur Android
```bash
# Nettoyer le build
cd android
./gradlew clean
cd ..
npm run android
```

### Erreur iOS
```bash
# Réinstaller les pods
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

## Structure du Projet

```
mobile/
├── src/
│   ├── screens/      # Écrans de l'application
│   ├── services/     # Services API
│   ├── store/        # Redux store
│   ├── navigation/   # Navigation
│   └── types/        # Types TypeScript
├── android/          # Code Android natif
├── ios/              # Code iOS natif
└── package.json      # Dépendances
```

## Configuration API

Modifiez `src/constants/api.ts` pour changer l'URL de l'API :
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://localhost:8080/api'  // Développement
  : 'https://api.actforgood.com/api';  // Production
```

Pour Android, utilisez `http://10.0.2.2:8080/api` au lieu de `localhost`.

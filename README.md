# Hiragana Trainer

Application mobile d'entraînement aux hiragana japonais, développée avec React Native (Expo).

## Fonctionnalités

- Mode **Caractères** : un hiragana à la fois, filtrable par rangée (K, S, T...)
- Mode **Mots** : 53 mots courants en hiragana → romaji avec traduction française
- Feedback immédiat vert/rouge avec la bonne réponse et la traduction
- Score et série persistants (AsyncStorage)

## Installation

```bash
npm install
npx expo start
```

Scanner le QR code avec **Expo Go** sur Android ou iOS.

## Build production

Installer EAS CLI :

```bash
npm install -g eas-cli
eas login
eas build --platform android   # .apk / .aab
eas build --platform ios       # .ipa (compte Apple Developer requis)
```

## GitHub Actions

Le workflow `.github/workflows/expo-preview.yml` publie automatiquement un preview Expo à chaque push sur `main`.

Ajouter le secret `EXPO_TOKEN` dans les settings du repo GitHub (Settings → Secrets → Actions).

## Stack

- React Native 0.74
- Expo 51
- Expo Router 3
- AsyncStorage (persistence du score)
- TypeScript

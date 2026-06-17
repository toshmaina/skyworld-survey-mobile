# simple-survey-mobile

Sky World Survey Platform — React Native mobile app built with Expo.

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Login | `/(auth)/login` | JWT authentication |
| Available Surveys | `/(app)/surveys` | Page 3 — list all surveys |
| Survey Detail | `/(app)/surveys/[id]` | View survey info + questions preview |
| Survey Form | `/(app)/surveys/[id]/respond` | Page 4 — stepped form + review + submit |

## Technologies

| Tool | Purpose |
|------|---------|
| Expo SDK 51 | React Native toolchain |
| Expo Router | File-based navigation |
| Axios | HTTP client |
| fast-xml-parser | Parse XML API responses |
| expo-document-picker | PDF file uploads |
| expo-secure-store | JWT token storage |

## Prerequisites

- Node.js 18+
- npm 9+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing) OR Android emulator

## Installation

```bash
git clone https://github.com/your-username/simple-survey-mobile.git
cd simple-survey-mobile
npm install
npx expo install
```

## Configuration

Open `src/api/client.ts` and update `API_BASE_URL`:

```ts
// Android emulator → host machine's localhost
export const API_BASE_URL = 'http://10.0.2.2:8080';

// iOS simulator
export const API_BASE_URL = 'http://localhost:8080';

// Physical device → your machine's local IP
export const API_BASE_URL = 'http://192.168.x.x:8080';
```

Find your local IP:
```bash
# Linux/Mac
ip addr show | grep 'inet '
# Windows
ipconfig
```

## Running locally

```bash
# Start Expo dev server
npx expo start

# Then press:
# a → open Android emulator
# i → open iOS simulator
# Scan QR code with Expo Go app on physical device
```

## Default credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skyworld.com | Admin@1234 |
| User | user@skyworld.com | User@1234 |

## Building APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure
eas build:configure

# Build Android APK (preview profile)
eas build --platform android --profile preview
```

## Assumptions

1. The API must be running and reachable before using the app.
2. Only PDF files are accepted for file upload questions.
3. JWT token is stored securely using `expo-secure-store` (AES encryption on Android, Keychain on iOS).
4. The app supports portrait orientation only.
5. No offline mode — all data is fetched live from the API.

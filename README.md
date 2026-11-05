# Freight CBM

A lightweight, offline iOS cargo volume calculator built with Expo and React Native.

**Why it exists:** A first shipped mobile app and a small logistics-focused portfolio project.

## Features

- Dimensions in centimetres, inches or feet (a shared unit for L × W × H).
- Quantity-aware CBM and cubic feet (CFT) results.
- One-tap result copy and input clearing.
- Instant, offline calculations. No accounts, backend, ads, analytics or stored cargo records.

## Screenshot / demo

Example: **48 × 40 × 40 inches × 2 pieces → 2.5171 CBM / 88.89 CFT**.

> Add real device screenshots after testing. Never upload simulated screenshots as real screenshots to App Store Connect.

## Run locally (Windows / macOS / Linux)

Prerequisites: Node.js 22 LTS or newer and a working internet connection for the initial npm installation. Install Expo Go on an iPhone running a compatible version.

```bash
npm install
npm test
npx expo-doctor
npx expo start
```

Connect the PC and iPhone to the same Wi-Fi network, then scan the terminal QR code with the iPhone Camera (or use the Expo Go app). If the local connection fails, try `npx expo start --tunnel` after signing into Expo.

**Expo Go versions:** The app targets **Expo SDK 58**; check whether the iPhone's Expo Go supports SDK 58 before scanning. Expo Go is for functional development testing only.

## Formula

`CBM = (length × unit_in_meters) × (width × unit_in_meters) × (height × unit_in_meters) × quantity`

- cm = 0.01 m
- in = 0.0254 m
- ft = 0.3048 m
- 1 CBM = 35.31466672148859 CFT

All arithmetic uses unrounded numbers; the UI rounds displayed CBM to four decimals and CFT to two. Use external packaged dimensions. CBM is **not** chargeable weight and does not substitute for verified shipping measurements.

## Git and GitHub

This supplied folder already includes an initial local Git commit if downloaded from the project's ZIP. After creating an empty repository called `freight-cbm` on GitHub:

```bash
git remote add origin https://github.com/schiele19c/freight-cbm.git
git branch -M main
git push -u origin main
```

Use GitHub Desktop if preferred. Never commit `.env`, Apple certificates or credentials.

## Build for App Store (no Mac required)

1. Register an Apple Developer Program account **when ready to release**, and create a free Expo account.
2. Double-check the globally unique `ios.bundleIdentifier` in `app.json` *before* your first App Store build.
3. Run `npm install -g eas-cli`, then `eas login`, `eas build:configure` (select iOS) and `eas build --platform ios --profile production`.
4. Complete Apple's signing setup through EAS interactive instructions; use your own browser for Apple login / 2FA. Never send credentials to a coding assistant.
5. After successful cloud build, use `eas submit --platform ios --profile production` to upload to App Store Connect.
6. In [App Store Connect](https://appstoreconnect.apple.com/), fill in listing metadata, *genuine* screenshots, privacy responses, privacy policy URL, support URL and other required questions; test on a real iPhone via TestFlight.
7. Only after that, submit for Apple App Review. Approval is not guaranteed; see minimum-functionality guideline 4.2.

Detailed checklist: [docs/RELEASE_CHECKLIST_KO.md](docs/RELEASE_CHECKLIST_KO.md).

## License

MIT. Built as a logistics portfolio MVP; this app is not affiliated with freight carriers or customs authorities.

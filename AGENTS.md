# Agent instructions for Freight CBM

Objective: an intentionally small, offline-first iOS cargo volume calculator. Do not add accounts, databases, analytics, tracking, advertisements, or new dependencies unless the user explicitly asks.

- Expo React Native managed app, SDK 58.
- Calculation logic lives in `src/calculator.js`, with tests in `tests/calculator.test.js`.
- Always run `npm test` after changes; never alter the conversion constants to hide failing tests.
- Inputs length, width, height share a global cm/in/ft unit; quantity must be a positive integer.
- Display total CBM and CFT, allow copying, and offer Clear. Protect against invalid inputs.
- Maintain responsive, accessible mobile UX. Keep comments in code in English; explain work to the user in Korean.
- Before release, check `npx expo-doctor`, install EAS CLI, confirm bundle ID, privacy policy/support URLs, real screenshots, Apple account and App Store metadata.
- Never request Apple ID password, certificates, private keys, or 2FA codes in chat or put them in Git.
- Do not claim an iOS build, TestFlight upload, App Store review or GitHub push completed unless confirmed by actual service output.

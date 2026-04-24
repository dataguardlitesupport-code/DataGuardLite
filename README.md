# DataGuard Lite (Android, Kotlin + Compose)

Native Android app that automatically tracks mobile data usage per-app and system-wide using `NetworkStatsManager` and `UsageStatsManager`. All data stays on-device.

## Features
- Automatic data tracking (no manual entry)
- Top apps by data usage
- Monthly limit + smart alerts (50/75/90/100%)
- 7-day history chart (MPAndroidChart)
- Foreground monitoring service + boot-resume
- Room + DataStore for local persistence
- AdMob banner + interstitial (Google test IDs)
- Material 3 + Jetpack Compose, MVVM

## Build (Termux or desktop)

Requires JDK 17 and Android SDK (cmdline-tools, platform-tools, platforms;android-34, build-tools;34.0.0).

```
chmod +x gradlew
./gradlew assembleDebug
```

APK: `app/build/outputs/apk/debug/app-debug.apk`

> The included `gradlew` is a simple shim that calls a system `gradle`. If you prefer the full wrapper, run `gradle wrapper --gradle-version 8.7` once.

## Permissions
- Usage Access: granted via Settings (the onboarding screen opens it)
- Notifications: requested at runtime on Android 13+
- Foreground service: declared in manifest

## Package
`com.dataguardlite.app`

## Notes
- AdMob uses Google's official test IDs — safe to ship for testing, replace before production.
- Per-app mobile usage requires Usage Access permission.

# DataGuard Lite

Native Android app (Kotlin + Jetpack Compose) that monitors mobile data usage per app and system-wide using Android's `NetworkStatsManager` and `UsageStatsManager`.

## Features
- Automatic per-app mobile data usage tracking (no manual entry)
- Daily / monthly totals
- Configurable monthly data limit with alerts at 50/75/90/100%
- Foreground service + boot receiver = survives reboot, runs reliably in background
- Material 3 UI (Jetpack Compose)
- MVVM architecture

## Build the APK

### Option 1: GitHub Actions (recommended — no local SDK needed)
1. Push this repo to GitHub.
2. Go to **Actions** tab → wait for "Build Debug APK" workflow to finish.
3. Download the `DataGuardLite-debug-apk` artifact. Install the APK on your phone.

### Option 2: Locally with Android Studio
1. Open the project folder in Android Studio (Hedgehog or newer).
2. Let Gradle sync. Run on a device or emulator.

## Required permissions (granted at first launch)
- **Usage Access** (`PACKAGE_USAGE_STATS`) — required for `NetworkStatsManager`
- **POST_NOTIFICATIONS** (Android 13+)

# SubTracker 💳

A beautiful PWA to track your subscriptions and get notified before payments hit.

## Features
- 📋 Pre-loaded with your subscriptions ($509/mo)
- 🔔 Notifications: 3 days before, 1 day before, and on payment day
- ➕ Add / edit / remove subscriptions
- 🔗 Quick-link to manage each subscription's website
- 📱 Installable on your phone (iOS & Android)
- 💾 All data saved locally on your device

## Deploy to GitHub Pages (free hosting)

1. Create a new repo on GitHub (e.g. `subtracker`)
2. Upload all files from this folder
3. Go to **Settings → Pages → Source: main branch / root**
4. Your app is live at `https://yourusername.github.io/subtracker`

## Install on your phone

**iPhone (Safari):**
1. Open the URL in Safari
2. Tap the Share button (box with arrow)
3. Tap "Add to Home Screen"
4. Done — opens like a native app

**Android (Chrome):**
1. Open the URL in Chrome
2. Tap the 3-dot menu
3. Tap "Add to Home Screen" or "Install App"

## Notifications

Tap the 🔔 bell icon in the app to enable notifications.
- You'll get alerts when a payment is **today**, **1 day away**, or **3 days away**
- On iOS, notifications only work when the app is installed on the home screen

## File structure
```
index.html      — main UI
style.css       — styles
app.js          — all logic + data
sw.js           — service worker (offline + notifications)
manifest.json   — PWA config
icons/          — app icons (add icon-192.png and icon-512.png)
```

## Adding icons

For the app icon, add two PNG files to an `icons/` folder:
- `icons/icon-192.png` (192×192px)
- `icons/icon-512.png` (512×512px)

You can use any icon generator or create your own.

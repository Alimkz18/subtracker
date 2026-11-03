# SubTracker

Offline-first progressive web app that tracks recurring subscriptions and reminds you before a payment hits.

**Live:** https://alimkz18.github.io/subtracker

## Features

- Add, edit and remove subscriptions with price, billing cycle and next payment date
- Monthly total calculated automatically
- Push notifications 3 days before, 1 day before and on the payment day
- Quick link to each service's account page to cancel or change a plan
- Installable on iOS and Android (Add to Home Screen), works offline
- No backend, no account: all data stays in the browser's local storage

## How it works

| File | Role |
|---|---|
| `index.html` | UI |
| `style.css` | Styles |
| `app.js` | State, rendering, notification scheduling |
| `sw.js` | Service worker: offline cache and notification delivery |
| `manifest.json` | PWA manifest (icons, display mode) |

## Run locally

Any static server works:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Notifications require HTTPS or `localhost`. On iOS they work only after the app is installed to the home screen.

## Deploy

The site is published from the `main` branch root via GitHub Pages (Settings → Pages).

## Roadmap

- Export / import as JSON
- Currency selection
- Category breakdown chart

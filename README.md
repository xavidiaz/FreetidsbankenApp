# Fritidsbanken App

A prototype web app for [Fritidsbanken](https://www.fritidsbanken.se/), where people borrow sports and leisure equipment for free. Browse items by category, pick dates and a pickup shop, check out a loan and show a QR code at pickup.

**Live demo:** <https://freetidsbanken.lab.xavidiaz.com/> (click **Try the demo** on the login screen)

## Features

- **Browse** items and categories, with filtering and related items
- **Reserve**: add items to a cart, choose a date range and pickup shop, check out
- **Loans**: see your loans and open a **QR code** for pickup
- **Reviews**: leave, edit and delete reviews on items
- **Accounts**: sign in or sign up with an email (no passwords; this is a prototype)

## Demo data

There is no backend. The app ships with mock data in `data/freetidsbanken_db.json` (users, shops, categories, items, reviews, loans), and changes such as new loans, reviews or sign-ups are kept in the browser's `localStorage`.

Any seeded user can sign in by email: `user1@example.com` to `user30@example.com`.

## Tech stack

- React 19 + Vite
- Tailwind CSS + shadcn/ui (Radix UI)
- Zustand for state
- React Router
- React Hook Form + Zod for forms
- `qrcode.react` for QR codes

## Getting started

```sh
git clone https://github.com/xavidiaz/FreetidsbankenApp.git
cd FreetidsbankenApp
bun install        # or: npm install
bun run dev        # http://localhost:3000
```

Other scripts:

```sh
bun run build      # production build in dist/
bun run preview    # serve the build locally
bun run lint       # ESLint
```

## Deployment

Every push to `main` runs a GitHub Actions workflow (`.github/workflows/publish.yml`) that builds an arm64 Docker image and pushes it to `ghcr.io/xavidiaz/freetidsbanken`. The image is a static build served by unprivileged nginx (`nginx.conf`, with a fallback to `index.html` for client-side routes).

My home server (a Raspberry Pi running NixOS) checks for a new image every few minutes and restarts the app with it, so the live demo updates on its own a few minutes after a push.

# HCMS Landing Page

A standalone Next.js landing page for the HCMS clinic management application. It presents product capabilities and routes account actions to the application.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_APP_URL` in `.env.local` to the origin where the HCMS application is running. Sign up and sign in buttons use its `/signup` and `/login` routes. The default is `http://localhost:3000` for a local HCMS app.

The dashboard preview uses illustrative sample data and is not connected to the application.

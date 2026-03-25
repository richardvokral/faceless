# Group Pass Alpha

Cross-brand loyalty platform MVP. Tests Logto as identity core with custom business rules (media subscription → fashion loyalty points).

## Architecture

```
User → Vercel / Next.js → Logto Cloud (identity) → Neon Postgres (business data)
```

- **Logto**: registration, login, session, profile, account settings
- **Your app**: subscriptions, points, benefit rules, admin panel
- **Neon**: business data storage (customer state, benefit events, admin audit log)

## Setup Guide (all UI, no CLI needed for services)

### 1. Logto Cloud (free, no credit card)

1. Go to [cloud.logto.io](https://cloud.logto.io) and create an account
2. Create a new **tenant**
3. Go to **Applications** → **Create application** → choose **Next.js (App Router)**
4. Copy these values for later:
   - `App ID` → `LOGTO_APP_ID`
   - `App Secret` → `LOGTO_APP_SECRET`
   - `Endpoint` → `LOGTO_ENDPOINT`
5. In the application settings, add **Redirect URIs**:
   - `http://localhost:3000/callback` (local development)
   - `https://your-app.vercel.app/callback` (production – update after first Vercel deploy)
   - For preview deployments: `https://*.vercel.app/callback` (wildcard)
6. Add **Post sign-out redirect URIs**:
   - `http://localhost:3000`
   - `https://your-app.vercel.app`
7. Go to **Sign-in experience** → **Sign-up and sign-in** → enable **Email + Password**
8. Go to **Account center** (under Sign-in experience) → **Enable** it
   - Copy the Account Center URL → `LOGTO_ACCOUNT_CENTER_URL`

### 2. Neon Postgres (free, no credit card)

1. Go to [console.neon.tech](https://console.neon.tech) and create an account
2. Create a **new project** (any region close to you)
3. Copy the **connection string** from the dashboard → `DATABASE_URL`
   - Format: `postgresql://user:password@host/dbname?sslmode=require`

### 3. Local Development

```bash
# Clone the repo
git clone https://github.com/richardvokral/faceless.git
cd faceless

# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.example .env.local
# Edit .env.local with your Logto + Neon credentials

# Generate a cookie secret (paste into .env.local)
openssl rand -hex 32

# Push database schema to Neon
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and test the full flow.

### 4. Deploy to Vercel (auto-deploy from GitHub)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import this GitHub repository
3. Add **Environment Variables** (same values as your `.env.local`):
   - `LOGTO_APP_ID`
   - `LOGTO_APP_SECRET`
   - `LOGTO_ENDPOINT`
   - `LOGTO_BASE_URL` → `https://your-app.vercel.app` (update after first deploy)
   - `LOGTO_COOKIE_SECRET`
   - `LOGTO_ACCOUNT_CENTER_URL`
   - `DATABASE_URL`
   - `ADMIN_EMAILS`
4. Deploy! Every push to `main` will auto-deploy.
5. After first deploy, update `LOGTO_BASE_URL` in Vercel env vars with your actual URL, and add the URL to Logto redirect URIs.

## Features

### User
- Register / login / logout via Logto
- Protected dashboard with profile info
- See subscription status and fashion points balance
- Claim monthly benefit (+100 points when subscription is active)
- Benefit history ledger
- Account settings via Logto Account Center

### Admin
- Access controlled via `ADMIN_EMAILS` environment variable
- Search users by email
- Toggle media subscription on/off
- Manually grant benefits
- Full audit log of admin actions

## Database Schema

Three tables in Neon Postgres (managed via Prisma):

- **customer_state**: user profile + subscription + points balance
- **benefit_events**: ledger of all point changes (with monthly deduplication)
- **admin_actions**: audit trail for admin operations

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [Logto](https://logto.io) (authentication)
- [Neon](https://neon.tech) (PostgreSQL)
- [Prisma 7](https://prisma.io) (ORM)
- [Tailwind CSS v4](https://tailwindcss.com) (styling)
- [Vercel](https://vercel.com) (hosting)

## Environment Variables

See [`.env.example`](.env.example) for the full list with descriptions.

### Where to get each value

| Variable | Where to find it |
|----------|-----------------|
| `LOGTO_APP_ID` | Logto Console → Applications → Your App → App ID |
| `LOGTO_APP_SECRET` | Logto Console → Applications → Your App → App Secret |
| `LOGTO_ENDPOINT` | Logto Console → Applications → Your App → Endpoint (e.g. `https://abc123.logto.app`) |
| `LOGTO_BASE_URL` | Your app's URL: `http://localhost:3000` (local) or `https://your-app.vercel.app` (prod) |
| `LOGTO_COOKIE_SECRET` | **Generate yourself** — any random 32+ char string. Use a password generator or `openssl rand -base64 32`. This is NOT from Logto. |
| `LOGTO_ACCOUNT_CENTER_URL` | **Optional**. Format: `https://<your-tenant>.logto.app/account`. First enable in Logto Console → Sign-in & account → Account center. If not set, the Account Settings link won't show. |
| `DATABASE_URL` | Neon Console → Your Project → Connection Details → Connection string |
| `ADMIN_EMAILS` | Your choice — comma-separated list of emails that should have admin access |

# per-diem-coding-challenge: Next.js (apps/web) + NestJS (apps/api)
Build a multi-tenant Next.js app that connects to a TypeScript / Node.js backend with a database. The app should support subdomain-based store isolation and store-specific authentication.


## Directory layout

```
.
├─ apps/
│  ├─ web/        # Next.js app (frontend)
│  └─ api/        # NestJS app (backend)
├─ docker-compose.yml           # production compose (web + api + postgres)
├─ docker-compose.dev.yml       # development compose (hot reload)
└─ README.md
```

---

## Prerequisites

* **Docker** & **Docker Compose**
* **Node.js 18+ (ideally 20+)** and **pnpm / npm / yarn** (only needed for non‑Docker local runs)

> **Note on wildcard local domains**: modern browsers resolve `*.localhost` to `127.0.0.1`. No hosts-file changes required. Examples used below: `abc.localhost:3000`.

---

## Environment variables

Each app has its **own** `.env` file.

### apps/web/.env (example)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### apps/api/.env (example)

> Use `postgres` as the host **inside Docker** (service name). Use `localhost` when running the API directly on your machine.

```env
# Server
PORT=4000
DATABASE_URL="postgres://postgres:postgres@postgres:5433/perDiem"
JWT_SECRET=dev_secret_key
PUBLIC_HOST=localhost
COOKIE_SECURE=0
```

> The compose files typically set the Postgres service with `POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=postgres`, `POSTGRES_DB=app`. Adjust if your compose differs.

---

## Running with Docker

### Development (hot reload)

```bash
docker-compose -f docker-compose.dev.yml up --build
```

* Web: [http://localhost:3000](http://localhost:3000)
* API: [http://localhost:4000](http://localhost:4000)
* Postgres: exposed on 5433 (optional, if published)

On first run, the API will need the schema:

```bash
# From inside the api container (or locally with the same env):
# Option A: exec into container
docker compose -f docker-compose.dev.yml exec api npx prisma migrate dev
# Option B: generate / push if you don't have migrations yet
docker compose -f docker-compose.dev.yml exec api npx prisma generate
docker compose -f docker-compose.dev.yml exec api npx prisma db push
```

### Production (no hot reload)

```bash
docker-compose up --build
```

* Same ports as above (web: 3000, api: 4000). Ensure production `.env` values are set.

#### Common Docker tips

* Rebuild after env/schema changes:

  ```bash
  docker compose -f docker-compose.dev.yml up --build --force-recreate
  ```
* View logs:

  ```bash
  docker compose -f docker-compose.dev.yml logs -f web
  docker compose -f docker-compose.dev.yml logs -f api
  docker compose -f docker-compose.dev.yml logs -f postgres
  ```

---

## App flows & public routes

* **Create a store** (public): `http://localhost:3000/create-store`

  * Example: create store **abc**
* Tenant‑scoped routes (frontend):

  * Sign up: `http://abc.localhost:3000/signup`
  * Login: `http://abc.localhost:3000/login`
  * Home:  `http://abc.localhost:3000`

The Next.js frontend calls the NestJS API (`NEXT_PUBLIC_API_BASE_URL`), and the API persists data in Postgres through Prisma.

---

## Running each app **without Docker**

Sometimes you want to run just the frontend or backend locally.

### 0) Start Postgres

You have two options:

**Option A: Postgres via Docker only**

```bash
docker run --name monorepo-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=app -p 5433:5433 -d postgres:16
```

**Option B: Local Postgres**
Install Postgres and create a database named `app` (or change `DATABASE_URL` accordingly).

> Make sure `apps/api/.env` uses `@localhost:5433` when you run the API locally.

### 1) Backend (NestJS)

```bash
cd apps/api
# install deps
pnpm i # or npm i / yarn

# env
cp .env.example .env  # if you keep an example file
# ensure DATABASE_URL points to localhost

# prisma
npx prisma generate
npx prisma migrate dev  # or npx prisma db push

# run
pnpm start:dev  # or npm run start:dev / yarn start:dev
# API listens on http://localhost:4000
```

### 2) Frontend (Next.js)

```bash
cd apps/web
# install deps
pnpm i # or npm i / yarn

# env
cp .env.example .env  # if you keep an example file
# set NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
# set NEXT_PUBLIC_APP_URL=http://localhost:3000

# run
pnpm dev  # or npm run dev / yarn dev
# Web listens on http://localhost:3000
```

---

## Prisma commands (quick reference)

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create and apply a migration (interactive)
npx prisma migrate dev

# Push schema to DB without creating a migration (dev only)
npx prisma db push

# Seed (if you have a seed script)
npx prisma db seed
```

---

## Troubleshooting

* **Ports already in use**: stop other services using 3000/4000/5433 or change ports in compose/env.
* **API can’t reach Postgres in Docker**: inside compose, the host should be `postgres` (service name), not `localhost`.
* **CORS errors**: confirm `CORS_ORIGIN` includes `http://localhost:3000`.
* **Prisma errors about migrations**: run `npx prisma migrate dev` (or `db push` for scratch dev DBs).
* **Wildcard subdomains not working**: ensure you’re using `*.localhost` (e.g., `abc.localhost:3000`) – most OS/browsers map it to `127.0.0.1` automatically.

---

## Scripts (typical)

> Actual scripts may vary; check each app’s `package.json`.

**apps/web**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000"
  }
}
```

**apps/api**

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "build": "nest build"
  }
}
```

---

## Notes

* Both apps include their own `Dockerfile`. The compose files build from those and wire up the network.
* Keep `.env` files out of version control or use an `.env.example` template.
* For production, supply strong secrets and consider managed Postgres.

Happy shipping! 🚢

# 🎓 COMECS Society Management System (CSMS)

> A comprehensive, production-grade management system for the COMECS society.

**Version:** 1.0.0 (MVP Foundation)

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [Docker](#-docker)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🛠 Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| **Frontend**   | Next.js 15, React 19, TypeScript, Tailwind v4 |
| **UI Library** | shadcn/ui (New York style)                    |
| **Forms**      | React Hook Form + Zod                         |
| **Backend**    | NestJS 11, TypeScript                         |
| **ORM**        | Prisma 6                                      |
| **Database**   | PostgreSQL 16                                 |
| **Auth**       | JWT + Refresh Tokens (planned)                |
| **Tooling**    | ESLint 9, Prettier, Husky, Docker             |

---

## 📁 Project Structure

```
csms/
├── package.json               # Root monorepo package.json (npm workspaces)
├── frontend/                  # Next.js frontend application
│   ├── src/
│   │   ├── app/               # App Router pages & layouts
│   │   ├── components/
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   └── shared/        # Reusable custom components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   ├── services/          # API service layer (with apiClient)
│   │   ├── types/             # TypeScript type definitions
│   │   └── config/            # App environment configuration (with env.ts)
│   ├── public/                # Static assets
│   ├── components.json        # shadcn/ui configuration
│   ├── next.config.ts         # Next.js configuration
│   ├── tsconfig.json          # TypeScript configuration (with @shared paths)
│   └── package.json
│
├── backend/                   # NestJS backend application
│   ├── src/
│   │   ├── core/              # Core modules (Global configuration, database, logging)
│   │   │   ├── config/        # ConfigModule with environment validation
│   │   │   ├── database/      # PrismaModule and PrismaService
│   │   │   ├── logger/        # Custom LoggerModule and LoggerService
│   │   │   ├── filters/       # Global exception filters (HttpExceptionFilter)
│   │   │   └── validation/    # Custom request validations (ZodValidationPipe)
│   │   ├── modules/           # Domain feature modules
│   │   │   └── health/        # HealthCheck endpoint feature
│   │   ├── app.module.ts      # Root NestJS module
│   │   └── main.ts            # Application entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema definition
│   ├── test/                  # E2E test suite configurations
│   ├── nest-cli.json          # NestJS CLI configuration
│   ├── tsconfig.json          # TypeScript configuration (with @shared paths)
│   └── package.json
│
├── shared/                    # Shared workspace package (natively linked)
│   ├── constants/             # Shared constants index
│   ├── types/                 # Shared TypeScript interfaces index
│   ├── index.ts               # Main package entrypoint
│   ├── package.json           # Shared workspace configuration
│   └── tsconfig.json          # Shared workspace typescript setup
│
├── docs/                      # Technical Documentation
│   ├── ARCHITECTURE.md
│   └── CONTRIBUTING.md
│
├── docker-compose.yml         # Container orchestration configuration
├── .editorconfig              # Editor configurations
├── .prettierrc                # Prettier configuration
├── .prettierignore            # Prettier ignore patterns
├── .gitignore                 # Git ignore file list
└── README.md                  # Project root README
```

---

## ✅ Prerequisites

Make sure you have the following installed:

- **Node.js** >= 20.x — [Download](https://nodejs.org/)
- **npm** >= 10.x (comes with Node.js)
- **PostgreSQL** >= 16 — [Download](https://www.postgresql.org/download/)
- **Git** — [Download](https://git-scm.com/)
- **Docker** (optional) — [Download](https://www.docker.com/)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Comecs Web app"
```

### 2. Set up the database

Create a PostgreSQL database:

```sql
CREATE DATABASE csms_dev;
```

### 3. Install all dependencies

Install dependencies for the entire monorepo (frontend, backend, shared) at once from the root directory:

```bash
npm install
```

### 4. Configure environment variables

The `.env.example` files are provided for both projects. For the backend, the local `.env` is already configured. For the frontend:

```bash
# Windows
copy frontend\.env.example frontend\.env.local

# Linux/macOS
cp frontend/.env.example frontend/.env.local
```

### 5. Generate Prisma client

Run the Prisma client generator from the root:

```bash
npx prisma generate --schema=backend/prisma/schema.prisma
```

### 6. Start development servers

You can run individual workspaces directly from the project root:

**Start Frontend** (runs on `http://localhost:3000`):
```bash
npm run dev:frontend
```

**Start Backend** (runs on `http://localhost:3001`):
```bash
npm run dev:backend
```

### 7. Verify

- **Frontend:** Open [http://localhost:3000](http://localhost:3000)
- **Backend Health Check:** Open [http://localhost:3001/health](http://localhost:3001/health)
- **Backend API Prefix:** [http://localhost:3001/api](http://localhost:3001/api)

---

## 📜 Available Scripts

### Project Root (Monorepo level)

| Command | Description |
| ------- | ----------- |
| `npm run dev:frontend` | Run the Next.js frontend development server |
| `npm run dev:backend` | Run the NestJS backend development server |
| `npm run build:frontend`| Compile the Next.js frontend for production |
| `npm run build:backend` | Compile the NestJS backend for production |
| `npm run build:shared`  | Compile the shared workspace code |
| `npm run lint`          | Run ESLint verification on all projects |
| `npm run type-check`    | Run TypeScript compilation checks on all projects |
| `npm run format`        | Reformat code style across all folders with Prettier |
| `npm run prisma:generate`| Generate database client types from the root |
| `npm run prisma:migrate` | Run database migrations from the root |
| `npm run prisma:studio`  | Open the Prisma Studio admin interface |

### Frontend (`cd frontend`)

| Command               | Description                    |
| --------------------- | ------------------------------ |
| `npm run dev`         | Start dev server (port 3000)   |
| `npm run build`       | Production build               |
| `npm run start`       | Start production server        |
| `npm run lint`        | Run ESLint                     |
| `npm run lint:fix`    | Run ESLint with auto-fix       |
| `npm run format`      | Format code with Prettier      |
| `npm run format:check`| Check formatting               |
| `npm run type-check`  | Run TypeScript type checking   |

### Backend (`cd backend`)

| Command                    | Description                         |
| -------------------------- | ----------------------------------- |
| `npm run dev`              | Start dev server with watch (3001)  |
| `npm run build`            | Production build                    |
| `npm run start:prod`       | Start production server             |
| `npm run lint`             | Run ESLint                          |
| `npm run lint:fix`         | Run ESLint with auto-fix            |
| `npm run format`           | Format code with Prettier           |
| `npm run test`             | Run unit tests                      |
| `npm run test:e2e`         | Run E2E tests                       |
| `npm run prisma:generate`  | Generate Prisma client              |
| `npm run prisma:migrate`   | Run database migrations             |
| `npm run prisma:studio`    | Open Prisma Studio GUI              |

---

## 🔐 Environment Variables

### Frontend (`.env.local`)

| Variable                  | Description       | Default                     |
| ------------------------- | ----------------- | --------------------------- |
| `NEXT_PUBLIC_APP_NAME`    | Application name  | COMECS Society Management…  |
| `NEXT_PUBLIC_APP_VERSION` | App version       | 1.0.0                       |
| `NEXT_PUBLIC_API_URL`     | Backend API URL   | http://localhost:3001/api   |

### Backend (`.env`)

| Variable         | Description             | Default                          |
| ---------------- | ----------------------- | -------------------------------- |
| `APP_NAME`       | Application name        | COMECS Society Management…       |
| `APP_PORT`       | Server port             | 3001                             |
| `APP_ENV`        | Environment             | development                      |
| `DATABASE_URL`   | PostgreSQL connection   | postgresql://postgres:…          |
| `CORS_ORIGIN`    | Allowed CORS origin     | http://localhost:3000            |
| `LOG_LEVEL`      | Logging level           | debug                            |

---

## 🐳 Docker

### Quick start with Docker Compose

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** on port `5432`
- **Backend API** on port `3001`
- **Frontend** on port `3000`

### Individual services

```bash
# Database only (useful for local development)
docker-compose up -d db

# Rebuild and start everything
docker-compose up -d --build
```

---

## 🏗 Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture overview.

---

## 🤝 Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is **UNLICENSED** — proprietary to COMECS Society.

---

<p align="center">
  Built with ❤️ by the COMECS Society
</p>

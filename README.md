# Forum Discussion API

A simple REST API for forum discussion features built with **Clean Architecture**, **TypeScript**, and **Express.js** using **PostgreSQL** as the database.

---

## Table of Contents

- [Forum Discussion API](#forum-discussion-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
    - [Layer Breakdown](#layer-breakdown)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Migrations](#database-migrations)
  - [Running the Application](#running-the-application)
  - [Testing](#testing)
  - [API Endpoints](#api-endpoints)
    - [Users](#users)
    - [Authentications](#authentications)
    - [Threads](#threads)
    - [Comments](#comments)

---

## Features

- User registration and management
- JWT-based authentication (access token & refresh token)
- Create and view discussion thread details
- Create and delete comments on threads

---

## Tech Stack

| Category         | Technology                    |
| ---------------- | ----------------------------- |
| Language         | TypeScript 5.x                |
| Runtime          | Node.js (ES Modules)          |
| Web Framework    | Express 5.x                   |
| Database         | PostgreSQL                    |
| DB Driver        | node-postgres (pg)            |
| Migrations       | node-pg-migrate               |
| Password Hashing | bcrypt                        |
| Token            | JSON Web Token (jsonwebtoken) |
| ID Generator     | uuid                          |
| DI Container     | instances-container           |
| Test Runner      | Vitest                        |
| HTTP Testing     | Supertest                     |
| Linter           | ESLint + TypeScript ESLint    |
| Formatter        | Prettier                      |

---

## Architecture

This project follows the **Clean Architecture** principle by separating code into four main layers, where dependencies only point inward (toward the core layer).

```
┌─────────────────────────────────────┐
│          Interfaces Layer           │  HTTP handlers, routes, middlewares
├─────────────────────────────────────┤
│        Infrastructures Layer        │  DB repositories, security impl., DI container
├─────────────────────────────────────┤
│         Applications Layer          │  Use cases, DTOs, responses, security contracts
├─────────────────────────────────────┤
│           Domains Layer             │  Entities, value objects, repo interfaces, services
└─────────────────────────────────────┘
```

### Layer Breakdown

| Layer               | Directory              | Responsibility                                                              |
| ------------------- | ---------------------- | --------------------------------------------------------------------------- |
| **Domains**         | `src/domains/`         | Pure business core: entities, value objects, repository contracts, services |
| **Applications**    | `src/applications/`    | Use case orchestration, DTOs, response models, security contracts           |
| **Infrastructures** | `src/infrastructures/` | Concrete implementations: PostgreSQL, bcrypt, JWT, DI container             |
| **Interfaces**      | `src/interfaces/`      | HTTP route handlers and Express middlewares                                 |
| **Commons**         | `src/commons/`         | Shared utilities: configuration, exception classes, constants               |

---

## Project Structure

```
forum-discussion-api/
├── migrations/                         # Database migration files
├── src/
│   ├── app.ts                          # Application entry point
│   ├── applications/
│   │   ├── dtos/                       # Data Transfer Objects (use case input)
│   │   ├── responses/                  # Response contracts (use case output)
│   │   ├── security/                   # Interface: PasswordHash, TokenManager
│   │   └── use-cases/
│   │       ├── users/                  # CreateUserUseCase
│   │       ├── authentications/        # Login, Logout, Refresh, Delete
│   │       ├── threads/                # CreateThread, GetDetailThread
│   │       └── comments/              # CreateComment, DeleteComment
│   ├── commons/
│   │   ├── config.ts                   # Configuration from environment variables
│   │   ├── constants/                  # Domain error codes, DI tokens, status
│   │   └── exceptions/                 # Custom exception classes
│   ├── domains/
│   │   ├── entities/                   # User, Thread, Comment, Authentication
│   │   ├── repositories/               # Repository interfaces (contracts)
│   │   ├── services/                   # Domain services
│   │   └── value-objects/              # UserId, Username, ThreadTitle, etc.
│   ├── infrastructures/
│   │   ├── container/                  # DI container setup (service + use case)
│   │   ├── database/                   # PostgreSQL pool wrapper
│   │   ├── repositories/               # Repository implementations (PostgreSQL)
│   │   └── security/                   # BcryptPasswordHash, JwtTokenManager
│   └── interfaces/
│       └── http/
│           ├── api/                    # Route handlers per feature
│           └── middlewares/            # Authentication middleware
└── tests/                              # Test helpers (table fixtures)
```

---

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 13
- npm

---

## Installation

```bash
git clone https://github.com/dianerdiana/forum-discussion-api.git
cd forum-discussion-api
npm install
```

---

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Application
HOST=localhost
PORT=5000
DEBUG=false

# Database
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=forum_discussion

# Auth
JWT_STRATEGY=RS256
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret
ACCESS_TOKEN_AGE=3600
```

For testing purposes, create a `.test.env` file with a separate test database configuration.

---

## Database Migrations

```bash
# Run migrations (production / development)
npm run migrate

# Run migrations (test database)
npm run migrate:test
```

---

## Running the Application

```bash
# Development (using tsx)
npm run dev

# Production (after build)
npm run build
npm start
```

---

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

The project includes:

- **Unit tests** for domain entities, value objects, use cases, and repository implementations
- **Integration tests** for HTTP endpoints using Supertest
- **Test helpers** in `tests/` for setup and teardown of test database data

---

## API Endpoints

### Users

| Method | Endpoint | Description         |
| ------ | -------- | ------------------- |
| `POST` | `/users` | Register a new user |

### Authentications

| Method   | Endpoint           | Description                            |
| -------- | ------------------ | -------------------------------------- |
| `POST`   | `/authentications` | Login (returns access & refresh token) |
| `PUT`    | `/authentications` | Refresh access token                   |
| `DELETE` | `/authentications` | Logout (delete refresh token)          |

### Threads

| Method | Endpoint             | Description                                     |
| ------ | -------------------- | ----------------------------------------------- |
| `POST` | `/threads`           | Create a new thread _(requires authentication)_ |
| `GET`  | `/threads/:threadId` | Get thread detail with comments                 |

### Comments

| Method   | Endpoint                                 | Description                                              |
| -------- | ---------------------------------------- | -------------------------------------------------------- |
| `POST`   | `/threads/:threadId/comments`            | Add a comment to a thread _(requires authentication)_    |
| `DELETE` | `/threads/:threadId/comments/:commentId` | Delete a comment _(requires authentication, owner only)_ |

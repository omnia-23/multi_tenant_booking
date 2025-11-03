Absolutely ✅ — here’s a **professional, production-ready README.md** for your NestJS booking system project, including setup steps, environment variables, and Docker instructions for PostgreSQL and pgAdmin.

---

## 🏠 Booking System API (NestJS + PostgreSQL + Drizzle ORM)

This project is a **dynamic space booking system** built using **NestJS**, **Drizzle ORM**, and **PostgreSQL**, allowing tenants to define weekly space availability, and users to book available slots while preventing overlapping or double-booking.

---

## Postman Link

https://documenter.getpostman.com/view/25685476/2sB3WpSgrk

---

## 🚀 Features

- 🔐 JWT-based Authentication (optional extension)
- 🧭 Dynamic availability by weekday and time
- 🕒 Conflict-free booking validation
- ⚙️ Drizzle ORM for type-safe database operations
- 🐳 Dockerized PostgreSQL + pgAdmin for easy setup
- 🧩 Configurable slot length and tenant timezone support

---

## 🧱 Tech Stack

| Layer            | Technology                               |
| ---------------- | ---------------------------------------- |
| Backend          | [NestJS](https://nestjs.com/)            |
| ORM              | [Drizzle ORM](https://orm.drizzle.team/) |
| Database         | PostgreSQL                               |
| Containerization | Docker & Docker Compose                  |
| Validation       | class-validator & class-transformer      |
| Language         | TypeScript                               |

---

## 🗂️ Project Structure

```
src/
 ├── booking/
 │    ├── booking.service.ts
 │    ├── booking.controller.ts
 │    └── dto/
 ├── space/
 │    ├── space.service.ts
 │    ├── space.schema.ts
 ├── tenant/
 │    ├── tenant.module.ts
 ├── database/
 │    ├── schema.ts
 │    ├── drizzle.config.ts
 │    └── migrations/
 ├── main.ts
 └── app.module.ts
```

---

## ⚙️ Prerequisites

Before running the project, make sure you have:

- **Node.js** (>= 18)
- **Docker** & **Docker Compose**

### ▶️ Start Containers

```bash
docker-compose up -d
```

Access:

- PostgreSQL → `localhost:5432`
- pgAdmin → [http://localhost:5050](http://localhost:5050)

---

---

## 🧑‍💻 Installation & Setup

### 1️⃣ Install dependencies

```bash
bun install
# or
npm install
```

### 2️⃣ Generate Drizzle migrations

```bash
bun run drizzle:generate
# or
npm run drizzle:generate
```

### 3️⃣ Run migrations

```bash
bun run drizzle:migrate
# or
npm run drizzle:migrate
```

### 4️⃣ Start the NestJS app

```bash
bun run start:dev
# or
npm run start:dev
```

App will run at:

> [http://localhost:4000](http://localhost:4000)

---

## 🧩 Common Commands

| Task                    | Command                   |
| ----------------------- | ------------------------- |
| Build Docker containers | `docker-compose build`    |
| Start DB & pgAdmin      | `docker-compose up -d`    |
| Stop containers         | `docker-compose down`     |
| Reset database          | `docker-compose down -v`  |
| Run NestJS dev server   | `bun run start:dev`       |
| Run migrations          | `bun run drizzle:migrate` |

---

## 🧭 API Modules

| Module      | Description                                       |
| ----------- | ------------------------------------------------- |
| **Space**   | Define available working hours (recurring weekly) |
| **Booking** | Create and manage user bookings                   |
| **Tenant**  | Define tenant settings (e.g. timezone)            |
| **User**    | Represents user accounts                          |

---

## 🔐 Validation Rules

- A booking cannot overlap another booking for the same space.
- A user cannot double-book overlapping time slots.
- Requested time must be within defined space availability.

---

## 🧰 Future Improvements

- ✅ Configurable slot duration per space/tenant
- 🕓 Support for multi-timezone tenants
- 💳 Payment integration for bookings
- 🧾 Admin dashboard for managing tenants and spaces

---

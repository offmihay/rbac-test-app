# 🚀 RBAC Cards Project Setup (Frontend + Backend + PostgreSQL)

This project includes a backend (NestJS), a frontend (Vite + React), and a PostgreSQL database. Below are the steps to set it up locally.

---

## 📆 1. Install Dependencies

Install root-level dependencies (e.g. ESLint, Prettier), then install dependencies for frontend and backend:

```bash
pnpm install
pnpm --filter frontend install
pnpm --filter backend install
```

> Make sure you have [pnpm](https://pnpm.io) installed globally.

---

## 🐘 2. Start the Database with Docker

In the project root, run:

```bash
docker compose up -d
```

This will start a PostgreSQL container on port `5432`.

---

## 🔐 3. Create `.env` Files

Create the following environment variable files:

### 📁 `backend/.env`

Required keys:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin123@test.com
ADMIN_PASSWORD=12345678   # must be at least 8 characters
```

### 📁 `frontend/.env`

Required keys:

```
VITE_API_URL=http://localhost:3000
```

---

## 💠 4. Run Database Migrations

From the `backend` folder, run:

```bash
pnpm run migration:run
```

---

## ▶️ 5. Start the Applications

### Backend

From the `backend` folder, run:

```bash
pnpm start:dev
```

### Frontend

From the `frontend` folder, run:

```bash
pnpm run dev
```

---

## 🌐 Access

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000](http://localhost:3000) (by default 3000 port)
- **PostgreSQL:** `localhost:5432` (username/password: `postgres`/`postgres` by default)

---

## 📚 API Documentation

### Swagger UI

After starting the backend, open:

- [http://localhost:3000/api](http://localhost:3000/api)

### Postman Collection

You can import the OpenAPI schema into Postman from:

- [http://localhost:3000/api-json](http://localhost:3000/api-json)

In Postman:

1. Click **"Import"**
2. Choose **"Link"** or **"Raw text"**
3. Paste the URL above
4. Confirm the import

---

## 📝 Notes

- `ADMIN_PASSWORD` must be at least **8 characters** or the admin creation migration may fail silently.
- Don't forget to run migrations after spinning up the DB.

---

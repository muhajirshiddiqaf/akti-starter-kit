# AKTI Starter Kit

Starter kit full-stack: **Backend Express.js** (API + SQLite) dan **Frontend** (TailAdmin template) dengan fitur **login & register** terintegrasi.

## Tech Stack

- **Backend:** Express 5, SQLite (better-sqlite3), JWT, bcryptjs, Zod
- **Frontend:** TailAdmin (Tailwind, Alpine.js, Webpack)
- **Dev:** Nodemon (auto-restart backend), Concurrently (jalankan FE + BE sekaligus)

## Fitur

- **API Auth:** `POST /api/v1/auth/register`, `POST /api/v1/auth/login`
- **Login & Register** di frontend (signin.html, signup.html) terhubung ke API
- **Token JWT** disimpan di `localStorage` setelah login sukses
- **Database SQLite** di `data/app.db` (tabel `users`)

## Prerequisites

- Node.js (v18+)
- npm atau pnpm

## Setup

```bash
# Install dependency root (backend)
npm install

# Install dependency frontend
cd frontend && npm install && cd ..
```

## Environment

Salin `.env.sample` ke `.env` dan sesuaikan (opsional):

```bash
cp .env.sample .env
```

Contoh `.env`:

```
NODE_ENV=development
PORT=3000
JWT_SECRET=rahasia-minimal-16-karakter
```

## Scripts

| Perintah | Keterangan |
|----------|------------|
| `npm start` | Jalankan **backend** (port 3000) + **frontend** (port 5173) sekaligus; auto refresh saat ada perubahan |
| `npm run start:backend` | Hanya backend dengan Nodemon (restart otomatis) |
| `npm run start:frontend` | Hanya frontend (Webpack dev server, hot reload) |
| `npm run build:frontend` | Build frontend ke `frontend/build` (untuk production) |
| `npm run dev` | Hanya backend (tanpa Nodemon, pakai `node --watch`) |
| `npm run lint` | Jalankan ESLint |
| `npm test` | Jalankan Vitest |

## Development (FE + BE sekaligus)

```bash
npm start
```

- **Backend:** http://localhost:3000 (Nodemon: restart saat file di `src/` berubah)
- **Frontend:** http://localhost:5173 (Webpack: hot reload)
- Login/register di frontend memanggil API di port 3000 (CORS sudah diizinkan)

Setelah development, buka http://localhost:5173 → **signin.html** atau **signup.html**.

## Production

```bash
npm run build:frontend
PORT=3000 node --env-file=.env src/index.js
```

Backend akan melayani API (`/api/v1`) dan file static dari `frontend/build`. Atur `PORT` dan `JWT_SECRET` di environment.

## API

### Auth

- **POST** `/api/v1/auth/register`  
  Body: `{ "email", "password", "name?" }`  
  Response: `{ "message", "user", "token" }`

- **POST** `/api/v1/auth/login`  
  Body: `{ "email", "password" }`  
  Response: `{ "message", "user", "token" }`

- **GET** `/api/v1/me`  
  Header: `Authorization: Bearer <token>`  
  Response: `{ "user": { "userId", "email" } }`

## Repository

[https://github.com/muhajirshiddiqaf/akti-starter-kit](https://github.com/muhajirshiddiqaf/akti-starter-kit)

## License

MIT

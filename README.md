# ShowTime — Movie Ticket Booking (BookMyShow-style clone)

A full-stack recreation of a movie ticket booking site: landing page, sign up,
log in, and a dashboard where logged-in users can book and cancel tickets.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** SQLite locally, PostgreSQL in production (same code, one env var)
- **Auth:** JWT access tokens, passwords hashed with bcrypt (via passlib)
- **Extra feature beyond auth:** full booking CRUD — create a booking, view
  your bookings, cancel (delete) a booking, all persisted server-side per user.

```
project/
├── backend/     FastAPI app (auth, movies, bookings)
└── frontend/    React app (Landing, SignUp, Login, Dashboard)
```

## 1. Run locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # defaults are fine for local dev
uvicorn app.main:app --reload   # runs on http://localhost:8000
```

The first request creates `app.db` (SQLite) and seeds 6 demo movies
automatically. Interactive API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
cp .env.example .env            # VITE_API_URL=http://localhost:8000
npm run dev                     # runs on http://localhost:5173
```

Open http://localhost:5173, sign up, log in, and book a few tickets.

## 2. How auth works

1. `POST /auth/signup` hashes the password with bcrypt and stores the user
   in the database, then returns a JWT.
2. `POST /auth/login` verifies the password hash and returns a JWT.
3. The frontend stores the JWT in `localStorage` and sends it as
   `Authorization: Bearer <token>` on every request to `/auth/me`,
   `/bookings`, etc.
4. Protected backend routes use a FastAPI dependency
   (`get_current_user` in `app/auth.py`) that decodes and validates the JWT.

No plaintext passwords are ever stored or logged.

## 3. Deploying

### Database — PostgreSQL

Create a free Postgres instance on Render, Railway, Neon, or Supabase.
Copy the connection string — you'll need it as `DATABASE_URL` below.

### Backend — Render (or Railway)

1. Push this repo to GitHub.
2. On Render: **New → Web Service**, connect the repo, set root directory
   to `backend`.
3. Build command: `pip install -r requirements.txt`
   Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   (or just use the included `Procfile`).
4. Set environment variables:
   - `DATABASE_URL` → your Postgres connection string
   - `SECRET_KEY` → a long random string (`openssl rand -hex 32`)
   - `ALLOWED_ORIGINS` → your deployed frontend URL, e.g.
     `https://showtime.vercel.app`
5. Deploy. Tables are created automatically on startup
   (`Base.metadata.create_all`).

### Frontend — Vercel

1. On Vercel: **New Project**, import the repo, set root directory to
   `frontend`.
2. Framework preset: Vite. Build command `npm run build`, output `dist`.
3. Environment variable: `VITE_API_URL` → your Render backend URL, e.g.
   `https://showtime-api.onrender.com`
4. Deploy.

Once both are live, update `ALLOWED_ORIGINS` on the backend to match the
final Vercel URL and redeploy the backend so CORS allows it.

## 4. Notes / what to customize

- Movie data is seeded in `backend/app/seed.py` — replace with your own list.
- Colors/typography live in `frontend/tailwind.config.js`.
- No real payment is processed — this is a learning project, not a real
  ticketing service.

# NeighbourQuest

NeighbourQuest is a local jobs marketplace that connects **employers** who need work done with **workers** who can do it. Employers post jobs, workers apply, employers accept/reject applicants, and once work is complete both sides can leave a review/rating for each other.

- **Frontend:** React 19 + Vite, deployed on **Vercel**
- **Backend:** Flask + SQLAlchemy REST API, deployed on **Render**
- **Database:** PostgreSQL in production (SQLite for local dev)
- **Auth:** JWT (`flask-jwt-extended`)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Known Issues](#known-issues)

---

## Features

- User registration/login as **worker**, **employer**, or **both**
- Role-based profiles: `WorkerProfile` (skills, bio, hourly rate, availability) and `EmployerProfile` (business name, location)
- Employers can post, list, and update the status of jobs
- Workers can browse jobs, apply to them, and track their applications
- Employers can view and manage applicants for their jobs, accepting or rejecting them
- Users can leave ratings/reviews for one another after a job, and view a user's review history
- JWT-based authentication with role information embedded in the token

## Tech Stack

**Frontend** (`/client`)
- React 19, React Router 7
- Vite 8 (build tool/dev server)
- Axios for API calls
- Plain CSS per page/component (no CSS framework)

**Backend** (`/server`)
- Flask 3
- Flask-SQLAlchemy (ORM) + Flask-Migrate (Alembic migrations)
- Flask-Marshmallow (serialization)
- Flask-JWT-Extended (auth)
- Flask-CORS
- Gunicorn (production WSGI server)
- PostgreSQL via `psycopg2-binary` (SQLite fallback for local dev)

## Project Structure

```
neighbourQuest-master/
├── client/                     # React frontend (Vercel)
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js          # Axios instance + all API call functions
│   │   │   └── mockData.js     # Sample data (used only if mocking is re-enabled)
│   │   ├── components/         # JobCard, WorkerCard, ReviewCard, Rating, Navbar
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state, login/register/logout, localStorage persistence
│   │   ├── css/                # Per-page/component stylesheets
│   │   ├── pages/               # HomePage, LoginPage, RegisterPage, JobListPage,
│   │   │                        # JobDetailPage, PostJobPage, WorkerListPage,
│   │   │                        # ProfilePage, DashboardPage
│   │   └── App.jsx             # Routes
│   └── vercel.json             # SPA rewrite rule for Vercel
│
└── server/                     # Flask backend (Render)
    ├── app.py                  # All route definitions
    ├── extensions.py           # db, ma, jwt singletons
    ├── models/                 # SQLAlchemy models
    │   ├── user.py
    │   ├── worker_profile.py
    │   ├── employer_profile.py
    │   ├── job.py
    │   ├── application.py
    │   └── review.py
    ├── controllers/            # Business logic, called from routes in app.py
    │   ├── auth_controller.py
    │   ├── job_controller.py
    │   ├── worker_controller.py
    │   ├── application_controller.py
    │   ├── review_controller.py
    │   └── user_controller.py
    ├── schemas/                 # Marshmallow schemas for serialization
    ├── seed.py                 # Drops & recreates tables, seeds sample data
    ├── requirements.txt
    └── Procfile                 # `web: gunicorn app:app` (Render start command)
```

## Data Model

```
User (1) ── (1) WorkerProfile   ── (many) Application ── (many) Job
User (1) ── (1) EmployerProfile ── (many) Job
Job  (1) ── (many) Review
User (1) ── (many) Review [as reviewer]
User (1) ── (many) Review [as reviewee]
```

| Model | Key Fields | Notes |
|---|---|---|
| `User` | name, email (unique), phone, password_hash, role | `role` is `worker`, `employer`, or `both`. Password hashing via Werkzeug. |
| `WorkerProfile` | user_id (FK), skill_category, bio, hourly_rate, location, available | One-to-one with `User`. |
| `EmployerProfile` | user_id (FK), business_name, location | One-to-one with `User`. |
| `Job` | employer_id (FK), title, description, category, budget, location, deadline, status | `status` defaults to `open`. Cascade deletes applications/reviews with the job. |
| `Application` | job_id (FK), worker_id (FK), status, applied_at | Unique constraint on `(job_id, worker_id)` — a worker can only apply once per job. `status` defaults to `applied`. |
| `Review` | job_id (FK), reviewer_id (FK → User), reviewee_id (FK → User), rating, comment | `rating` is an integer 1–5. |

## API Reference

Base URL (local): `http://localhost:5000`

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | – | Register a new user. Creates a `WorkerProfile` and/or `EmployerProfile` depending on `role`. |
| POST | `/auth/login` | – | Returns `{ token, user }` on success. |

### Jobs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/jobs` | – | List all jobs. |
| GET | `/jobs/<job_id>` | – | Get a single job. |
| POST | `/jobs` | ✅ | Create a job (caller must have an `EmployerProfile`). |
| GET | `/jobs/employer/<user_id>` | ✅ | Jobs posted by a given employer (looked up by `user_id`). |
| PATCH | `/jobs/<job_id>/status` | ✅ | Update a job's status (e.g. `open`, `closed`, `completed`). |
| POST | `/jobs/<job_id>/apply` | ✅ | Worker applies to a job. **⚠️ Currently not registered — see [Known Issues](#known-issues).** |

### Applications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/jobs/<job_id>/applications` | ✅ | All applications for a job (for the employer to review). |
| GET | `/applications/me` | ✅ | The current worker's own applications. |
| PATCH | `/applications/<application_id>` | ✅ | Update an application's status (accept/reject). |

### Workers
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/workers` | – | List all worker profiles. |
| GET | `/workers/<worker_id>` | – | Get a single worker profile. |

### Profiles
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users/<user_id>` | – | Get a user's profile (employer or worker profile, depending on role). |
| PUT | `/users/<user_id>` | ✅ | Update a user's profile. |

### Reviews
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/reviews` | ✅ | Submit a review (`jobId`, `revieweeId`, `rating`, `comment`). |
| GET | `/reviews/user/<user_id>` | – | All reviews received by a user. |

`✅` routes require an `Authorization: Bearer <token>` header. The JWT identity is the user's `id`; the token also carries `name`, `email`, and `role` as additional claims.

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- (Optional) PostgreSQL — SQLite is used automatically if `DATABASE_URL` isn't set

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Environment variables (see below) — a .env file or exported vars
export JWT_SECRET_KEY=some-dev-secret

python app.py                   # runs on http://localhost:5000
```

To reset the database with sample data:

```bash
python seed.py
```

### Frontend

```bash
cd client
npm install

# Point the frontend at your local backend
echo "VITE_API_URL=http://localhost:5000" > .env

npm run dev                     # runs on http://localhost:5173
```

## Environment Variables

### Backend (`server`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | No | `sqlite:///neighborquest.db` | Postgres connection string in production. `postgres://` prefixes are auto-rewritten to `postgresql://` for SQLAlchemy compatibility. |
| `JWT_SECRET_KEY` | Recommended | hardcoded fallback | **Must** be set to a strong secret in production — do not rely on the default. |

### Frontend (`client`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Recommended | `http://localhost:5000` | Base URL of the backend API. Set this to your Render backend URL in Vercel's project settings. |

## Deployment

### Backend → Render
- Start command comes from the `Procfile`: `gunicorn app:app`
- Set `DATABASE_URL` (Render Postgres add-on provides this automatically) and `JWT_SECRET_KEY` in Render's environment settings
- On boot, `app.py` calls `db.create_all()` inside an app context, so tables are created automatically if they don't exist; `Flask-Migrate` is available for schema migrations beyond that

### Frontend → Vercel
- `vercel.json` rewrites all paths to `index.html` so React Router's client-side routing works on refresh/direct links
- Set `VITE_API_URL` in Vercel's project environment variables to point at the deployed Render backend
- CORS on the backend is configured to allow `http://localhost:5173` and any `https://neighbour-quest*.vercel.app` origin (covers Vercel preview deployments) — update the regex in `app.py` if your Vercel project name differs

## Known Issues

- **`POST /jobs/<job_id>/apply` is not actually registered as a route.** In `app.py`, the route decorator is missing its `@`:
  ```python
  app.route("/jobs/<int:job_id>/apply", methods=["POST"])   # should be @app.route(...)
  @jwt_required()
  def apply_to_job(job_id):
      ...
  ```
  As written, this calls `app.route(...)` as a plain function (which does nothing useful) rather than using it as a decorator, so the endpoint returns 404. The frontend already calls this endpoint (`applyToJob` in `api/api.js`, used in `JobDetailPage.jsx`), so applying to jobs currently fails end-to-end. Fix: add `@` before `app.route`.
- `/auth/login` returns HTTP 200 (not 401) with an error message body on invalid credentials.
- `JWT_SECRET_KEY` has a hardcoded fallback value in `app.py` — make sure it's overridden via environment variable in any real deployment.
- `client/src/api/api.js` contains a large commented-out mock-data version of the API layer; safe to delete once no longer needed for reference.
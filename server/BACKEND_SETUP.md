# SmartEdu LMS — Django Backend Setup Guide

## Quick Start

```bash
# 1. Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your DB credentials

# 4. Run migrations
python manage.py makemigrations users students courses timetable tests_marks materials fees enquiries todos activities certificates
python manage.py migrate

# 5. Create admin superuser
python manage.py createsuperuser

# 6. Start dev server
python manage.py runserver
```

---

## Project Structure

```
server/
├── smartedu/
│   ├── __init__.py
│   ├── settings.py       ← PostgreSQL, JWT, CORS, all apps
│   ├── urls.py           ← Root URL config + JWT endpoints
│   ├── wsgi.py
│   └── asgi.py
│
├── api/
│   ├── __init__.py
│   ├── apps.py
│   ├── urls.py           ← Master API router
│   │
│   ├── users/            ← Custom Tutor auth model + JWT
│   ├── students/         ← Student CRUD
│   ├── courses/          ← Course CRUD + student enrollment
│   ├── timetable/        ← Weekly schedule slots
│   ├── tests_marks/      ← Tests + per-student marks
│   ├── materials/        ← Study material uploads
│   ├── fees/             ← Payment tracking
│   ├── enquiries/        ← CRM leads pipeline
│   ├── todos/            ← Task manager
│   ├── activities/       ← Events & calendar
│   ├── certificates/     ← Auto-numbered certificates
│   └── analytics/        ← Aggregate stats (no models)
│
├── manage.py
├── requirements.txt
└── .env.example
```

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login → returns `access` + `refresh` + `user` |
| POST | `/api/auth/refresh/` | Refresh access token |
| POST | `/api/auth/verify/` | Verify token validity |
| POST | `/api/users/register/` | Register new tutor |
| GET/PATCH | `/api/users/me/` | Get or update own profile |
| POST | `/api/users/change-password/` | Change password |

**Login request:**
```json
POST /api/auth/login/
{ "email": "tutor@example.com", "password": "yourpassword" }
```
**Login response:**
```json
{ "access": "eyJ...", "refresh": "eyJ...", "user": { "id": 1, "name": "...", "email": "..." } }
```
**All subsequent requests need header:**
```
Authorization: Bearer <access_token>
```

---

### Students `/api/students/`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students/` | List all students (supports `?status=Active&search=John`) |
| POST | `/api/students/` | Create student |
| GET | `/api/students/{id}/` | Get student detail |
| PATCH | `/api/students/{id}/` | Update student |
| DELETE | `/api/students/{id}/` | Delete student |

**Filters:** `status`, `grade`, `subject`
**Search:** `name`, `email`, `phone`, `grade`

---

### Courses `/api/courses/`
Full CRUD. Filters: `status`, `level`, `subject`. Students are assigned via the `students` array (list of student IDs).

---

### Timetable `/api/timetable/`
Full CRUD. Filters: `day`, `class_type`, `is_active`.

---

### Tests & Marks `/api/tests/`
| Endpoint | Description |
|----------|-------------|
| `/api/tests/` | Test CRUD |
| `/api/tests/marks/` | Mark CRUD (auto-calculates `percentage`) |
| `/api/tests/marks/?test=5&student=2` | Filter marks by test or student |

---

### Materials `/api/materials/`
Full CRUD. Supports file upload via `multipart/form-data`. Filters: `file_type`, `subject`, `course`.

---

### Fees `/api/fees/`
Full CRUD. Filters: `status`, `method`, `student`, `course`.

---

### Enquiries `/api/enquiries/`
Full CRUD. Filters: `stage`, `source`, `subject`.

---

### Todos `/api/todos/`
Full CRUD. Filters: `priority`, `completed`.

---

### Activities `/api/activities/`
Full CRUD. Special filter: `?month=3&year=2026` for calendar view.

---

### Certificates `/api/certificates/`
Full CRUD. `cert_number` is auto-generated (e.g. `CERT-A3F7B2C1`). Filters: `cert_type`, `student`, `course`.

---

### Analytics (read-only)
| Endpoint | Description |
|----------|-------------|
| GET `/api/analytics/dashboard/` | KPI stats: students, courses, revenue, todos |
| GET `/api/analytics/performance/` | Avg score, at-risk count, score distribution |
| GET `/api/analytics/revenue/` | Fee summary by status + payment method breakdown |
| GET `/api/analytics/enquiries/` | CRM funnel by stage + source |

---

## Admin Panel

Visit `http://localhost:8000/admin/` after running the server.

All models are registered with:
- List views with filters and search
- Inline editing (e.g. marks inside test, students inside course)
- Date hierarchy navigation

---

## Connecting to Next.js Frontend

Replace `localStorage` reads in your frontend with API calls:

```ts
// Example: fetch students
const res = await fetch("http://localhost:8000/api/students/", {
  headers: { Authorization: `Bearer ${accessToken}` }
});
const data = await res.json();

// Example: login
const res = await fetch("http://localhost:8000/api/auth/login/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const { access, refresh, user } = await res.json();
localStorage.setItem("tutorAuth", "true");
localStorage.setItem("tutorName", user.name);
localStorage.setItem("accessToken", access);
```

---

## Deployment Notes (Production)

1. Set `DEBUG=False` in `.env`
2. Set a strong `DJANGO_SECRET_KEY`
3. Run `python manage.py collectstatic`
4. Use **gunicorn**: `gunicorn smartedu.wsgi:application --bind 0.0.0.0:8000`
5. Set up **Nginx** as reverse proxy
6. Use a managed PostgreSQL instance (e.g. Supabase, Neon, RDS)

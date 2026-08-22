# GlobeTrotter — Backend API (FastAPI + PostgreSQL + PostGIS)

Travel Intelligence and Experience Platform for India.

## Tech Stack
- **Framework:** FastAPI (Python 3.10+)
- **Database:** PostgreSQL with PostGIS extension for spatial queries & asyncpg
- **ORM:** SQLAlchemy 2.0 (Async)
- **Auth:** JWT (Access & Refresh tokens) + Passlib (bcrypt) + Google OAuth support
- **Cache & Message Broker:** Redis
- **Storage:** Cloudinary / S3-compatible Object Storage
- **Direct Concierge:** WhatsApp Click-to-Chat & Message Templates

---

## Directory Structure

```
backend/
├── app/
│   ├── main.py                  # Application entry point with CORS & routers
│   ├── config.py                # Pydantic Settings & environment variables
│   ├── database.py              # Async SQLAlchemy engine & session maker
│   ├── dependencies.py          # Auth & Role verification dependency injection
│   │
│   ├── user_auth/               # Authentication & Profiles (FR-01)
│   │   ├── models.py            # User, UserProfile, PasswordResetToken
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── utils.py             # bcrypt hashing & JWT utilities
│   │   ├── service.py           # Auth logic & password reset flow
│   │   └── router.py            # /api/v1/auth/register, /login, /forgot-password, /profile
│   │
│   ├── discovery/               # Discovery Engine (Places, Food, Shops, Events)
│   │   ├── models.py            # Destination, Place, Event, Activity, Restaurant, Shop
│   │   ├── schemas.py           # Discovery API schemas
│   │   ├── service.py           # Spatial Haversine distance calculations
│   │   └── router.py            # /api/v1/discovery/destinations, /places, /restaurants, /shops, /nearby
│   │
│   ├── admin/                   # Admin Operations & Moderation
│   │   ├── schemas.py           # Admin overview metrics & status schemas
│   │   ├── service.py           # Place status updates & user moderation
│   │   └── router.py            # /api/v1/admin/stats, /places/{id}/status, /users/{id}/suspend
│   │
│   └── shared/                  # Shared Utilities & Models
│       ├── models.py            # BaseModel, Role, PlaceStatus, VerificationStatus
│       └── whatsapp.py          # WhatsApp direct links & trip share helpers
│
├── seeds/
│   ├── jaipur_seed.json         # Deep Jaipur dataset (Forts, Foods, Bazaars, Events, Safaris)
│   └── seed_runner.py           # Database auto-populator script
└── requirements.txt
```

---

## Setup & Running Locally

1. **Activate Virtual Environment:**
   ```bash
   cd backend
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Seed Database with Jaipur Destination Data:**
   ```bash
   python seeds/seed_runner.py
   ```

4. **Start Development Server:**
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

5. **API Documentation:**
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`
   - Health Check: `http://localhost:8000/api/v1/health`

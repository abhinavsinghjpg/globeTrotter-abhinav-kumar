from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import async_engine, Base
from app.user_auth.router import router as auth_router
from app.discovery.router import router as discovery_router
from app.admin.router import router as admin_router
from app.shared.whatsapp import generate_whatsapp_link

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Travel Intelligence & Experience Platform API for India (Next.js + FastAPI + PostgreSQL)",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    # In development mode, auto-create tables
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Include domain routers under API_V1_STR
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(discovery_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)


@app.get("/api/v1/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "whatsapp_assist_url": generate_whatsapp_link(),
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to GlobeTrotter Travel Intelligence Platform API",
        "docs": "/docs",
        "health": "/api/v1/health",
    }

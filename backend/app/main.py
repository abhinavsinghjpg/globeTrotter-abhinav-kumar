"""
Main FastAPI Application Entry Point for GlobeTrotter & Adaptive AI Travel Decision Engine.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# AI Decision Engine & Platform Routers
from app.api.ai import router as ai_router
from app.api.itinerary import router as itinerary_router
from app.api.replan import router as replan_router
from app.api.places import router as places_router
from app.api.evaluation import router as evaluation_router
from app.api.community import router as community_router
from app.api.transport import router as transport_router
from app.api.memories import router as memories_router
from app.api.events import router as events_router
from app.services.ollama_service import ollama_service

# Optional Platform Routers (if available)
try:
    from app.user_auth.router import router as auth_router
except ImportError:
    auth_router = None

try:
    from app.discovery.router import router as discovery_router
except ImportError:
    discovery_router = None

try:
    from app.admin.router import router as admin_router
except ImportError:
    admin_router = None

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="GlobeTrotter Adaptive AI Travel Decision Engine & Experience Platform API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers under both /api and /api/v1 for seamless compatibility
for prefix in ["/api", "/api/v1"]:
    app.include_router(ai_router, prefix=prefix)
    app.include_router(itinerary_router, prefix=prefix)
    app.include_router(replan_router, prefix=prefix)
    app.include_router(places_router, prefix=prefix)
    app.include_router(evaluation_router, prefix=prefix)
    app.include_router(community_router, prefix=prefix)
    app.include_router(transport_router, prefix=prefix)
    app.include_router(memories_router, prefix=prefix)
    app.include_router(events_router, prefix=prefix)

# Mount Platform Routers if present
if auth_router:
    app.include_router(auth_router, prefix="/api/v1")
if discovery_router:
    app.include_router(discovery_router, prefix="/api/v1")
if admin_router:
    app.include_router(admin_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "message": "GlobeTrotter Adaptive AI Travel Decision Engine API is operational.",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/api/v1/health"
    }

@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }

@app.get("/api/ollama/status")
@app.get("/api/v1/ollama/status")
def get_ollama_status():
    is_available, message = ollama_service.is_available()
    return {
        "status": "connected" if is_available else "disconnected",
        "message": message,
        "base_url": settings.OLLAMA_BASE_URL,
        "model": settings.OLLAMA_MODEL
    }

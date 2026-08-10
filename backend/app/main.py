"""
SAi (Sudan AI) Main Application Entrypoint
FastAPI Server Architecture (Python 3.12+)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import support, tutor

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Silicon Valley grade AI Platform with authentic Sudanese identity 🇸🇩",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Security Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production via settings.APP_URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(support.router, prefix="/api/v1")
app.include_router(tutor.router, prefix="/api")
app.include_router(tutor.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "developer": settings.DEVELOPER_NAME,
        "contact_whatsapp": settings.DEVELOPER_WHATSAPP,
        "contact_email": settings.DEVELOPER_EMAIL,
        "message": "Welcome to SAi - Sudan AI Platform APIs"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "SAi Core API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

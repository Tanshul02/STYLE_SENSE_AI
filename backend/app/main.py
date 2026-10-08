from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.core.database import Base, engine, SessionLocal
from app.seed import seed_database
from app.api.routes import (
    auth, wardrobe, outfits, chatbot, products, cart, travel, tryon, monitor,
    agent, fit_studio, should_i_wear, comparison
)
from app.services.monitor_service import record_api_request

settings = get_settings()

# Initialize Database tables
Base.metadata.create_all(bind=engine)

# Populate realistic initial seed data
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title=settings.APP_NAME,
    description="Your Personal AI Fashion Bestie & Smart Digital Wardrobe API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Telemetry Middleware for Cloud Computing demonstration
@app.middleware("http")
async def telemetry_middleware(request: Request, call_next):
    record_api_request()
    response = await call_next(request)
    return response

# Include API Routers
app.include_router(auth.router)
app.include_router(wardrobe.router)
app.include_router(outfits.router)
app.include_router(chatbot.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(travel.router)
app.include_router(tryon.router)
app.include_router(monitor.router)
app.include_router(agent.router)
app.include_router(fit_studio.router)
app.include_router(should_i_wear.router)
app.include_router(comparison.router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "ai_provider": settings.AI_PROVIDER,
        "database": "Supabase / Resilient SQLite Engine",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

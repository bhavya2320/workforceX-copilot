"""
FastAPI Application Entry Point for Workforce Copilot
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.api import router as api_router

app = FastAPI(
    title="Workforce Copilot API",
    description="Intelligent HR workforce-planning and capacity optimization platform",
    version="1.0.0"
)

# Enable CORS for local Vite development and external frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router)

@app.get("/")
def root():
    return {
        "product": "Workforce Copilot",
        "description": "AI Workforce Capacity & Hiring Optimization Engine",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

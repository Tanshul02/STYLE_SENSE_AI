# StyleSense AI — Cloud Deployment Guide

## 1. Quick Start via Docker Compose
```bash
# Clone and navigate to project root
cd stylesense-ai

# Build and start all services
docker-compose up --build
```
* **Frontend UI**: `http://localhost:3000`
* **FastAPI Backend**: `http://localhost:8000`
* **Swagger API Documentation**: `http://localhost:8000/docs`

## 2. Standalone Local Development
```bash
# Terminal 1: Backend
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

## 3. Cloud Provider Configuration
To connect to live Supabase cloud infrastructure:
1. Update `.env` with:
   ```bash
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   SUPABASE_URL=https://[PROJECT-ID].supabase.co
   SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
   ```
2. Set `AI_PROVIDER=huggingface` and supply `HUGGINGFACE_API_KEY`.

# StyleSense AI ✨
> **Your Personal AI Fashion Bestie & Smart Digital Wardrobe**

StyleSense AI is an intelligent cloud-based personal fashion stylist and digital wardrobe assistant. Designed to solve everyday styling dilemmas, it organizes what you already own, curates outfits through explainable machine learning, and delivers personalized guidance through a conversational fashion companion.

The application is architected to simultaneously demonstrate competence across five major software engineering and academic disciplines:
1. 🤖 **Artificial Intelligence**: Multi-criteria hybrid recommendation scoring, sentence vector embeddings, cosine similarity search, and conversational LLM integration with fallback.
2. ☁️ **Cloud Computing**: Supabase PostgreSQL (DBaaS), Supabase Auth, Supabase Storage, stateless containers, and live telemetry monitor.
3. 🔄 **Agile Software Development**: 13 comprehensive Agile artifacts (`docs/agile/`) covering backlogs, user stories, acceptance criteria, 7 sprint plans, burndown data, and retrospectives.
4. 🧩 **Software Design Patterns**: Real code implementations of Strategy, Factory, Observer, Singleton, Repository, and Adapter patterns.
5. ⚙️ **DevOps**: Multi-stage Dockerfiles, Docker Compose, automated GitHub Actions CI workflow, and full Pytest validation suites.

---

## 📸 Key Features & Capabilities

* **Personalized Onboarding & Home (`/`)**: Time-aware greeting, daily AI style recommendation, wardrobe overview, and trending fashion inspiration.
* **Smart Digital Wardrobe (`/wardrobe`)**: Full CRUD digital closet categorized across 12 fashion categories with Strategy Pattern metadata analysis.
* **Autonomous AI Fashion Agent Bestie (Global Slide-Over Drawer & `/chat`)**: Conversational companion with deliberate step-by-step reasoning traces, intent classification (`style_scoring`, `palette_analysis`, `shopping_expansion`), and interactive product recommendation cards.
* **Next-Gen Virtual Try-On Studio (`/try-on`)**: Real photo ingestion, instant local preview, catalog garment selection, progressive 4-stage neural simulation, async job polling, and comparative Before/After view.
* **Server-Validated Anti-Tampering Checkout (`/checkout`)**: Cryptographic and database-backed quote validation (`POST /api/cart/quote`) eliminating client-side price tampering.
* **AI Fit Studio (`/ai-fit-studio`)**: Interactive outfit canvas with live multi-dimensional compatibility scoring.
* **Should I Wear This (`/should-i-wear-this`)**: Context-aware AI outfit evaluation based on occasion, weather, and venue.
* **Curated Marketplace & Cart (`/shop`, `/cart`)**: Luxury catalog with size selection, search, wishlist, and server-validated pricing.
* **Pack With AI (`/travel-assistant`)**: Intelligent packing checklists and weather-adapted transit capsules.
* **Cloud Telemetry Monitor (`/admin/cloud-monitor`)**: Live dashboard tracking API throughput, latency, storage usage, and cloud service operational status.

---

## 🚀 Instant Demonstration & Running Instructions

### Method A: Local Full-Stack Launch (Recommended)
```bash
# 1. Start FastAPI Backend (Terminal 1)
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# 2. Start Vite Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.
Click **"Meet Your Stylist"** or **"Instant Evaluator Demo Login"** to immediately access the pre-populated wardrobe and test looks!

### Method B: Docker Compose
```bash
docker-compose up --build
```
Frontend accessible at `http://localhost:3000` and backend at `http://localhost:8000`.

---

## 🧪 Automated Testing

### Backend Test Suite (Pytest)
Run the backend pytest suite verifying agent tools, embeddings, patterns, scoring, try-on studio, and REST endpoints:
```bash
cd backend
python -m pytest --verbose
```

### Frontend Typecheck & Production Build
Verify TypeScript type safety and compile production distribution:
```bash
cd frontend
npm run typecheck
npm run build
```

---

## 📚 Documentation Index
* [System Architecture](docs/architecture.md)
* [Artificial Intelligence Architecture](docs/ai-architecture.md)
* [Cloud Computing Architecture](docs/cloud-architecture.md)
* [Software Design Patterns](docs/design-patterns.md)
* [Agile Methodology & Sprints 1-7](docs/agile/product-backlog.md)
* [REST API Documentation](docs/api-documentation.md)
* [Cloud Deployment Guide](docs/deployment.md)

---
© 2026 StyleSense AI — Designed & Engineered for Excellence.

# StyleSense AI — System Architecture

## Overview
StyleSense AI is an enterprise-grade, cloud-native fashion intelligence platform structured around Clean Architecture principles. It decouples interface concerns, orchestration layers, domain business logic, data persistence, and external AI services.

```text
                           USERS
                             │
                             ▼
                    REACT FRONTEND (Vite / Tailwind)
                             │
                         REST API
                             │
                             ▼
                       FASTAPI BACKEND
                             │
       ┌─────────────────────┼──────────────────────┐
       │                     │                      │
       ▼                     ▼                      ▼
WARDROBE SERVICE    RECOMMENDATION ENGINE      CHAT SERVICE
       │                     │                      │
       │                     ▼                      │
       │              AI / ML LAYER                │
       │                     │                      │
       └─────────────────────┼──────────────────────┘
                             │
                     SERVICE LAYER
                             │
                             ▼
                    REPOSITORY LAYER
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
          SUPABASE       CLOUD STORAGE    AI PROVIDERS
          POSTGRESQL       IMAGES        HuggingFace / Local
```

## Layer Responsibilities
1. **Frontend Presentation**: React 19 single-page application built on Vite, Tailwind CSS v4, and Lucide React icons. Features luxury editorial aesthetics with zero generic tropes.
2. **API Controller Layer (`app/api/routes`)**: Pydantic input validation, status code mapping, HTTP middleware telemetry.
3. **Domain Service Layer (`app/services`)**: Business logic orchestration, recommendation pipeline invocation, payment strategy coordination.
4. **Design Pattern Abstractions (`app/patterns`)**: Gang of Four (GoF) patterns: Strategy, Factory, Observer, Singleton, Repository, and Adapter.
5. **AI / ML Layer (`app/ai`)**: Hybrid recommendation scoring, sentence vector embeddings, cosine similarity calculation, conversational assistant.
6. **Data Access Repository Layer (`app/repositories`)**: Isolates database queries from business rules.
7. **Cloud Persistence**: Supabase PostgreSQL DBaaS, Supabase Storage for garment assets, and stateless Dockerized containers.

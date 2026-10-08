# StyleSense AI — Cloud Computing Architecture

## Cloud Model Matrix

| Service Model | Implementation in StyleSense AI | Cloud Role |
|---|---|---|
| **SaaS** | StyleSense AI Web Application | End-user intelligent wardrobe software |
| **PaaS** | FastAPI Backend Deployment | Managed Python runtime and container hosting |
| **DBaaS** | Supabase PostgreSQL | Fully managed relational database with RLS |
| **Storage as a Service** | Supabase Storage Buckets | Secure cloud blob storage for wardrobe photos |
| **AIaaS** | Hugging Face Cloud Inference | Hosted AI reasoning and text models |

## Cloud Monitoring Dashboard
Accessible at `/admin/cloud-monitor`, the dashboard exposes real-time telemetry:
* **Throughput**: Cumulative API requests.
* **AI Inferences**: Outfit recommendation and chatbot queries.
* **Storage Allocation**: Garment image storage consumption.
* **Latency**: Average response time in milliseconds.
* **Service Health**: Operational status of SaaS, PaaS, DBaaS, and AIaaS components.

# StyleSense AI — REST API Documentation

Base URL: `/api`  
Interactive Swagger Docs: `http://localhost:8000/docs`

## Core Endpoints Summary

### Authentication (`/api/auth`)
* `POST /signup` — Register new user profile.
* `POST /login` — Authenticate and receive JWT access token.
* `GET /me` — Retrieve current user profile and fashion preferences.
* `PUT /preferences` — Update style preferences, colors, and goals.

### Digital Wardrobe (`/api/wardrobe`)
* `GET /` — List user wardrobe items (supports `?category=` filter).
* `POST /` — Ingest new clothing garment with metadata.
* `PUT /{id}` — Update garment metadata.
* `DELETE /{id}` — Remove item from wardrobe.

### AI Outfit Recommendations (`/api/outfits`)
* `POST /generate` — Execute hybrid scoring algorithm for occasion, formality, and weather.
* `GET /` — Retrieve saved outfits.
* `POST /save` — Save an outfit combination.
* `POST /{id}/favorite` — Toggle outfit favorite status.

### Fashion Bestie Chatbot (`/api/chat`)
* `POST /` — Send conversational styling inquiry (wardrobe prioritized).
* `GET /history` — Retrieve chat history.

### Discover & Cart (`/api/products`, `/api/cart`)
* `GET /products` — Query catalog by category, audience, and search term.
* `GET /products/{id}` — Get detailed product specifications.
* `GET /cart` — View shopping bag calculation.
* `POST /cart` — Add product to cart.
* `POST /cart/checkout` — Execute checkout via DemoPaymentStrategy.

### Travel & Virtual Try-On (`/api/travel`, `/api/tryon`)
* `POST /travel/pack` — Generate destination capsule and checklist.
* `POST /tryon` — Simulate virtual garment try-on.

### Cloud Telemetry (`/api/monitor`)
* `GET /metrics` — Live cloud metrics for evaluation.

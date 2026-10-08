# StyleSense AI — Software Design Patterns Documentation

Every design pattern in StyleSense AI solves a specific architectural challenge.

---

### 1. Strategy Pattern
* **Problem**: Different recommendation algorithms (Occasion, Weather, Preference, Semantic) and checkout systems need to be swapped interchangeably at runtime.
* **Solution**: `RecommendationStrategy`, `ClothingAnalyzer`, and `PaymentStrategy` interfaces with concrete implementations.
* **Code Locations**:
  * `backend/app/patterns/strategy/recommendation.py`
  * `backend/app/patterns/strategy/analyzer.py`
  * `backend/app/patterns/strategy/payment.py`

---

### 2. Factory Pattern
* **Problem**: The application needs to instantiate external AI providers (Hugging Face, OpenAI, Mock) based on environment configuration without modifying business logic.
* **Solution**: `AIProviderFactory.get_provider()` encapsulates dynamic provider creation with automatic fallback.
* **Code Location**: `backend/app/patterns/factory/ai_provider_factory.py`

---

### 3. Observer Pattern
* **Problem**: System events (outfit generated, item uploaded, order checked out) need to trigger audit logging, cloud metrics, and notifications without tight coupling.
* **Solution**: `StyleSenseEventBus` (Subject) with `AuditLogObserver` and `InAppNotificationObserver`.
* **Code Location**: `backend/app/patterns/observer/event_bus.py`

---

### 4. Singleton Pattern
* **Problem**: Expensive resource initializations (application settings, database engines, model tokenizers) must only be created once.
* **Solution**: `ConfigurationManager` and `get_settings()` with `@lru_cache()`.
* **Code Locations**:
  * `backend/app/patterns/singleton/settings.py`
  * `backend/app/core/config.py`

---

### 5. Repository Pattern
* **Problem**: Business services should not contain raw SQL or direct database queries.
* **Solution**: Isolated repositories: `UserRepository`, `WardrobeRepository`, `OutfitRepository`, `ProductRepository`, `ChatRepository`.
* **Code Location**: `backend/app/repositories/`

---

### 6. Adapter Pattern
* **Problem**: External meteorological APIs return heterogeneous formats incompatible with internal recommendation structures.
* **Solution**: `WeatherProvider` interface with `MockWeatherProvider` and `OpenWeatherAdapter`.
* **Code Location**: `backend/app/patterns/adapter/weather_adapter.py`

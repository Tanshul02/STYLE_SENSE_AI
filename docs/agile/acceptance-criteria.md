# StyleSense AI — Acceptance Criteria (Gherkin Format)

### Scenario 1: Generating Hybrid Outfit Recommendations
```gherkin
Feature: Hybrid Outfit Recommendation Engine
  Scenario: User requests an outfit for a College Farewell
    Given the user is authenticated and has clothing items in their digital wardrobe
    When the user selects Occasion="College Farewell", Style="Elegant", Color="Black", Formality="High"
    And clicks "Generate My Look"
    Then the system applies OccasionBasedStrategy, StyleCompatibility, ColorHarmony, and WeatherStrategy
    And computes the weighted composite score:
      Score = 0.30*Occasion + 0.25*Style + 0.20*Color + 0.15*Weather + 0.10*Preferences
    And displays "Look 1 — Primary Match" with garment photos, score badge, and "Why This Outfit Works" reasoning
    And provides options to "Save Look" or "Ask Fashion Bestie About This Look"
```

### Scenario 2: Fashion Bestie Prioritizes Wardrobe First
```gherkin
Feature: Wardrobe-First Chatbot
  Scenario: User asks what to wear for a farewell
    Given the user has an oversized blazer and straight trousers in their wardrobe
    When the user asks "I have a college farewell tomorrow. What should I wear?"
    Then the chatbot responds in an enthusiastic bestie persona
    And references the user's existing blazer and trousers before recommending any shopping products
    And attaches the wardrobe item cards to the message bubble
```

### Scenario 3: Digital Wardrobe Upload via Strategy Pattern
```gherkin
Feature: Clothing Upload
  Scenario: Ingesting a new garment
    Given the user opens "/wardrobe/upload"
    When they submit a valid image URL and metadata attributes
    Then the active ClothingAnalyzer strategy processes the garment tags
    And the item is stored with user_id association
    And an event "clothing_uploaded" is emitted across the Event Bus
```

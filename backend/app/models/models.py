import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    style_preferences = Column(Text, default="[]")  # JSON-encoded array of strings
    favorite_colors = Column(Text, default="[]")    # JSON-encoded array of strings
    fashion_goals = Column(Text, default="[]")      # JSON-encoded array of strings
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    wardrobe_items = relationship("ClothingItem", back_populates="user", cascade="all, delete-orphan")
    outfits = relationship("Outfit", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class ClothingItem(Base):
    __tablename__ = "clothing_items"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id"), nullable=False)
    name = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    category = Column(String, nullable=False)  # T-Shirts, Shirts, Bottoms, Dresses, Jackets, etc.
    color = Column(String, nullable=False)
    style = Column(String, nullable=False)     # Casual, Formal, Elegant, Minimalist, etc.
    season = Column(String, nullable=False)    # Summer, Winter, Monsoon, All-Season
    occasion = Column(String, nullable=False)  # College, Office, Party, Travel, Wedding, Daily
    formality = Column(String, nullable=False) # Low, Medium, High
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("Profile", back_populates="wardrobe_items")
    outfit_items = relationship("OutfitItem", back_populates="clothing_item", cascade="all, delete-orphan")

class Outfit(Base):
    __tablename__ = "outfits"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id"), nullable=False)
    name = Column(String, nullable=False)
    occasion = Column(String, nullable=False)
    style = Column(String, nullable=False)
    compatibility_score = Column(Float, nullable=False)
    explanation = Column(Text, nullable=False)
    score_breakdown = Column(Text, nullable=True)  # JSON-encoded breakdown
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("Profile", back_populates="outfits")
    items = relationship("OutfitItem", back_populates="outfit", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="outfit", cascade="all, delete-orphan")

class OutfitItem(Base):
    __tablename__ = "outfit_items"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    outfit_id = Column(String, ForeignKey("outfits.id"), nullable=False)
    clothing_item_id = Column(String, ForeignKey("clothing_items.id"), nullable=False)
    
    outfit = relationship("Outfit", back_populates="items")
    clothing_item = relationship("ClothingItem", back_populates="outfit_items")

class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id"), nullable=False)
    outfit_id = Column(String, ForeignKey("outfits.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("Profile", back_populates="favorites")
    outfit = relationship("Outfit", back_populates="favorites")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)  # Casual, Formal, Traditional, Party Wear, Footwear, Accessories
    audience = Column(String, nullable=False)  # Men, Women, Kids, Unisex
    gender = Column(String, default="unisex")  # men, women, unisex
    style = Column(String, nullable=False)
    color = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    rating = Column(Float, default=4.5)
    sellers_json = Column(Text, default="[]")  # JSON string of sellers
    accessories_json = Column(Text, default="[]")  # JSON string of curated styling accessories
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")

class CartItem(Base):
    __tablename__ = "cart_items"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id"), nullable=False)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("Profile", back_populates="cart_items")
    product = relationship("Product", back_populates="cart_items")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id"), nullable=False)
    role = Column(String, nullable=False)  # user, assistant
    message = Column(Text, nullable=False)
    referenced_items = Column(Text, nullable=True) # JSON list of item IDs
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("Profile", back_populates="chat_messages")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info") # info, outfit, wardrobe, cart
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("Profile", back_populates="notifications")

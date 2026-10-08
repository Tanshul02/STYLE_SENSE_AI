import json
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.models import Product, CartItem

def enrich_product(p: Product) -> Product:
    if not p:
        return p
    if hasattr(p, "sellers_json") and p.sellers_json and p.sellers_json != "[]":
        try:
            p.sellers = json.loads(p.sellers_json)
        except Exception:
            p.sellers = []
    else:
        p.sellers = [
            {
                "id": f"seller-flagship-{p.id}",
                "name": "Atelier Sense Flagship",
                "location": "New York, NY (Primary Hub)",
                "standard_days": 3,
                "express_days": 1,
                "express_price": 25.0,
                "is_in_stock": True
            },
            {
                "id": f"seller-milan-{p.id}",
                "name": "Milan Haute Studio",
                "location": "Milan, Italy (Express Air Hub)",
                "standard_days": 5,
                "express_days": 2,
                "express_price": 40.0,
                "is_in_stock": True
            }
        ]
    if hasattr(p, "accessories_json") and p.accessories_json and p.accessories_json != "[]":
        try:
            p.accessories = json.loads(p.accessories_json)
        except Exception:
            p.accessories = []
    else:
        # Default luxury styling pairings by gender
        is_men = getattr(p, "gender", "") == "men"
        if is_men:
            p.accessories = [
                {
                    "title": "Church's Shannon Polished Patent Oxford Shoes",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80",
                    "price": 1100,
                    "reason": "Mirror-finish wholecut calfskin creates crisp architectural proportion."
                },
                {
                    "title": "Bottega Veneta Intrecciato Document Folio",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
                    "price": 1850,
                    "reason": "Woven leather folio provides discreet executive texture."
                },
                {
                    "title": "Cartier Santos 18K White Gold Cufflinks",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80",
                    "price": 4250,
                    "reason": "Architectural screw-motif adds precious metal brilliance to cuffs."
                },
                {
                    "title": "Tom Ford Oud Wood Eau de Parfum",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80",
                    "price": 295,
                    "reason": "Rare smoky oud and cardamom evokes commanding elegance."
                }
            ]
        else:
            p.accessories = [
                {
                    "title": "Gianvito Rossi Ribbon Ankle-Tie Stilettos",
                    "category": "shoes",
                    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
                    "price": 895,
                    "reason": "Sculptural stiletto silhouette elongates legs and balances fabric volume."
                },
                {
                    "title": "Bottega Veneta Mini Jodie Intrecciato Clutch",
                    "category": "bag",
                    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
                    "price": 2650,
                    "reason": "Iconic knot detail brings tactile luxury to minimalist tailoring."
                },
                {
                    "title": "Cartier Trinity 18K Cascading Drop Earrings",
                    "category": "jewelry",
                    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
                    "price": 3400,
                    "reason": "Three-gold intertwining bands frame the jawline with subtle warmth."
                },
                {
                    "title": "Maison Francis Kurkdjian Baccarat Rouge 540",
                    "category": "fragrance",
                    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
                    "price": 325,
                    "reason": "Luminous amber and cedarwood sillage for unforgettable evening presence."
                }
            ]
    return p

class ProductRepository:
    """Repository Pattern: Handles shopping catalog and user cart access."""
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, category: Optional[str] = None, audience: Optional[str] = None, search: Optional[str] = None, gender: Optional[str] = None) -> List[Product]:
        query = self.db.query(Product)
        if category and category != "All":
            query = query.filter(Product.category == category)
        
        # Strict Gender / Audience Filtering
        target_gender = gender or audience
        if target_gender and target_gender.lower() != "all":
            g = target_gender.lower()
            if g in ["men", "man", "male"]:
                query = query.filter((Product.gender == "men") | (Product.gender == "unisex"))
            elif g in ["women", "woman", "female"]:
                query = query.filter((Product.gender == "women") | (Product.gender == "unisex"))
            elif g in ["unisex"]:
                query = query.filter(Product.gender == "unisex")
        
        if search:
            query = query.filter(Product.name.ilike(f"%{search}%") | Product.description.ilike(f"%{search}%"))
            
        products = query.all()
        for p in products:
            enrich_product(p)
        return products

    def get_by_id(self, product_id: str) -> Optional[Product]:
        p = self.db.query(Product).filter(Product.id == product_id).first()
        return enrich_product(p) if p else None

    def get_cart(self, user_id: str) -> List[CartItem]:
        return self.db.query(CartItem).filter(CartItem.user_id == user_id).all()

    def add_or_update_cart(self, user_id: str, product_id: str, quantity: int = 1) -> CartItem:
        prod = self.db.query(Product).filter(Product.id == product_id).first()
        if not prod:
            # Check if matching accessory across catalog
            found_acc = None
            for p in self.db.query(Product).all():
                enrich_product(p)
                for a in getattr(p, "accessories", []):
                    if a.get("id") == product_id or a.get("title") == product_id or f"acc-{a.get('category')}-{p.id}" == product_id:
                        found_acc = a
                        break
                if found_acc:
                    break
            
            if found_acc:
                prod = Product(
                    id=product_id,
                    name=found_acc.get("title", "Luxury Accessory"),
                    description=found_acc.get("reason", "Curated atelier styling piece."),
                    price=float(found_acc.get("price", 295.0)),
                    category="Accessories",
                    audience="Unisex",
                    gender="unisex",
                    style="Haute Joaillerie & Accessories",
                    color="Metallic",
                    image_url=found_acc.get("image", "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600"),
                    brand="Atelier Sense Joaillerie",
                    rating=4.95
                )
            else:
                prod = Product(
                    id=product_id,
                    name="Curated Atelier Accessory",
                    description="Artisanal pairing piece selected from StyleSense Atelier.",
                    price=295.0,
                    category="Accessories",
                    audience="Unisex",
                    gender="unisex",
                    style="Atelier Curated",
                    color="Metallic",
                    image_url="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600",
                    brand="Atelier Sense",
                    rating=4.9
                )
            self.db.add(prod)
            self.db.commit()

        item = self.db.query(CartItem).filter(CartItem.user_id == user_id, CartItem.product_id == product_id).first()
        if item:
            item.quantity += quantity
        else:
            item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
            self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update_cart_quantity(self, cart_item_id: str, user_id: str, quantity: int) -> Optional[CartItem]:
        item = self.db.query(CartItem).filter(CartItem.id == cart_item_id, CartItem.user_id == user_id).first()
        if item:
            if quantity <= 0:
                self.db.delete(item)
                self.db.commit()
                return None
            item.quantity = quantity
            self.db.commit()
            self.db.refresh(item)
        return item

    def remove_from_cart(self, cart_item_id: str, user_id: str) -> bool:
        item = self.db.query(CartItem).filter(CartItem.id == cart_item_id, CartItem.user_id == user_id).first()
        if item:
            self.db.delete(item)
            self.db.commit()
            return True
        return False

from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.product_repository import ProductRepository
from app.models.models import Product

class ProductService:
    def __init__(self, db: Session):
        self.repo = ProductRepository(db)

    def get_products(self, category: Optional[str] = None, audience: Optional[str] = None, search: Optional[str] = None, gender: Optional[str] = None) -> List[Product]:
        return self.repo.get_all(category, audience, search, gender)

    def get_product_by_id(self, product_id: str) -> Optional[Product]:
        return self.repo.get_by_id(product_id)

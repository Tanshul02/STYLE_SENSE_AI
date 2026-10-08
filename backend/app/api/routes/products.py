from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.product_service import ProductService
from app.schemas.schemas import ProductResponse

router = APIRouter(prefix="/api/products", tags=["Fashion Marketplace & Discover"])

@router.get("", response_model=List[ProductResponse])
def get_products(category: Optional[str] = None, audience: Optional[str] = None, gender: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    service = ProductService(db)
    return service.get_products(category, audience, search, gender)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product_detail(product_id: str, db: Session = Depends(get_db)):
    service = ProductService(db)
    product = service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

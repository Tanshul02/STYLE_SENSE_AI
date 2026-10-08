from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import Profile
from app.services.cart_service import CartService
from app.schemas.schemas import CartSummaryResponse, CartItemCreate, CartItemUpdate, CartQuoteRequest, CartQuoteResponse
from app.repositories.product_repository import ProductRepository

router = APIRouter(prefix="/api/cart", tags=["Shopping Cart & Payment Strategy"])

@router.get("", response_model=CartSummaryResponse)
def get_cart(current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    service = CartService(db)
    return service.get_cart_summary(current_user.id)

@router.post("", response_model=CartSummaryResponse)
def add_to_cart(data: CartItemCreate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    service = CartService(db)
    return service.add_to_cart(current_user.id, data.product_id, data.quantity)

@router.put("/{cart_item_id}", response_model=CartSummaryResponse)
def update_cart_item(cart_item_id: str, data: CartItemUpdate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    service = CartService(db)
    return service.update_quantity(current_user.id, cart_item_id, data.quantity)

@router.delete("/{cart_item_id}", response_model=CartSummaryResponse)
def remove_cart_item(cart_item_id: str, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    service = CartService(db)
    return service.remove_item(current_user.id, cart_item_id)

@router.post("/checkout")
def checkout(current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    service = CartService(db)
    return service.checkout(current_user.id)

@router.post("/quote", response_model=CartQuoteResponse)
def calculate_cart_quote(data: CartQuoteRequest, db: Session = Depends(get_db)):
    repo = ProductRepository(db)
    subtotal = 0.0
    items_detail = []
    
    for it in data.items:
        prod = repo.get_by_id(it.product_id)
        price = prod.price if prod else 89.00
        name = prod.name if prod else "Luxury Apparel Item"
        line_total = round(price * it.quantity, 2)
        subtotal += line_total
        items_detail.append({
            "product_id": it.product_id,
            "name": name,
            "size": it.size or "M",
            "price": price,
            "quantity": it.quantity,
            "line_total": line_total
        })
        
    tax = round(subtotal * 0.08, 2)
    shipping = 15.00 if 0 < subtotal < 150 else 0.00
    total = round(subtotal + tax + shipping, 2)
    
    return CartQuoteResponse(
        subtotal=round(subtotal, 2),
        estimated_tax=tax,
        shipping=shipping,
        total=total,
        item_count=sum(i.quantity for i in data.items),
        items_detail=items_detail
    )


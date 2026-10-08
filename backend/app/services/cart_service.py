from typing import List
from sqlalchemy.orm import Session
from app.repositories.product_repository import ProductRepository
from app.schemas.schemas import CartSummaryResponse, CartItemResponse, ProductResponse
from app.patterns.strategy.payment import DemoPaymentStrategy
from app.patterns.observer.event_bus import event_bus

class CartService:
    def __init__(self, db: Session):
        self.repo = ProductRepository(db)
        self.payment_strategy = DemoPaymentStrategy()

    def get_cart_summary(self, user_id: str) -> CartSummaryResponse:
        raw_items = self.repo.get_cart(user_id)
        items = []
        subtotal = 0.0
        
        for item in raw_items:
            p_resp = ProductResponse.model_validate(item.product)
            item_sub = round(item.product.price * item.quantity, 2)
            subtotal += item_sub
            items.append(CartItemResponse(
                id=item.id,
                product=p_resp,
                quantity=item.quantity,
                subtotal=item_sub
            ))
            
        tax = round(subtotal * 0.08, 2)
        shipping = 15.00 if subtotal > 0 and subtotal < 150 else 0.00
        total = round(subtotal + tax + shipping, 2)
        
        return CartSummaryResponse(
            items=items,
            subtotal=round(subtotal, 2),
            estimated_tax=tax,
            shipping=shipping,
            total=total,
            item_count=sum(i.quantity for i in items)
        )

    def add_to_cart(self, user_id: str, product_id: str, quantity: int = 1):
        item = self.repo.add_or_update_cart(user_id, product_id, quantity)
        event_bus.notify("item_added_to_cart", {"user_id": user_id, "product_id": product_id, "quantity": quantity})
        return self.get_cart_summary(user_id)

    def update_quantity(self, user_id: str, cart_item_id: str, quantity: int):
        self.repo.update_cart_quantity(cart_item_id, user_id, quantity)
        return self.get_cart_summary(user_id)

    def remove_item(self, user_id: str, cart_item_id: str):
        self.repo.remove_from_cart(cart_item_id, user_id)
        return self.get_cart_summary(user_id)

    def checkout(self, user_id: str):
        summary = self.get_cart_summary(user_id)
        result = self.payment_strategy.process_payment(summary.total, {"user_id": user_id, "items_count": summary.item_count})
        # Clear cart on successful checkout
        for item in summary.items:
            self.repo.remove_from_cart(item.id, user_id)
        return result

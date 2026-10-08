from abc import ABC, abstractmethod
from typing import Dict, Any

class PaymentStrategy(ABC):
    """Strategy Pattern: Pluggable checkout and payment gateways."""
    @abstractmethod
    def process_payment(self, amount: float, order_details: Dict[str, Any]) -> Dict[str, Any]:
        pass

class DemoPaymentStrategy(PaymentStrategy):
    """Demo mode payment processor providing clear labeling and zero fake charges."""
    def process_payment(self, amount: float, order_details: Dict[str, Any]) -> Dict[str, Any]:
        import uuid
        return {
            "success": True,
            "transaction_id": f"DEMO-TXN-{uuid.uuid4().hex[:8].upper()}",
            "amount": amount,
            "mode": "Demo Mode (Mock Payment Strategy)",
            "message": "Demo checkout completed successfully. No real charge incurred."
        }

class RazorpayStrategy(PaymentStrategy):
    def process_payment(self, amount: float, order_details: Dict[str, Any]) -> Dict[str, Any]:
        return {"success": True, "provider": "Razorpay (Architecture Ready)", "amount": amount}

class StripeStrategy(PaymentStrategy):
    def process_payment(self, amount: float, order_details: Dict[str, Any]) -> Dict[str, Any]:
        return {"success": True, "provider": "Stripe (Architecture Ready)", "amount": amount}

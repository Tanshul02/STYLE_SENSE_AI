from app.patterns.singleton.settings import ConfigurationManager
from app.patterns.factory.ai_provider_factory import AIProviderFactory
from app.patterns.observer.event_bus import event_bus, Observer
from app.patterns.strategy.payment import DemoPaymentStrategy
from app.patterns.strategy.analyzer import ManualClothingAnalyzer

def test_singleton_pattern():
    c1 = ConfigurationManager()
    c2 = ConfigurationManager()
    assert c1 is c2

def test_factory_pattern():
    provider = AIProviderFactory.get_provider("mock")
    assert provider.__class__.__name__ == "MockProvider"

def test_observer_pattern():
    events_captured = []
    class TestObserver(Observer):
        def update(self, event_type, data):
            events_captured.append((event_type, data))
            
    test_obs = TestObserver()
    event_bus.attach("test_event", test_obs)
    event_bus.notify("test_event", {"message": "hello"})
    assert len(events_captured) == 1
    assert events_captured[0][0] == "test_event"

def test_strategy_pattern_payment():
    strategy = DemoPaymentStrategy()
    res = strategy.process_payment(120.0, {"user_id": "test"})
    assert res["success"] is True
    assert "DEMO-TXN" in res["transaction_id"]

def test_strategy_pattern_analyzer():
    analyzer = ManualClothingAnalyzer()
    res = analyzer.analyze(None, {"name": "Linen Shirt", "color": "White"})
    assert res["name"] == "Linen Shirt"
    assert res["color"] == "White"

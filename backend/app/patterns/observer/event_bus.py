import logging
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Callable

logger = logging.getLogger("StyleSenseEventBus")

class Observer(ABC):
    """Observer Pattern: Abstract subscriber interface."""
    @abstractmethod
    def update(self, event_type: str, data: Dict[str, Any]) -> None:
        pass

class Subject(ABC):
    """Observer Pattern: Abstract publisher/subject interface."""
    def __init__(self):
        self._observers: Dict[str, List[Observer]] = {}

    def attach(self, event_type: str, observer: Observer) -> None:
        if event_type not in self._observers:
            self._observers[event_type] = []
        if observer not in self._observers[event_type]:
            self._observers[event_type].append(observer)

    def detach(self, event_type: str, observer: Observer) -> None:
        if event_type in self._observers and observer in self._observers[event_type]:
            self._observers[event_type].remove(observer)

    def notify(self, event_type: str, data: Dict[str, Any]) -> None:
        if event_type in self._observers:
            for observer in self._observers[event_type]:
                try:
                    observer.update(event_type, data)
                except Exception as e:
                    logger.error(f"Observer error on {event_type}: {e}")

class AuditLogObserver(Observer):
    """Concrete Observer: Logs high-priority system events for audit & cloud telemetry."""
    def update(self, event_type: str, data: Dict[str, Any]) -> None:
        logger.info(f"[AUDIT EVENT] {event_type.upper()} => {data}")

class InAppNotificationObserver(Observer):
    """Concrete Observer: Triggers user notification pipeline upon events."""
    def __init__(self, notification_callback: Callable = None):
        self.notification_callback = notification_callback

    def update(self, event_type: str, data: Dict[str, Any]) -> None:
        if self.notification_callback and "user_id" in data:
            self.notification_callback(event_type, data)

class StyleSenseEventBus(Subject):
    """Singleton implementation of the Event Subject."""
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(StyleSenseEventBus, cls).__new__(cls)
            super(StyleSenseEventBus, cls._instance).__init__()
            # Attach default audit observer
            cls._instance.attach("outfit_generated", AuditLogObserver())
            cls._instance.attach("clothing_uploaded", AuditLogObserver())
            cls._instance.attach("outfit_saved", AuditLogObserver())
            cls._instance.attach("item_added_to_cart", AuditLogObserver())
        return cls._instance

event_bus = StyleSenseEventBus()

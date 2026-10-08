from app.core.config import Settings, get_settings

class ConfigurationManager:
    """
    Singleton Pattern: Ensures a single point of configuration access
    across the entire StyleSense AI application lifecycle.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ConfigurationManager, cls).__new__(cls)
            cls._instance.settings = get_settings()
        return cls._instance

    def get_setting(self, key: str, default=None):
        return getattr(self.settings, key, default)

config_singleton = ConfigurationManager()

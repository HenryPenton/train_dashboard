from src.adapters.schemas.config.config_schema import ConfigSchema


class Config:
    @staticmethod
    def process_config(config):
        config_schema = ConfigSchema()
        return config_schema.load(config)

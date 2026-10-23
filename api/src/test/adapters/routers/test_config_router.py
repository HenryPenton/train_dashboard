from fastapi import FastAPI
from fastapi.testclient import TestClient
import src.adapters.routers.config_router as config_handler
import pytest


class DummyConfigService:
    def set_config(self, new_config):
        return True

    def get_config(self):
        return {"foo": "bar"}


@pytest.fixture
def test_app():
    app = FastAPI()
    app.include_router(config_handler.router)
    app.dependency_overrides[config_handler.get_config_service] = (
        lambda: DummyConfigService()
    )
    return TestClient(app)


def test_get_config_service_returns_instance():
    from src.adapters.routers.config_router import get_config_service, ConfigService

    service = get_config_service()
    assert isinstance(service, ConfigService)


def test_get_config_success(test_app):
    response = test_app.get("/config")
    assert response.status_code == 200
    # config replaced by default if its missing - wrong properties are removed
    assert response.json() == {
        "rail_departures": [],
        "refresh_timer": 300,
        "tfl_best_routes": [],
        "tube_departures": [],
        "tfl_line_status": {"enabled": False, "col_2_position": 1, "col_3_position": 1, "importance": 1},
        "theme": "dark",
    }


def test_set_config_success(test_app):
    payload = {"hello": "world"}
    response = test_app.post("/config", json=payload)
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_get_config_not_found():
    class FailingConfigService:
        def get_config(self):
            raise FileNotFoundError()

        def set_config(self, new_config):
            pass

    app = FastAPI()
    app.include_router(config_handler.router)
    app.dependency_overrides[config_handler.get_config_service] = (
        lambda: FailingConfigService()
    )
    client = TestClient(app)
    response = client.get("/config")
    assert response.status_code == 404
    assert response.json()["detail"] == "Config file not found"


def test_set_config_error():
    class FailingConfigService:
        def set_config(self, new_config):
            raise Exception("fail")

        def get_config(self):
            return {"foo": "bar"}

    app = FastAPI()
    app.include_router(config_handler.router)
    app.dependency_overrides[config_handler.get_config_service] = (
        lambda: FailingConfigService()
    )
    client = TestClient(app)
    response = client.post("/config", json={"bad": "data"})
    assert response.status_code == 500
    assert "fail" in response.json()["detail"]


def test_get_config_raises_exception():
    class FailingConfigService:
        def set_config(self, new_config):
            return True

        def get_config(self):
            raise Exception("Something went wrong!")

    app = FastAPI()
    app.include_router(config_handler.router)
    app.dependency_overrides[config_handler.get_config_service] = (
        lambda: FailingConfigService()
    )
    client = TestClient(app)
    response = client.get("/config")
    assert response.status_code == 500
    assert response.json()["detail"] == "Something went wrong!"


def test_get_config_without_theme_defaults_to_dark(tmp_path):
    """An existing config.json written before themes existed still loads."""
    import json
    import logging
    from src.adapters.file_handlers.json.json_file_read import JSONFileReader
    from src.adapters.file_handlers.json.json_file_write import JSONFileWriter
    from src.DAOs.config.config_dao import ConfigDAO

    config_path = tmp_path / "config.json"
    config_path.write_text(json.dumps({"refresh_timer": 120}))

    app = FastAPI()
    app.include_router(config_handler.router)
    app.dependency_overrides[config_handler.get_config_service] = (
        lambda: config_handler.ConfigService(
            reader=JSONFileReader[ConfigDAO](config_path),
            writer=JSONFileWriter(config_path),
            config_path=config_path,
            logger=logging.getLogger("test"),
        )
    )
    response = TestClient(app).get("/config")
    assert response.status_code == 200
    assert response.json()["theme"] == "dark"
    assert response.json()["refresh_timer"] == 120


def test_set_config_rejects_unknown_theme(test_app):
    response = test_app.post("/config", json={"theme": "neon"})
    assert response.status_code == 422

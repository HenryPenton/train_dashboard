from fastapi import FastAPI
from fastapi.testclient import TestClient
import src.adapters.handlers.config_router as config_handler
import pytest


class DummyConfigService:
    def set_config(self, new_config):
        DummyConfigService.last_set = new_config
        return True

    def get_config(self):
        return {"foo": "bar"}


@pytest.fixture
def test_app(monkeypatch):
    # Patch config_service in the handler
    monkeypatch.setattr(config_handler, "config_service", DummyConfigService())
    app = FastAPI()
    app.include_router(config_handler.router)
    return TestClient(app)


def test_get_config_success(test_app):
    response = test_app.get("/config")
    assert response.status_code == 200
    assert response.json() == {"foo": "bar"}


def test_set_config_success(test_app):
    payload = {"hello": "world"}
    response = test_app.post("/config", json=payload)
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    assert DummyConfigService.last_set == payload

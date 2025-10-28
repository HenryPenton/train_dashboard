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


def test_get_config_not_found(monkeypatch, test_app):
    class FailingConfigService:
        def get_config(self):
            raise FileNotFoundError()

        def set_config(self, new_config):
            pass

    monkeypatch.setattr(config_handler, "config_service", FailingConfigService())
    response = test_app.get("/config")
    assert response.status_code == 404
    assert response.json()["detail"] == "Config file not found"


def test_set_config_error(monkeypatch, test_app):
    class FailingConfigService:
        def set_config(self, new_config):
            raise Exception("fail")

        def get_config(self):
            return {"foo": "bar"}

    monkeypatch.setattr(config_handler, "config_service", FailingConfigService())
    response = test_app.post("/config", json={"bad": "data"})
    assert response.status_code == 500
    assert "fail" in response.json()["detail"]


def test_get_config_raises_exception(monkeypatch):
    class FailingConfigService:
        def set_config(self, new_config):
            return True

        def get_config(self):
            raise Exception("Something went wrong!")

    monkeypatch.setattr(config_handler, "config_service", FailingConfigService())
    app = FastAPI()
    app.include_router(config_handler.router)
    client = TestClient(app)
    response = client.get("/config")
    assert response.status_code == 500
    assert response.json()["detail"] == "Something went wrong!"

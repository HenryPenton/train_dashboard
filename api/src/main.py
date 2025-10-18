import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.handlers.config import router as config_router
from src.hex.adapters.handlers.tfl_handlers import (
    get_best_route_handler,
    get_tfl_line_status_handler,
)
from src.hex.adapters.handlers.rail_handlers import get_departures_handler

load_dotenv()
origins = [os.getenv("APP_URL", "http://localhost:3000")]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
REALTIME_TRAINS_API_BASE = "https://api.rtt.io/api/v1/json"
REALTIME_TRAINS_API_USER = os.getenv("RTT_API_USER", "your_username")
REALTIME_TRAINS_API_PASS = os.getenv("RTT_API_PASS", "your_password")

app.include_router(config_router)


# Departures new handler
@app.get("/rail/departures/{origin_station_code}/to/{destination_station_code}")
async def get_departures(origin_station_code: str, destination_station_code):
    return await get_departures_handler(origin_station_code, destination_station_code)


# TFL Line Status Endpoint
@app.get("/tfl/line-status")
async def get_tfl_line_status():
    return await get_tfl_line_status_handler()


# Best route endpoint
@app.get("/tfl/best-route/{from_station}/{to_station}")
async def get_best_route(from_station: str, to_station: str):
    return await get_best_route_handler(from_station, to_station)

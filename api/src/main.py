import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.adapters.handlers.atco_code import router as atco_code_router
from src.adapters.handlers.config import router as config_router
from src.adapters.handlers.rail_handlers import get_departures_handler
from src.adapters.handlers.tfl_handlers import (
    get_best_route_handler,
    get_tfl_line_status_handler,
)

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

app.include_router(config_router)
app.include_router(atco_code_router)


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

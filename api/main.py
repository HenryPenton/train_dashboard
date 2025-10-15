
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from handlers.tfl_line_status import get_tfl_line_status_handler
from handlers.departures import get_departures_handler
import os
from dotenv import load_dotenv
from handlers.departures_with_tiploc import get_departures_with_tiploc_handler

from handlers.best_route import get_best_route_handler
from handlers.config import router as config_router

load_dotenv()

app = FastAPI()
app.include_router(config_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("APP_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
REALTIME_TRAINS_API_BASE = "https://api.rtt.io/api/v1/json"
REALTIME_TRAINS_API_USER = os.getenv("RTT_API_USER", "your_username")
REALTIME_TRAINS_API_PASS = os.getenv("RTT_API_PASS", "your_password")

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

# Departures handler
@app.get("/departures/{station_code}")
async def get_departures(station_code: str):
    return await get_departures_handler(station_code)

# Departures with tiploc handler
@app.get("/departures/{station_code}/{destination_tiploc}")
async def get_departures_with_tiploc(station_code: str, destination_tiploc: str):
    return await get_departures_with_tiploc_handler(station_code, destination_tiploc)


# TFL Line Status Endpoint
@app.get("/tfl/line-status")
async def get_tfl_line_status():
    return await get_tfl_line_status_handler()

# Best route endpoint
@app.get("/tfl/best-route/{from_station}/{to_station}")
async def get_best_route(from_station: str, to_station: str):
    return await get_best_route_handler(from_station, to_station)

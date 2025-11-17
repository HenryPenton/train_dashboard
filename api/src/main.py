import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from src.adapters.routers.config_router import router as config_router
from src.adapters.routers.tfl.station_codes_router import router as station_codes_router
from src.adapters.routers.rail_handlers_router import router as rail_router
from src.adapters.routers.schedules_router import router as schedules_router
from src.adapters.routers.tfl_handlers_router import router as tfl_router

load_dotenv()
origins = [os.getenv("APP_URL", "http://localhost:3000")]


app = FastAPI()
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(config_router)
app.include_router(station_codes_router)
app.include_router(rail_router)
app.include_router(tfl_router)
app.include_router(schedules_router)


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from tfl_utils import simplify_tfl_line_status
import os
from dotenv import load_dotenv
from departures_utils import process_departures_response
# loading variables from .env file
load_dotenv()

app = FastAPI()
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


@app.get("/departures/{station_code}")
async def get_departures(station_code: str):
    """
    Get departures from a station using the Real Time Trains API.
    station_code: 3-letter CRS code (e.g., 'KGX' for King's Cross)
    destination_tiploc: tiploc code to filter destinations
    """
    url = f"{REALTIME_TRAINS_API_BASE}/search/{station_code}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, auth=(REALTIME_TRAINS_API_USER, REALTIME_TRAINS_API_PASS))
            response.raise_for_status()
            data = response.json()
            print(data)
            processed = process_departures_response(data)
            return processed
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/departures/{station_code}/{destination_tiploc}")
async def get_departures_with_tiploc(station_code: str, destination_tiploc: str):
    """
    Get departures from a station using the Real Time Trains API.
    station_code: 3-letter CRS code (e.g., 'KGX' for King's Cross)
    destination_tiploc: tiploc code to filter destinations
    """
    url = f"{REALTIME_TRAINS_API_BASE}/search/{station_code}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, auth=(REALTIME_TRAINS_API_USER, REALTIME_TRAINS_API_PASS))
            response.raise_for_status()
            data = response.json()
            processed = process_departures_response(data, destination_tiploc=destination_tiploc)
            return processed
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# TFL Line Status Endpoint
@app.get("/tfl/line-status")
async def get_tfl_line_status():
    """
    Get the status of all TFL lines from the TFL API, simplified.
    """
    url = "https://api.tfl.gov.uk/Line/Mode/tube,overground,dlr,elizabeth-line,tram/status"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json() # List of line status objects
            simplified = simplify_tfl_line_status(data)
            return simplified
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Best route endpoint: Tooting Broadway to Paddington
@app.get("/tfl/best-route/{from_station}/{to_station}")
async def get_best_route(from_station:str, to_station:str):
    """
    Suggest the best current route from Tooting Broadway to Paddington using the TFL Journey Planner API.
    """
    # Alternatively, use station names: "Tooting Broadway" and "Paddington"
    url = f"https://api.tfl.gov.uk/Journey/JourneyResults/{from_station}/to/{to_station}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            # Extract the best route (first journey)
            journeys = data.get("journeys", [])
            if not journeys:
                return {"error": "No journeys found"}
            best = journeys[0]
            print(best)
            summary = {
                "duration": best.get("duration"),
                "arrival": best.get("arrivalDateTime"),
                "legs": [
                    {
                        "mode": leg.get("mode", {}).get("name"),
                        "instruction": leg.get("instruction", {}).get("summary"),
                        "departure": leg.get("departurePoint", {}).get("commonName"),
                        "arrival": leg.get("arrivalPoint", {}).get("commonName"),
                        "line": leg.get("routeOptions", [{}])[0].get("name"),
                    }
                    for leg in best.get("legs", [])
                ]
            }
            return summary
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import os
import requests

API_BASE = os.environ.get("SERVER_URL", "http://localhost:8000")

def fetch_rail_departure(from_station, to_station):
    url = f"{API_BASE}/rail/departures/{from_station}/to/{to_station}"
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.json()

def fetch_best_route(from_station, to_station):
    url = f"{API_BASE}/tfl/best-route/{from_station}/{to_station}"
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.json()

def fetch_tube_line_status():
    url = f"{API_BASE}/tfl/line-status"
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.json()

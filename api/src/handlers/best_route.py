import httpx
from fastapi import HTTPException


async def get_best_route_handler(from_station: str, to_station: str):
    """
    Suggest the best current route from one station to another using the
    TFL Journey Planner API.
    """
    url = (
        f"https://api.tfl.gov.uk/Journey/JourneyResults/{from_station}/to/{to_station}"
    )
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            journeys = data.get("journeys", [])
            if not journeys:
                return {"error": "No journeys found"}
            best = journeys[0]
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
                ],
            }
            return summary
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

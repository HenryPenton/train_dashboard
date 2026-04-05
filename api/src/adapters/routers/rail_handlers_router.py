import httpx
from fastapi import APIRouter, HTTPException, Depends
from src.adapters.clients.rttclient_v2 import RTTClientV2
from src.application.rail_service import RailService
from src.DTOs.rail.departure_dto import DepartureDTO


def get_rtt_client() -> RTTClientV2:
    return RTTClientV2(httpx.AsyncClient())


def get_rail_service(rtt_client: RTTClientV2 = Depends(get_rtt_client)) -> RailService:
    return RailService(rtt_client)


router = APIRouter()


@router.get("/rail/departures/{origin_station_code}/to/{destination_station_code}")
async def get_departures(
    origin_station_code: str,
    destination_station_code: str,
    rail_service: RailService = Depends(get_rail_service),
):
    try:
        rail_departure_models = await rail_service.get_departures(
            origin_station_code, destination_station_code
        )
        rail_departure_DTOS = [
            DepartureDTO(**departure_model.as_dict())
            for departure_model in rail_departure_models
        ]
        return rail_departure_DTOS

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

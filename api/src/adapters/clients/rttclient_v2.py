import os
from datetime import datetime, timezone
from typing import List, Optional

import httpx
from src.adapters.clients.rtt_mapper_v2 import RTTMapperV2
from src.DAOs.rail.departure_dao import DepartureDAO

TOKEN_EXCHANGE_URL = "https://data.rtt.io/api/get_access_token"
LOCATION_URL = "https://data.rtt.io/gb-nr/location"


class RTTClientV2Error(Exception):
    pass


class RTTClientV2:
    def __init__(self, client: httpx.AsyncClient):
        self.client = client
        self._access_token: Optional[str] = None
        self._token_valid_until: Optional[datetime] = None

    def _is_token_valid(self) -> bool:
        if not self._access_token or not self._token_valid_until:
            return False
        return datetime.now(timezone.utc) < self._token_valid_until

    async def _exchange_token(self) -> str:
        refresh_token = os.getenv("RTT_API_BEARER_TOKEN", "")
        try:
            response = await self.client.get(
                TOKEN_EXCHANGE_URL,
                headers={"Authorization": f"Bearer {refresh_token}"},
            )
            response.raise_for_status()
            data = response.json()
            self._access_token = data["token"]
            valid_until = data["validUntil"]
            self._token_valid_until = datetime.fromisoformat(
                valid_until.replace("Z", "+00:00")
            )
            return self._access_token
        except httpx.HTTPStatusError as e:
            raise RTTClientV2Error(
                f"RTTClientV2 token exchange failed: HTTP {e.response.status_code} — {e.response.text}"
            )
        except Exception as e:
            raise RTTClientV2Error(f"RTTClientV2 token exchange failed: {str(e)}")

    async def _get_valid_token(self) -> str:
        if not self._is_token_valid():
            return await self._exchange_token()
        return self._access_token

    async def get_departures(
        self, from_station: str, to_station: str
    ) -> List[DepartureDAO]:
        token = await self._get_valid_token()
        params = {"code": from_station, "filterTo": to_station}
        headers = {"Authorization": f"Bearer {token}"}
        try:
            response = await self.client.get(
                LOCATION_URL, params=params, headers=headers
            )
            response.raise_for_status()
            return RTTMapperV2.to_departure_dao_list(response.json())
        except httpx.HTTPStatusError as e:
            raise RTTClientV2Error(
                f"RTTClientV2 failed: HTTP {e.response.status_code} — {e.response.text}"
            )
        except Exception as e:
            raise RTTClientV2Error(f"RTTClientV2 failed: {str(e)}")

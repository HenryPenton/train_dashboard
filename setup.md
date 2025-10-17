# Project Setup Guide

## Docker images

Pre-built docker images for both the api and app are available at:
henrypenton/train-dashboard-api
henrypenton/train-dashboard-app


## Configuration File (`api/config.json`)

This file contains route and departure configuration for the train dashboard API. You must provide valid station names and codes for your use case. Do not use the example values below in production—replace them with your own data.

### Example Structure

```json
{
  "tfl_best_routes": [
    {
      "origin": "<Origin Station Name>",
      "originNaptan": "<Origin Naptan Code>",
      "destination": "<Destination Station Name>",
      "destinationNaptan": "<Destination Naptan Code>"
    }
    // ... more routes
  ],
  "rail_departures": [
    {
      "origin": "<Origin Station Name>",
      "originCode": "<Origin Station Code>",
      "destination": "<Destination Station Name>",
      "destinationCode": "<Destination Station Code>"
    }
    // ... more departures
  ]
}
```

### Field Descriptions

#### tfl_best_routes

- `origin`: Name of the origin station
- `originNaptan`: Naptan code for the origin station
- `destination`: Name of the destination station
- `destinationNaptan`: Naptan code for the destination station

#### rail_departures

Codes for stations can be either __CRS__ codes (e.g. PAD for London Paddington) or __TIPLOC__ codes (PADTON) - in the case of Paddington, the __CRS__ code would include Crossrail and GWR trains

- `origin`: Name of the origin station
- `originCode`: Station code for the origin station
- `destination`: Name of the destination station
- `destinationCode`: Station code for the destination station


## Real Time Trains API Credentials

To use the live train departures feature, you must obtain an API username and password from the Real Time Trains (RTT) API. Register for an account and request API access at: https://www.realtimetrains.co.uk/about/developer

Add your credentials to the `.env` file as `RTT_API_USER` and `RTT_API_PASS`.



# Config file use
The config file should be mounted as a volume as shown in the example docker compose file

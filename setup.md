# Project Setup Guide

## Configuration File (`api/config.json`)

This file contains route and departure configuration for the train dashboard API. You must provide valid station names and codes for your use case. Do not use the example values below in production—replace them with your own data.

### Example Structure

```json
{
  "best_routes": [
    {
      "origin": "<Origin Station Name>",
      "originNaptan": "<Origin Naptan Code>",
      "destination": "<Destination Station Name>",
      "destinationNaptan": "<Destination Naptan Code>"
    }
    // ... more routes
  ],
  "departures": [
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

#### best_routes

- `origin`: Name of the origin station
- `originNaptan`: Naptan code for the origin station
- `destination`: Name of the destination station
- `destinationNaptan`: Naptan code for the destination station

#### departures

Codes for stations can be either __CRS__ codes (eg PAD for London Paddington) or __TIPLOC__ codes (PADTON) - in the case of Paddington, the __CRS__ code would include Crossrail and GWR trains

- `origin`: Name of the origin station
- `originCode`: Station code for the origin station
- `destination`: Name of the destination station
- `destinationCode`: Station code for the destination station

Add as many route and departure objects as needed for your application. Ensure all codes and names are valid and correspond to real stations.

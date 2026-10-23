import React from "react";
import Button from "../common/Button";
import { SidebarItem } from "./lists/TfLStationSidebarListItem";

export type Route = {
  origin: string;
  originNaPTANOrATCO: string;
  destination: string;
  destinationNaPTANOrATCO: string;
};

interface PlaceDetailsProps {
  selectedSidebarItem: SidebarItem;
  setPartialRoute?: React.Dispatch<React.SetStateAction<Route>>;
  onAddTubeDeparture?: (stationName: string, stationId: string) => void;
  showButtons?: boolean;
  isInTubeStations?: boolean;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({
  selectedSidebarItem,
  setPartialRoute,
  onAddTubeDeparture,
  showButtons = true,
  isInTubeStations = false,
}) => {
  return (
    <div className="bg-surface-0 border border-line rounded-lg p-6 mb-6">
      <h4 className="text-fg-strong font-semibold mb-4 text-lg">
        📍 Place Details
      </h4>
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <span className="font-medium text-fg-soft w-24 mb-1 sm:mb-0">
            Name:
          </span>
          <span className="text-fg-strong font-semibold">
            {selectedSidebarItem.CommonName}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center">
          <span className="font-medium text-fg-soft w-24 mb-1 sm:mb-0">
            NaPTAN:
          </span>
          <span className="text-muted font-mono text-sm">
            {selectedSidebarItem.naptanID}
          </span>
        </div>
      </div>
      {showButtons && (
        <div className="flex flex-wrap gap-3">
          {setPartialRoute && (
            <>
              <Button
                variant="primary"
                onClick={() =>
                  setPartialRoute((r: Route) => ({
                    ...r,
                    origin: selectedSidebarItem.CommonName,
                    originNaPTANOrATCO: selectedSidebarItem.naptanID,
                  }))
                }
              >
                🚀 Set as Origin
              </Button>
              <Button
                variant="success"
                onClick={() =>
                  setPartialRoute((r: Route) => ({
                    ...r,
                    destination: selectedSidebarItem.CommonName,
                    destinationNaPTANOrATCO: selectedSidebarItem.naptanID,
                  }))
                }
              >
                🎯 Set as Destination
              </Button>
            </>
          )}
          {onAddTubeDeparture && isInTubeStations && (
            <Button
              variant="info"
              onClick={() =>
                onAddTubeDeparture(
                  selectedSidebarItem.CommonName,
                  selectedSidebarItem.naptanID,
                )
              }
            >
              ➕ Add to Tube Departures
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaceDetails;

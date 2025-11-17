import React from "react";
import Button from "../generic/Button";
import { SidebarItem } from "../TfL/lists/TfLStationSidebarListItem";

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
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({
  selectedSidebarItem,
  setPartialRoute,
  onAddTubeDeparture,
  showButtons = true,
}) => {
  return (
    <div className="mb-8 p-4 border rounded bg-gray-50">
      <h4 className="font-semibold mb-2">Place Details</h4>
      <div className="text-lg">
        <span className="font-medium">Name:</span>{" "}
        {selectedSidebarItem.CommonName}
      </div>
      <div className="text-lg">
        <span className="font-medium">NaPTAN ID:</span>{" "}
        {selectedSidebarItem.naptanID}
      </div>
      {showButtons && (
        <div className="flex gap-4 mt-4">
          {setPartialRoute && (
            <>
              <Button
                variant="primary"
                className="px-4 py-2"
                onClick={() =>
                  setPartialRoute((r: Route) => ({
                    ...r,
                    origin: selectedSidebarItem.CommonName,
                    originNaPTANOrATCO: selectedSidebarItem.naptanID,
                  }))
                }
              >
                Set as Origin
              </Button>
              <Button
                variant="success"
                className="px-4 py-2"
                onClick={() =>
                  setPartialRoute((r: Route) => ({
                    ...r,
                    destination: selectedSidebarItem.CommonName,
                    destinationNaPTANOrATCO: selectedSidebarItem.naptanID,
                  }))
                }
              >
                Set as Destination
              </Button>
            </>
          )}
          {onAddTubeDeparture && (
            <Button
              variant="info"
              className="px-4 py-2"
              onClick={() =>
                onAddTubeDeparture(
                  selectedSidebarItem.CommonName,
                  selectedSidebarItem.naptanID,
                )
              }
            >
              Add to Tube Departures
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaceDetails;

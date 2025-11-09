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
  showButtons?: boolean;
}

const PlaceDetails: React.FC<PlaceDetailsProps> = ({
  selectedSidebarItem,
  setPartialRoute,
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
      {showButtons && setPartialRoute && (
        <div className="flex gap-4 mt-4">
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
        </div>
      )}
    </div>
  );
};

export default PlaceDetails;

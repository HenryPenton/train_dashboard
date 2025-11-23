import React from "react";
import Button from "../common/Button";
import SectionCard from "../common/SectionCard";

interface SaveActionsProps {
  saveSuccess: boolean;
  saveError: string | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  onSave: () => void;
}

export default function SaveActions({
  saveSuccess,
  saveError,
  hasUnsavedChanges,
  isLoading,
  onSave,
}: SaveActionsProps) {
  return (
    <SectionCard>
      <div className="flex flex-col items-center gap-4">
        {saveSuccess && (
          <div className="p-3 bg-green-900/50 border border-green-600 rounded text-green-200">
            <span className="font-semibold">✅ Success: </span>
            Schedules saved successfully!
          </div>
        )}
        {saveError && (
          <div className="p-3 bg-red-900/50 border border-red-600 rounded text-red-200">
            <span className="font-semibold">❌ Error: </span>
            {saveError}
          </div>
        )}
        <Button
          variant={hasUnsavedChanges ? "success" : "secondary"}
          onClick={onSave}
          disabled={isLoading || !hasUnsavedChanges}
        >
          {isLoading ? "Saving..." : "Save Schedules"}
        </Button>
      </div>
    </SectionCard>
  );
}
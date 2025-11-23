"use client";

import { useState, useMemo } from "react";
import ErrorDisplay from "../components/common/ErrorDisplay";
import Loading from "../components/common/Loading";
import PageLayout from "../components/layout/PageLayout";
import PlaceDetails from "../components/TfL/PlaceDetails";
import TflStopSidebar, { SidebarItem } from "../components/TfL/TflStopSidebar";
import ScheduleForm, { NewScheduleForm } from "../components/schedules/ScheduleForm";
import SchedulesList, { SchedulesData } from "../components/schedules/SchedulesList";
import SaveActions from "../components/schedules/SaveActions";
import { Schedule } from "../components/schedules/ScheduleItem";
import { APP_CONSTANTS } from "../constants/app";
import { useFetch } from "../hooks/useFetch";
import { useMutation } from "../hooks/useMutation";

export default function Schedules() {
  // Use useFetch hook for loading schedules
  const {
    data: fetchedSchedules,
    loading,
    error,
  } = useFetch<SchedulesData>(APP_CONSTANTS.API_ENDPOINTS.SCHEDULES);

  // Use useMutation hook for saving schedules
  const saveSchedulesMutation = useMutation<{ status: string }, SchedulesData>(
    APP_CONSTANTS.API_ENDPOINTS.SCHEDULES,
    {
      onSuccess: (data) => {
        console.log("Schedules saved successfully:", data);
        setSaveSuccess(true);
        // Update the saved snapshot to current schedules
        setSavedSnapshot(schedules);
        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      },
      onError: (error) => {
        console.error("Failed to save schedules:", error);
      },
    },
  );

  // Local state for form and UI
  const [schedules, setSchedules] = useState<SchedulesData>({
    schedules: [],
  });
  const [savedSnapshot, setSavedSnapshot] = useState<SchedulesData>({
    schedules: [],
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit mode state - track which schedule is being edited
  const [editingScheduleIndex, setEditingScheduleIndex] = useState<number | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // Initialize schedules and saved snapshot when fetched data arrives
  if (fetchedSchedules && schedules.schedules.length === 0) {
    setSchedules(fetchedSchedules);
    setSavedSnapshot(fetchedSchedules);
  }

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    // Compare current schedules with saved snapshot (what was last saved successfully)
    return JSON.stringify(schedules) !== JSON.stringify(savedSnapshot);
  }, [schedules, savedSnapshot]);

  const [newSchedule, setNewSchedule] = useState<NewScheduleForm>({
    type: "rail_departure",
    day_of_week: "",
    time: "",
    from_station_name: "",
    from_station_code: "",
    to_station_name: "",
    to_station_code: "",
    from_name: "",
    from_code: "",
    to_name: "",
    to_code: "",
  });

  // Sidebar state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSidebarItem, setSelectedSidebarItem] =
    useState<SidebarItem | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
    setNewSchedule({ ...newSchedule, [e.target.name]: e.target.value });
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous validation errors
    setValidationError(null);

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (newSchedule.time && !timeRegex.test(newSchedule.time)) {
      setValidationError(
        "Please enter time in valid 24-hour format (HH:MM, e.g., 08:30 or 14:15)",
      );
      return;
    }

    // Validate at least one day is selected
    if (!newSchedule.day_of_week) {
      setValidationError("Please select at least one day of the week");
      return;
    }

    let schedule: Schedule;

    if (newSchedule.type === "rail_departure") {
      const missingFields = [];
      if (!newSchedule.from_station_name)
        missingFields.push("From Station Name");
      if (!newSchedule.from_station_code)
        missingFields.push("From Station Code");
      if (!newSchedule.to_station_name) missingFields.push("To Station Name");
      if (!newSchedule.to_station_code) missingFields.push("To Station Code");
      if (!newSchedule.time) missingFields.push("Time");

      if (missingFields.length > 0) {
        setValidationError(
          `Please fill in the following required fields: ${missingFields.join(", ")}`,
        );
        return;
      }
      schedule = {
        type: "rail_departure",
        day_of_week: newSchedule.day_of_week,
        time: newSchedule.time,
        from_station_name: newSchedule.from_station_name,
        from_station_code: newSchedule.from_station_code,
        to_station_name: newSchedule.to_station_name,
        to_station_code: newSchedule.to_station_code,
      };
    } else if (newSchedule.type === "tube_line_status") {
      if (!newSchedule.time) {
        setValidationError("Please enter a time");
        return;
      }
      schedule = {
        type: "tube_line_status",
        day_of_week: newSchedule.day_of_week,
        time: newSchedule.time,
      };
    } else {
      const missingFields = [];
      if (!newSchedule.from_name) missingFields.push("From Place Name");
      if (!newSchedule.from_code) missingFields.push("From Code");
      if (!newSchedule.to_name) missingFields.push("To Place Name");
      if (!newSchedule.to_code) missingFields.push("To Code");
      if (!newSchedule.time) missingFields.push("Time");

      if (missingFields.length > 0) {
        setValidationError(
          `Please fill in the following required fields: ${missingFields.join(", ")}`,
        );
        return;
      }
      schedule = {
        type: "best_route",
        day_of_week: newSchedule.day_of_week,
        time: newSchedule.time,
        from_name: newSchedule.from_name,
        from_code: newSchedule.from_code,
        to_name: newSchedule.to_name,
        to_code: newSchedule.to_code,
      };
    }

    setSchedules({
      schedules: [...schedules.schedules, schedule],
    });

    // Clear any previous error messages
    setValidationError(null);

    // Reset form
    setNewSchedule({
      type: "rail_departure",
      day_of_week: "",
      time: "",
      from_station_name: "",
      from_station_code: "",
      to_station_name: "",
      to_station_code: "",
      from_name: "",
      from_code: "",
      to_name: "",
      to_code: "",
    });
  };

  const handleRemoveSchedule = (index: number) => {
    // If we're editing a schedule, cancel the edit first
    if (editingScheduleIndex !== null) {
      if (editingScheduleIndex === index) {
        // Removing the schedule we're editing
        handleCancelEdit();
      } else if (editingScheduleIndex > index) {
        // Adjust the editing index if we're removing a schedule before the one being edited
        setEditingScheduleIndex(editingScheduleIndex - 1);
      }
    }
    
    const updatedSchedules = [...schedules.schedules];
    updatedSchedules.splice(index, 1);
    setSchedules({ schedules: updatedSchedules });
  };

  const handleSave = async () => {
    // Cancel any ongoing edits
    if (editingScheduleIndex !== null) {
      handleCancelEdit();
    }
    
    // Clear validation errors since we're saving existing schedules
    setValidationError(null);
    setSaveSuccess(false);

    console.log("Attempting to save schedules:", schedules);

    try {
      // Use current schedules
      await saveSchedulesMutation.mutate(schedules);
    } catch (err) {
      // Error handling is done by the useMutation hook
      console.error("Save failed:", err);
    }
  };

  const handleDayCheckbox = (days: string) => {
    // Clear validation error when user selects days
    if (validationError) {
      setValidationError(null);
    }
    setNewSchedule({ ...newSchedule, day_of_week: days });
  };

  // Edit mode functions
  const handleEditSchedule = (index: number) => {
    setEditingScheduleIndex(index);
    setEditingSchedule({ ...schedules.schedules[index] });
    setValidationError(null);
  };

  const handleCancelEdit = () => {
    setEditingScheduleIndex(null);
    setEditingSchedule(null);
    setValidationError(null);
  };

  const handleEditingTimeChange = (time: string) => {
    if (editingSchedule) {
      setEditingSchedule({ ...editingSchedule, time });
    }
  };

  const handleEditingDayCheckbox = (days: string) => {
    if (!editingSchedule) return;

    // Clear validation error when user selects days
    if (validationError) {
      setValidationError(null);
    }

    setEditingSchedule({ ...editingSchedule, day_of_week: days });
  };

  const handleSaveEdit = () => {
    if (!editingSchedule || editingScheduleIndex === null) return;

    // Clear any previous validation errors
    setValidationError(null);

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (editingSchedule.time && !timeRegex.test(editingSchedule.time)) {
      setValidationError(
        "Please enter time in valid 24-hour format (HH:MM, e.g., 08:30 or 14:15)",
      );
      return;
    }

    // Validate at least one day is selected
    if (!editingSchedule.day_of_week) {
      setValidationError("Please select at least one day of the week");
      return;
    }

    // Update the schedule in the list
    const updatedSchedules = [...schedules.schedules];
    updatedSchedules[editingScheduleIndex] = editingSchedule;
    setSchedules({ schedules: updatedSchedules });

    // Clear edit state
    setEditingScheduleIndex(null);
    setEditingSchedule(null);
  };

  if (loading)
    return (
      <PageLayout title="SCHEDULES">
        <Loading message="Loading schedules..." />
      </PageLayout>
    );
  // Only show error page for critical errors (loading), not validation errors or save errors
  if (error)
    return (
      <PageLayout title="SCHEDULES">
        <ErrorDisplay message={error} />
      </PageLayout>
    );

  return (
    <PageLayout title="SCHEDULES" showNavigation={true}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <TflStopSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedSidebarItem={selectedSidebarItem}
              setSelectedSidebarItem={setSelectedSidebarItem}
            />
            {selectedSidebarItem && (
              <div className="mt-4">
                <PlaceDetails
                  selectedSidebarItem={selectedSidebarItem}
                  showButtons={false}
                />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-8">
            {/* Add New Schedule */}
            <ScheduleForm
              newSchedule={newSchedule}
              validationError={!editingScheduleIndex ? validationError : null}
              onChange={handleInputChange}
              onDaysChange={handleDayCheckbox}
              onSubmit={handleAddSchedule}
            />

            {/* Current Schedules */}
            <SchedulesList
              schedules={schedules}
              editingScheduleIndex={editingScheduleIndex}
              editingSchedule={editingSchedule}
              validationError={editingScheduleIndex !== null ? validationError : null}
              onEditSchedule={handleEditSchedule}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onRemoveSchedule={handleRemoveSchedule}
              onTimeChange={handleEditingTimeChange}
              onDaysChange={handleEditingDayCheckbox}
              disabled={editingScheduleIndex !== null || saveSchedulesMutation.loading}
            />

            {/* Actions */}
            <SaveActions
              saveSuccess={saveSuccess}
              saveError={saveSchedulesMutation.error}
              hasUnsavedChanges={hasUnsavedChanges}
              isLoading={saveSchedulesMutation.loading}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
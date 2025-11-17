import { useMemo } from "react";
import { FrontEndLineStatusesSchema } from "../../validators/frontend-validators/LineStatusSchema";
import { APP_CONSTANTS } from "../../constants/app";
import { useFetch } from "../../hooks/useFetch";
import TflLineStatusList from "../../components/TfL/TflLineStatusList";
import SectionHeading from "../../components/text/SectionHeading";

type TflLineStatusType = {
  name: string;
  status: string;
  statusSeverity: number;
};

export default function TflLineStatus() {
  const {
    data: rawStatuses,
    loading: tflLoading,
    error: tflError,
  } = useFetch<TflLineStatusType[]>(APP_CONSTANTS.API_ENDPOINTS.LINE_STATUS);

  const tflStatuses = useMemo(() => {
    if (!rawStatuses) return null;
    return FrontEndLineStatusesSchema.parse(rawStatuses);
  }, [rawStatuses]);

  return (
    <section
      className="bg-[#23262f] rounded-[12px] p-6 text-[#f1f1f1] shadow-[0_2px_12px_0_rgba(0,0,0,0.25)]"
      aria-label="TFL Line Status Section"
      role="region"
    >
      <SectionHeading
        className="text-white"
        ariaLabel="TFL Line Status Heading"
      >
        TFL Line Status
      </SectionHeading>
      {tflLoading && (
        <div role="status" aria-label="Loading TFL line statuses">
          Loading TFL line statuses...
        </div>
      )}
      {tflError && (
        <div
          className="text-[#ff4d4f] bg-[#2a1a1a] p-2 rounded mb-2"
          role="alert"
          aria-label="TFL line status error"
        >
          {tflError}
        </div>
      )}
      {tflStatuses && <TflLineStatusList tflStatuses={tflStatuses} />}
    </section>
  );
}

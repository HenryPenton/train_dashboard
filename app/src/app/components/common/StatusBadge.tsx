import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  getSeverityBorderColor,
  getSeverityTextColor,
} from "../../utils/colorMappings";

type StatusBadgeProps = {
  status: string;
  severity: number;
  reason?: string | null;
};

export default function StatusBadge({
  status,
  severity,
  reason,
}: StatusBadgeProps) {
  const statusText = status || "Unknown";
  const hasReason = (reason?.trim().length ?? 0) > 0;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    if (hasReason) {
      setIsModalOpen(true);
    }
  }, [hasReason]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (hasReason && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        openModal();
      }
    },
    [hasReason, openModal],
  );

  // Handle Escape key to close modal and body scroll lock
  useEffect(() => {
    if (!isModalOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isModalOpen, closeModal]);

  return (
    <>
      <div
        className={`text-sm font-semibold px-3 py-1 rounded-full border ${getSeverityBorderColor(severity)}/50 ${getSeverityTextColor(severity)} ${hasReason ? "cursor-pointer active:scale-95 transition-transform" : ""}`}
        role="status"
        aria-label={`Service status: ${statusText}, severity level ${severity}${hasReason ? `. Tap for details` : ""}`}
        title={hasReason ? reason : undefined}
        onClick={hasReason ? openModal : undefined}
        tabIndex={hasReason ? 0 : undefined}
        onKeyDown={hasReason ? handleKeyDown : undefined}
      >
        {statusText}
      </div>

      {/* Modal for mobile-friendly reason display - rendered via portal */}
      {hasReason &&
        isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-modal-title"
          >
            <div
              className="bg-[#2a2d35] border border-gray-600 rounded-xl shadow-2xl max-w-md w-full p-5 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-3">
                <h2
                  id="status-modal-title"
                  className={`text-lg font-bold ${getSeverityTextColor(severity)}`}
                >
                  {statusText}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{reason}</p>
              <button
                type="button"
                onClick={closeModal}
                className="mt-4 w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

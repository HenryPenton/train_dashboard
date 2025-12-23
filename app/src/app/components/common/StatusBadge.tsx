import { useState, useEffect, useCallback, useRef } from "react";
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

function useModal(hasReason: boolean, badgeRef: React.RefObject<HTMLDivElement | null>) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(() => {
    if (hasReason) setIsOpen(true);
  }, [hasReason]);

  const close = useCallback(() => setIsOpen(false), []);

  const handleBadgeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (hasReason && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        open();
      }
    },
    [hasReason, open],
  );

  useEffect(() => {
    if (!isOpen) return;

    const badgeElement = badgeRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      badgeElement?.focus();
    };
  }, [isOpen, close, badgeRef]);

  return { isOpen, open, close, modalRef, closeButtonRef, handleBadgeKeyDown };
}

function CloseIcon() {
  return (
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
  );
}

type StatusModalProps = {
  statusText: string;
  severity: number;
  reason: string;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement | null>;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
};

function StatusModal({
  statusText,
  severity,
  reason,
  onClose,
  modalRef,
  closeButtonRef,
}: StatusModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-modal-title"
    >
      <div
        ref={modalRef}
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
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{reason}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default function StatusBadge({
  status,
  severity,
  reason,
}: StatusBadgeProps) {
  const statusText = status || "Unknown";
  const hasReason = (reason?.trim().length ?? 0) > 0;
  const badgeRef = useRef<HTMLDivElement>(null);

  const { isOpen, open, close, modalRef, closeButtonRef, handleBadgeKeyDown } =
    useModal(hasReason, badgeRef);

  const badgeClassName = `text-sm font-semibold px-3 py-1 rounded-full border ${getSeverityBorderColor(severity)}/50 ${getSeverityTextColor(severity)} ${hasReason ? "cursor-pointer active:scale-95 transition-transform" : ""}`;

  const ariaLabel = `Service status: ${statusText}, severity level ${severity}${hasReason ? ". Tap for details" : ""}`;

  return (
    <>
      <div
        ref={badgeRef}
        className={badgeClassName}
        role="status"
        aria-label={ariaLabel}
        title={hasReason ? reason ?? undefined : undefined}
        onClick={hasReason ? open : undefined}
        tabIndex={hasReason ? 0 : undefined}
        onKeyDown={hasReason ? handleBadgeKeyDown : undefined}
      >
        {statusText}
      </div>

      {hasReason && isOpen && (
        <StatusModal
          statusText={statusText}
          severity={severity}
          reason={reason!}
          onClose={close}
          modalRef={modalRef}
          closeButtonRef={closeButtonRef}
        />
      )}
    </>
  );
}

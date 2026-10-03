import { useEffect, useState } from "react";
import { useUi } from "@/components/layout/UiContext";
import { cx } from "@/lib/format";

/**
 * Bottom-right toast that slides in from the right edge.
 * Sits above the mobile dock (96px) and 28px from the bottom on desktop.
 */
export function Toast() {
  const { toastMessage } = useUi();
  const [shown, setShown] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setShown(toastMessage);
      setLeaving(false);
      return;
    }
    if (!shown) return;
    setLeaving(true);
    const id = window.setTimeout(() => setShown(null), 200);
    return () => window.clearTimeout(id);
  }, [toastMessage, shown]);

  if (!shown) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[9999] flex justify-end px-4 md:bottom-7 md:px-6" role="status" aria-live="polite">
      <div className={cx("control-3d pointer-events-auto max-w-sm rounded-[12px] px-4 py-3 text-[13px] font-medium text-text-hi shadow-2xl", leaving ? "animate-toast-exit" : "animate-toast-enter")}>{shown}</div>
    </div>
  );
}

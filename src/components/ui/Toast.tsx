import { useUi } from "@/components/layout/UiContext";

export function Toast() {
  const { toastMessage } = useUi();
  if (!toastMessage) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center md:bottom-8" role="status" aria-live="polite">
      <div className="control-3d animate-fade-in rounded-full px-4 py-2 text-[13px] font-medium text-text-hi shadow-lg">{toastMessage}</div>
    </div>
  );
}

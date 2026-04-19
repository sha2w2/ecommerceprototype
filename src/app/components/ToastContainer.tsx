import { useApp, ToastItem } from '../store/AppContext';

export function ToastContainer() {
  const { state } = useApp();

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2.5 pointer-events-none"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      {state.toasts.map(toast => (
        <ToastMessage key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastMessage({ toast }: { toast: ToastItem }) {
  const { showToast: _showToast } = useApp();

  return (
    <div
      className={`flex items-center gap-3 bg-[#0a0a0a] text-[#fafafa] px-5 py-3.5 rounded-sm shadow-2xl min-w-[300px] max-w-sm pointer-events-auto ${
        toast.exiting ? 'toast-exit' : 'toast-enter'
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}
      role="status"
    >
      {/* Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-4 h-4 shrink-0"
        style={{ color: '#6b6b6b' }}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>

      <span className="flex-1" style={{ color: '#e8e8e8' }}>{toast.message}</span>

      {toast.action && (
        <button
          onClick={() => {
            toast.action!.onClick();
          }}
          className="ml-auto shrink-0 underline underline-offset-2 hover:no-underline transition-all"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: '#fafafa',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label={`${toast.action.label}: ${toast.message}`}
        >
          {toast.action.label}
        </button>
      )}
    </div>
  );
}
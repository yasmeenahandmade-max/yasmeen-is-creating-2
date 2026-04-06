'use client';

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-charcoal/30 animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-brand shadow-elevated p-6 max-w-sm w-full animate-slide-up">
        <h3 className="text-base font-semibold text-brand-charcoal mb-2 font-body">
          {title}
        </h3>
        <p className="text-sm text-brand-charcoal/60 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium tracking-wider uppercase text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={
              variant === 'danger'
                ? 'px-5 py-2 text-xs font-medium tracking-wider uppercase bg-red-500 text-white rounded-brand hover:bg-red-600 transition-colors'
                : 'btn-primary text-xs'
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

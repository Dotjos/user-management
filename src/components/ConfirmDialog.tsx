import React from 'react';
import { AlertTriangle, AlertOctagon, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: AlertOctagon,
          iconBg: 'bg-rose-50 text-rose-600',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500/20'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-amber-50 text-amber-600',
          btnBg: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500/20'
        };
      case 'primary':
      default:
        return {
          icon: AlertTriangle,
          iconBg: 'bg-blue-50 text-blue-600',
          btnBg: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/20'
        };
    }
  };

  const { icon: Icon, iconBg, btnBg } = getVariantStyles();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-150 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{message}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 cursor-pointer ${btnBg} disabled:opacity-60`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

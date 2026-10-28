import React from 'react';
import { UserStatus } from '../types/user';
import { CheckCircle2, ShieldAlert, MinusCircle, X, Layers } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onBulkUpdateStatus: (status: UserStatus) => void;
  onClearSelection: () => void;
  isMutating?: boolean;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onBulkUpdateStatus,
  onClearSelection,
  isMutating = false
}) => {
  if (selectedCount === 0) return null;

  return (
    <aside
      aria-label="Bulk actions toolbar"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 py-2.5 bg-gray-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-gray-800">
        <div className="flex items-center gap-2 pr-2 border-r border-gray-700/80">
          <Layers className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-xs font-semibold whitespace-nowrap">
            {selectedCount} {selectedCount === 1 ? 'user' : 'users'} selected
          </span>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={isMutating}
            onClick={() => onBulkUpdateStatus('Active')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Set Active</span>
          </button>

          <button
            type="button"
            disabled={isMutating}
            onClick={() => onBulkUpdateStatus('Suspended')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Suspend</span>
          </button>

          <button
            type="button"
            disabled={isMutating}
            onClick={() => onBulkUpdateStatus('Inactive')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-700/80 text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <MinusCircle className="w-3.5 h-3.5" />
            <span>Set Inactive</span>
          </button>
        </div>

        {/* Clear selection */}
        <button
          type="button"
          onClick={onClearSelection}
          className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors ml-1 cursor-pointer"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { UserStatus } from '../types/user';
import { StatusBadge } from './StatusBadge';
import { ChevronDown, Check } from 'lucide-react';

interface StatusSelectDropdownProps {
  currentStatus: UserStatus;
  onSelectStatus: (newStatus: UserStatus) => void;
  disabled?: boolean;
}

const ALL_STATUSES: { status: UserStatus; label: string; desc: string }[] = [
  { status: 'Active', label: 'Active', desc: 'Full account access & permissions' },
  { status: 'Pending', label: 'Pending', desc: 'Invited or awaiting verification' },
  { status: 'Suspended', label: 'Suspended', desc: 'Temporarily blocked from access' },
  { status: 'Inactive', label: 'Inactive', desc: 'Deactivated or offboarded' }
];

export const StatusSelectDropdown: React.FC<StatusSelectDropdownProps> = ({
  currentStatus,
  onSelectStatus,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (status: UserStatus) => {
    if (status !== currentStatus) {
      onSelectStatus(status);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`group inline-flex items-center gap-1.5 p-1 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
        }`}
        title="Click to change account status"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <StatusBadge status={currentStatus} />
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-transform duration-200" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute left-0 mt-1.5 w-60 rounded-xl bg-white p-1.5 shadow-xl border border-gray-100 ring-1 ring-black/5 z-30 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
            Change Account Status
          </div>
          {ALL_STATUSES.map((item) => {
            const isSelected = item.status === currentStatus;
            return (
              <button
                key={item.status}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(item.status)}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-start gap-2.5 transition-colors ${
                  isSelected ? 'bg-blue-50/70' : 'hover:bg-gray-50'
                }`}
              >
                <div className="mt-0.5">
                  <StatusBadge status={item.status} size="sm" showIcon={false} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800 flex items-center justify-between">
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5 truncate">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

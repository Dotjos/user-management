import React from 'react';
import { UserStatus } from '../types/user';
import { CheckCircle2, MinusCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: UserStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Active':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
          icon: CheckCircle2
        };
      case 'Inactive':
      default:
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          icon: MinusCircle
        };
    }
  };

  const config = getStatusStyles();
  const IconComponent = config.icon;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      data-testid="status-badge"
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0 opacity-80" />}
      <span>{status}</span>
    </span>
  );
};

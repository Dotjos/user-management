import React from 'react';
import { UserStats, UserStatus } from '../types/user';
import { Users, UserCheck, Clock, ShieldAlert } from 'lucide-react';

interface StatsCardsProps {
  stats: UserStats;
  currentFilter: 'All' | UserStatus;
  onSelectFilter: (status: 'All' | UserStatus) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  currentFilter,
  onSelectFilter
}) => {
  const cards: {
    id: 'All' | UserStatus;
    title: string;
    count: number;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    borderHover: string;
    activeRing: string;
  }[] = [
    {
      id: 'All',
      title: 'Total Users',
      count: stats.total,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderHover: 'hover:border-blue-300',
      activeRing: 'border-blue-500 ring-2 ring-blue-500/10 bg-blue-50/20'
    },
    {
      id: 'Active',
      title: 'Active Accounts',
      count: stats.active,
      icon: UserCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderHover: 'hover:border-emerald-300',
      activeRing: 'border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/20'
    },
    {
      id: 'Pending',
      title: 'Pending Verification',
      count: stats.pending,
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderHover: 'hover:border-amber-300',
      activeRing: 'border-amber-500 ring-2 ring-amber-500/10 bg-amber-50/20'
    },
    {
      id: 'Suspended',
      title: 'Suspended Users',
      count: stats.suspended,
      icon: ShieldAlert,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      borderHover: 'hover:border-rose-300',
      activeRing: 'border-rose-500 ring-2 ring-rose-500/10 bg-rose-50/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = currentFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={`flex items-center gap-4 p-4 rounded-xl border bg-white text-left transition-all duration-150 cursor-pointer shadow-sm hover:shadow ${
              card.borderHover
            } ${isSelected ? card.activeRing : 'border-gray-200/80'}`}
          >
            <div className={`p-3 rounded-xl shrink-0 ${card.iconBg}`}>
              <Icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
                {card.title}
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  {card.count}
                </span>
                {card.id !== 'All' && stats.total > 0 && (
                  <span className="text-xs text-gray-400 font-normal">
                    ({Math.round((card.count / stats.total) * 100)}%)
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

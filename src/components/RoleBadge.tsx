import React from 'react';
import { UserRole } from '../types/user';
import { ShieldCheck, Briefcase, Code2, Palette, Headphones, Sparkles } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getRoleConfig = () => {
    const r = (role || '').toLowerCase();

    if (r.includes('chief') || r.includes('lead') || r.includes('senior') || r.includes('admin') || r.includes('director')) {
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
        icon: ShieldCheck
      };
    }
    if (r.includes('creative') || r.includes('designer') || r.includes('usability')) {
      return {
        bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/70',
        icon: Palette
      };
    }
    if (r.includes('web') || r.includes('orchestrator') || r.includes('developer') || r.includes('engineer')) {
      return {
        bg: 'bg-sky-50 text-sky-700 border-sky-200/70',
        icon: Code2
      };
    }
    if (r.includes('quality') || r.includes('response') || r.includes('support') || r.includes('agent')) {
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200/70',
        icon: Headphones
      };
    }
    if (r.includes('strategist') || r.includes('manager') || r.includes('officer') || r.includes('representative')) {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200/70',
        icon: Briefcase
      };
    }

    return {
      bg: 'bg-slate-50 text-slate-700 border-slate-200/80',
      icon: Sparkles
    };
  };

  const { bg, icon: Icon } = getRoleConfig();

  return (
    <span
      title={role}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border max-w-[200px] truncate ${bg}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{role}</span>
    </span>
  );
};

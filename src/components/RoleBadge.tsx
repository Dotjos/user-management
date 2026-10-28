import React from 'react';
import { UserRole } from '../types/user';
import { ShieldCheck, Briefcase, Code2, Palette, Headphones } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getRoleConfig = () => {
    switch (role) {
      case 'Admin':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
          icon: ShieldCheck
        };
      case 'Manager':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200/70',
          icon: Briefcase
        };
      case 'Developer':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200/70',
          icon: Code2
        };
      case 'Designer':
        return {
          bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/70',
          icon: Palette
        };
      case 'Support':
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/70',
          icon: Headphones
        };
    }
  };

  const { bg, icon: Icon } = getRoleConfig();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${bg}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{role}</span>
    </span>
  );
};

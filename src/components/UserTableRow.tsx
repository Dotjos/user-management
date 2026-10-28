import React, { useState } from 'react';
import { User, UserStatus } from '../types/user';
import { RoleBadge } from './RoleBadge';
import { StatusSelectDropdown } from './StatusSelectDropdown';
import { Edit2, Trash2, MapPin, Building } from 'lucide-react';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onUpdateStatus: (id: string, status: UserStatus) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onRequestStatusChangeConfirm?: (user: User, newStatus: UserStatus) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  onToggleSelect,
  onUpdateStatus,
  onEditUser,
  onDeleteUser,
  onRequestStatusChangeConfirm
}) => {
  const [imageError, setImageError] = useState(false);

  // Format short date
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  // Format relative last active
  const formatLastActive = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 5) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return formatDate(isoString);
    } catch {
      return isoString;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleStatusSelect = (newStatus: UserStatus) => {
    // If setting to Suspended, optionally prompt confirmation to avoid accidental lockout
    if (newStatus === 'Suspended' && onRequestStatusChangeConfirm) {
      onRequestStatusChangeConfirm(user, newStatus);
    } else {
      onUpdateStatus(user.id, newStatus);
    }
  };

  return (
    <>
      {/* Desktop / Tablet Table Row */}
      <tr
        className={`group border-b border-gray-100 transition-colors hover:bg-gray-50/70 hidden sm:table-row ${
          isSelected ? 'bg-blue-50/30' : ''
        }`}
      >
        {/* Checkbox Column */}
        <td className="w-12 px-4 py-3.5 text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(user.id)}
            aria-label={`Select ${user.name}`}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
          />
        </td>

        {/* User Info (Avatar, Name, Email) */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-200/60 shrink-0 flex items-center justify-center font-semibold text-xs text-gray-600 shadow-sm">
              {!imageError ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{getInitials(user.name)}</span>
              )}
            </div>
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onEditUser(user)}
                className="font-semibold text-sm text-gray-900 hover:text-blue-600 text-left truncate block transition-colors cursor-pointer"
              >
                {user.name}
              </button>
              <span className="text-xs text-gray-500 block truncate">{user.email}</span>
            </div>
          </div>
        </td>

        {/* Role Column */}
        <td className="px-4 py-3.5 whitespace-nowrap">
          <RoleBadge role={user.role} />
        </td>

        {/* Status Column with Inline Selector */}
        <td className="px-4 py-3.5 whitespace-nowrap">
          <StatusSelectDropdown
            currentStatus={user.status}
            onSelectStatus={handleStatusSelect}
          />
        </td>

        {/* Department & Location */}
        <td className="px-4 py-3.5 whitespace-nowrap">
          <div className="text-xs text-gray-800 font-medium flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{user.department}</span>
          </div>
          <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="truncate max-w-[120px]">{user.location}</span>
          </div>
        </td>

        {/* Last Active */}
        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-600">
          <div>{formatLastActive(user.lastActiveAt)}</div>
          <div className="text-[11px] text-gray-400">Joined {formatDate(user.createdAt)}</div>
        </td>

        {/* Actions Column */}
        <td className="px-4 py-3.5 whitespace-nowrap text-right text-xs">
          <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEditUser(user)}
              title="Edit user details"
              aria-label={`Edit ${user.name}`}
              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteUser(user.id)}
              title="Remove user"
              aria-label={`Delete ${user.name}`}
              className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile Card Layout (sm:hidden) */}
      <tr className="sm:hidden block border-b border-gray-100">
        <td colSpan={7} className="block p-4">
          <div className={`p-4 rounded-xl border bg-white shadow-sm space-y-3 ${
            isSelected ? 'border-blue-300 ring-2 ring-blue-500/10 bg-blue-50/20' : 'border-gray-200/80'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(user.id)}
                  aria-label={`Select ${user.name}`}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                />
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center font-semibold text-xs text-gray-600">
                  {!imageError ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(user.name)}</span>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => onEditUser(user)}
                    className="font-semibold text-sm text-gray-900 hover:text-blue-600 text-left"
                  >
                    {user.name}
                  </button>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Status Selector on mobile */}
              <StatusSelectDropdown
                currentStatus={user.status}
                onSelectStatus={handleStatusSelect}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-2">
                <RoleBadge role={user.role} />
                <span className="text-gray-500">{user.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEditUser(user)}
                  className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteUser(user.id)}
                  className="p-1 text-gray-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

import React from 'react';
import { User, UserStatus } from '../types/user';
import { RoleBadge } from './RoleBadge';
import { StatusSelectDropdown } from './StatusSelectDropdown';
import { Edit2, Trash2 } from 'lucide-react';

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
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleStatusSelect = (newStatus: UserStatus) => {
    if (newStatus === 'Inactive' && onRequestStatusChangeConfirm) {
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
        {/* Checkbox */}
        <td className="w-12 px-4 py-3.5 text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(user.id)}
            aria-label={`Select ${user.name}`}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
          />
        </td>

        {/* ID */}
        <td className="w-16 px-4 py-3.5 whitespace-nowrap text-xs font-mono font-medium text-gray-500">
          #{user.id}
        </td>

        {/* User Name */}
        <td className="px-4 py-3.5 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              {getInitials(user.name)}
            </div>
            <button
              type="button"
              onClick={() => onEditUser(user)}
              className="font-semibold text-sm text-gray-900 hover:text-blue-600 text-left transition-colors cursor-pointer"
            >
              {user.name}
            </button>
          </div>
        </td>

        {/* Email */}
        <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-600">
          <a
            href={`mailto:${user.email}`}
            className="hover:text-blue-600 transition-colors"
          >
            {user.email}
          </a>
        </td>

        {/* Role */}
        <td className="px-4 py-3.5 whitespace-nowrap">
          <RoleBadge role={user.role} />
        </td>

        {/* Status */}
        <td className="px-4 py-3.5 whitespace-nowrap">
          <StatusSelectDropdown
            currentStatus={user.status}
            onSelectStatus={handleStatusSelect}
          />
        </td>

        {/* Actions */}
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
          <div
            className={`p-4 rounded-xl border bg-white shadow-sm space-y-3 ${
              isSelected ? 'border-blue-300 ring-2 ring-blue-500/10 bg-blue-50/20' : 'border-gray-200/80'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(user.id)}
                  aria-label={`Select ${user.name}`}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                />
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {getInitials(user.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-gray-400">#{user.id}</span>
                    <button
                      type="button"
                      onClick={() => onEditUser(user)}
                      className="font-semibold text-sm text-gray-900 hover:text-blue-600 text-left"
                    >
                      {user.name}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Status Selector */}
              <StatusSelectDropdown
                currentStatus={user.status}
                onSelectStatus={handleStatusSelect}
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
              <RoleBadge role={user.role} />
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

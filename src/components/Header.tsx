import React from 'react';
import { Users2, UserPlus, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onAddUser: () => void;
  onResetData: () => void;
  isBackendConnected: boolean;
  totalUsersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onAddUser,
  onResetData,
  isBackendConnected,
  totalUsersCount
}) => {
  return (
    <header className="border-b border-gray-200/80 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  User Management
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isBackendConnected ? 'Backend Connected' : 'Connecting...'}</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                View, filter, and manage user accounts and security statuses ({totalUsersCount} registered)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onResetData}
              title="Reset dataset to initial state"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200/80 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              type="button"
              onClick={onAddUser}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

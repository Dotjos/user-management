import React, { useState, useEffect } from 'react';
import { User, UserStatus, UpdateUserInput } from '../types/user';
import { StatusBadge } from './StatusBadge';
import { X, Save, ShieldCheck, Mail, User as UserIcon } from 'lucide-react';

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, input: UpdateUserInput) => Promise<boolean>;
  isMutating?: boolean;
}

const STATUSES: { status: UserStatus; desc: string }[] = [
  { status: 'Active', desc: 'Account is active and operational' },
  { status: 'Inactive', desc: 'Account is deactivated' }
];

export const UserModal: React.FC<UserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  isMutating = false
}) => {
  const [formData, setFormData] = useState<UpdateUserInput>({});
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>('Active');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role
      });
      setSelectedStatus(user.status);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSave(user.id, {
      ...formData,
      status: selectedStatus
    });
    if (success) {
      onClose();
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
              {getInitials(user.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-gray-400">#{user.id}</span>
                <h3 className="text-base font-bold text-gray-900">{user.name}</h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Status Selection Pill Box */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Account Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map(({ status, desc }) => {
                const isCurrent = selectedStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <StatusBadge status={status} size="sm" showIcon={false} />
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 mt-1 leading-tight">{desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields matching { name, email, role } */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role / Job Title</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Senior Mobility Orchestrator"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isMutating}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isMutating}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isMutating ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

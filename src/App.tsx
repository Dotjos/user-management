import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { useUsers } from './hooks/useUsers';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { UserFilters } from './components/UserFilters';
import { UserTable } from './components/UserTable';
import { Pagination } from './components/Pagination';
import { BulkActionBar } from './components/BulkActionBar';
import { UserModal } from './components/UserModal';
import { AddUserModal } from './components/AddUserModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { User, UserStatus } from './types/user';

const DashboardContent: React.FC = () => {
  const {
    users,
    rawUsers,
    availableRoles,
    stats,
    isLoading,
    isMutating,
    error,
    filters,
    hasActiveFilters,
    setSearch,
    setStatusFilter,
    setRoleFilter,
    setSorting,
    resetFilters,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    isAllSelected,
    updateStatus,
    bulkUpdateStatus,
    createUser,
    updateUser,
    deleteUser,
    resetToDemo,
    refetch,
    pagination
  } = useUsers();

  // Modal states
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Confirmation dialog state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'primary';
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    variant: 'warning',
    action: () => {}
  });

  // Prompt confirmation when deactivating a user
  const handleRequestStatusChangeConfirm = (user: User, newStatus: UserStatus) => {
    if (newStatus === 'Inactive') {
      setConfirmState({
        isOpen: true,
        title: `Deactivate ${user.name}'s account?`,
        message: `Are you sure you want to set ${user.name}'s status to Inactive?`,
        confirmText: 'Deactivate',
        variant: 'warning',
        action: () => {
          updateStatus(user.id, 'Inactive');
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      });
    } else {
      updateStatus(user.id, newStatus);
    }
  };

  // Prompt confirmation for deleting a user
  const handleDeletePrompt = (userId: string) => {
    const user = rawUsers.find((u) => u.id === userId);
    setConfirmState({
      isOpen: true,
      title: `Remove ${user?.name || 'User'}?`,
      message: `Are you sure you want to delete ${user?.name || 'this user'}? This will remove them from the backend.`,
      confirmText: 'Delete User',
      variant: 'danger',
      action: () => {
        deleteUser(userId);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Prompt confirmation for bulk status change
  const handleBulkStatusChange = (status: UserStatus) => {
    if (status === 'Inactive') {
      setConfirmState({
        isOpen: true,
        title: `Deactivate ${selectedIds.size} accounts?`,
        message: `You are about to mark ${selectedIds.size} users as Inactive simultaneously.`,
        confirmText: 'Deactivate Selected',
        variant: 'warning',
        action: () => {
          bulkUpdateStatus('Inactive');
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      });
    } else {
      bulkUpdateStatus(status);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-gray-900 flex flex-col font-sans antialiased pb-24">
      {/* Top Header */}
      <Header
        onAddUser={() => setIsAddUserOpen(true)}
        onResetData={resetToDemo}
        isBackendConnected={!error}
        totalUsersCount={stats.total}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Metric Cards */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Account Statistics</h2>
          <StatsCards
            stats={stats}
            currentFilter={filters.status}
            onSelectFilter={(status) => setStatusFilter(status)}
          />
        </section>

        {/* Search & Filters */}
        <section aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only">Search & Filter Controls</h2>
          <UserFilters
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            totalFiltered={pagination.totalItems}
            totalRaw={stats.total}
            availableRoles={availableRoles}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
            onRoleChange={setRoleFilter}
            onSortChange={(field) => setSorting(field)}
            onSortOrderToggle={() => setSorting(filters.sortBy)}
            onResetFilters={resetFilters}
          />
        </section>

        {/* Table & Pagination */}
        <section aria-labelledby="users-heading" className="space-y-4">
          <h2 id="users-heading" className="sr-only">User Directory</h2>
          <UserTable
            users={users}
            isLoading={isLoading}
            error={error}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onToggleSelectAll={selectAll}
            onToggleSelect={toggleSelect}
            onSort={(field) => setSorting(field)}
            onUpdateStatus={updateStatus}
            onEditUser={(user) => setSelectedUserForEdit(user)}
            onDeleteUser={handleDeletePrompt}
            onRetry={refetch}
            onResetFilters={resetFilters}
            onRequestStatusChangeConfirm={handleRequestStatusChangeConfirm}
          />

          {/* Pagination Controls */}
          {!isLoading && !error && pagination.totalItems > 0 && (
            <Pagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              onPageChange={pagination.setPage}
              onPageSizeChange={pagination.setPageSize}
            />
          )}
        </section>
      </main>

      {/* Bulk Action Dock */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        onBulkUpdateStatus={handleBulkStatusChange}
        onClearSelection={clearSelection}
        isMutating={isMutating}
      />

      {/* Edit User Modal */}
      <UserModal
        user={selectedUserForEdit}
        isOpen={!!selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
        onSave={updateUser}
        isMutating={isMutating}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onCreate={createUser}
        isMutating={isMutating}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        variant={confirmState.variant}
        onConfirm={confirmState.action}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        isLoading={isMutating}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}

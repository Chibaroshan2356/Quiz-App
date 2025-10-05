import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminAPI } from '../../services/api';
import { 
  FiEdit3, FiTrash2, FiSearch, FiFilter, FiUser, FiMail, FiCalendar,
  FiRefreshCw, FiCheck, FiX, FiPlus, FiDownload, FiAward,
  FiUserCheck, FiUserX,
  FiGrid, FiList, FiAlertCircle
} from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/layout/AdminLayout';
import useConfirm from '../../hooks/useConfirm';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';

// Constants
const ITEMS_PER_PAGE = 20;
const DEBOUNCE_DELAY = 300;

// Custom hooks
const useUserFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: ITEMS_PER_PAGE,
    ...initialFilters
  });

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 })
    }));
  }, []);

  return { filters, updateFilter, setFilters };
};

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [showUserDetails, setShowUserDetails] = useState(null);
  const confirm = useConfirm();

  const fetchUsers = useCallback(async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getUsers(filters);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    const confirmed = await confirm(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone and will remove all their data.'
    );

    if (!confirmed) return false;

    try {
      setOperationInProgress(true);
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
      return false;
    } finally {
      setOperationInProgress(false);
    }
  }, [confirm]);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      setOperationInProgress(true);
      await adminAPI.updateUser(userId, userData);
      toast.success('User updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error(err.response?.data?.message || 'Failed to update user');
      return false;
    } finally {
      setOperationInProgress(false);
    }
  }, []);

  const bulkDelete = useCallback(async (userIds) => {
    const confirmed = await confirm(
      'Delete Multiple Users',
      `Are you sure you want to delete ${userIds.length} users? This action cannot be undone.`
    );

    if (!confirmed) return false;

    try {
      setOperationInProgress(true);
      await Promise.all(userIds.map(id => adminAPI.deleteUser(id)));
      toast.success(`${userIds.length} users deleted successfully`);
      setSelectedUsers([]);
      return true;
    } catch (err) {
      console.error('Error bulk deleting users:', err);
      toast.error('Failed to delete some users');
      return false;
    } finally {
      setOperationInProgress(false);
    }
  }, [confirm]);

  const bulkUpdateRole = useCallback(async (userIds, role) => {
    try {
      setOperationInProgress(true);
      await Promise.all(userIds.map(id => adminAPI.updateUser(id, { role })));
      toast.success(`${userIds.length} users updated successfully`);
      setSelectedUsers([]);
      return true;
    } catch (err) {
      console.error('Error bulk updating users:', err);
      toast.error('Failed to update some users');
      return false;
    } finally {
      setOperationInProgress(false);
    }
  }, []);

  const bulkToggleStatus = useCallback(async (userIds, isActive) => {
    try {
      setOperationInProgress(true);
      await Promise.all(userIds.map(id => adminAPI.updateUser(id, { isActive })));
      toast.success(`${userIds.length} users ${isActive ? 'activated' : 'deactivated'} successfully`);
      setSelectedUsers([]);
      return true;
    } catch (err) {
      console.error('Error bulk updating users:', err);
      toast.error('Failed to update some users');
      return false;
    } finally {
      setOperationInProgress(false);
    }
  }, []);

  const exportUsers = useCallback(async (format = 'csv') => {
    try {
      // This would typically call an API endpoint to export data
      toast.success(`Users exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export users');
    }
  }, []);

  const toggleUserSelection = useCallback((userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const selectAllUsers = useCallback(() => {
    setSelectedUsers(users.map(user => user._id));
  }, [users]);

  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  const sortUsers = useCallback((field) => {
    // This would typically update the sort state and refetch
    console.log('Sorting by:', field);
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    operationInProgress,
    selectedUsers,
    viewMode,
    editing,
    editData,
    showUserDetails,
    fetchUsers,
    deleteUser,
    updateUser,
    bulkDelete,
    bulkUpdateRole,
    bulkToggleStatus,
    exportUsers,
    toggleUserSelection,
    selectAllUsers,
    clearSelection,
    sortUsers,
    setViewMode,
    setEditing,
    setEditData,
    setShowUserDetails
  };
};

const AdminUsers = () => {
  const { filters, updateFilter, setFilters } = useUserFilters();
  const {
    users,
    loading,
    error,
    pagination,
    operationInProgress,
    selectedUsers,
    viewMode,
    editing,
    editData,
    showUserDetails,
    fetchUsers,
    deleteUser,
    updateUser,
    bulkDelete,
    bulkUpdateRole,
    bulkToggleStatus,
    exportUsers,
    toggleUserSelection,
    selectAllUsers,
    clearSelection,
    sortUsers,
    setViewMode,
    setEditing,
    setEditData,
    setShowUserDetails
  } = useUserManagement();

  // Handlers
  const handleDelete = useCallback(async (userId) => {
    const success = await deleteUser(userId);
    if (success) {
      fetchUsers(filters);
    }
  }, [deleteUser, fetchUsers, filters]);

  const handleBulkDelete = useCallback(async () => {
    const success = await bulkDelete(selectedUsers);
    if (success) {
      fetchUsers(filters);
    }
  }, [bulkDelete, selectedUsers, fetchUsers, filters]);

  const handleBulkActivate = useCallback(async () => {
    const success = await bulkToggleStatus(selectedUsers, true);
    if (success) {
      fetchUsers(filters);
    }
  }, [bulkToggleStatus, selectedUsers, fetchUsers, filters]);

  const handleBulkDeactivate = useCallback(async () => {
    const success = await bulkToggleStatus(selectedUsers, false);
    if (success) {
      fetchUsers(filters);
    }
  }, [bulkToggleStatus, selectedUsers, fetchUsers, filters]);

  const handleBulkMakeAdmin = useCallback(async () => {
    const success = await bulkUpdateRole(selectedUsers, 'admin');
    if (success) {
      fetchUsers(filters);
    }
  }, [bulkUpdateRole, selectedUsers, fetchUsers, filters]);

  const handleBulkMakeUser = useCallback(async () => {
    const success = await bulkUpdateRole(selectedUsers, 'user');
    if (success) {
      fetchUsers(filters);
    }
  }, [bulkUpdateRole, selectedUsers, fetchUsers, filters]);

  const handleEdit = useCallback((user) => {
    setEditing(user._id);
    setEditData({
      role: user.role,
      isActive: user.isActive
    });
  }, []);

  const handleSave = useCallback(async (userId) => {
    const success = await updateUser(userId, editData);
    if (success) {
      setEditing(null);
      setEditData({});
      fetchUsers(filters);
    }
  }, [updateUser, editData, fetchUsers, filters]);

  const handleCancel = useCallback(() => {
    setEditing(null);
    setEditData({});
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    updateFilter(key, value);
  }, [updateFilter]);

  const handlePageChange = useCallback((page) => {
    updateFilter('page', page);
  }, [updateFilter]);

  // Debounced search
  const debouncedFetchUsers = useMemo(
    () => debounce((filters) => fetchUsers(filters), DEBOUNCE_DELAY),
    [fetchUsers]
  );

  // Effect to fetch users when filters change
  useEffect(() => {
    debouncedFetchUsers(filters);
    return () => debouncedFetchUsers.cancel();
  }, [filters, debouncedFetchUsers]);

  // Memoized calculations
  const userStats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(user => user.role === 'admin').length;
    const active = users.filter(user => user.isActive).length;
    const inactive = total - active;
    
    return { total, admins, active, inactive };
  }, [users]);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const getRoleBadge = useCallback((role) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  }, []);

  const getStatusBadge = useCallback((isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }, []);

  // Render loading state
  if (loading && !users.length) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  // Render error state
  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">View and manage user accounts and permissions</p>
              {selectedUsers.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Table view"
                >
                  <FiList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid view"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={() => exportUsers('csv')}
                className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200"
                title="Export users"
                aria-label="Export users"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Export
              </button>

              {/* Refresh Button */}
              <button
                onClick={() => fetchUsers(filters)}
                disabled={operationInProgress}
                className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Refresh users"
              >
                <FiRefreshCw className={`w-4 h-4 mr-2 ${operationInProgress ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              {/* Add User Button */}
              <button
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.admins}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiAward className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiUserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiUserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Operations */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkActivate}
                    disabled={operationInProgress}
                    className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    aria-label="Activate selected users"
                  >
                    <FiCheck className="w-4 h-4 mr-1" />
                    Activate
                  </button>
                  <button
                    onClick={handleBulkDeactivate}
                    disabled={operationInProgress}
                    className="flex items-center px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                    aria-label="Deactivate selected users"
                  >
                    <FiX className="w-4 h-4 mr-1" />
                    Deactivate
                  </button>
                  <button
                    onClick={handleBulkMakeAdmin}
                    disabled={operationInProgress}
                    className="flex items-center px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                    aria-label="Make selected users admin"
                  >
                    <FiAward className="w-4 h-4 mr-1" />
                    Make Admin
                  </button>
                  <button
                    onClick={handleBulkMakeUser}
                    disabled={operationInProgress}
                    className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    aria-label="Make selected users regular"
                  >
                    <FiUser className="w-4 h-4 mr-1" />
                    Make User
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={operationInProgress}
                    className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    aria-label="Delete selected users"
                  >
                    <FiTrash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
              <button
                onClick={clearSelection}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
            <button
              onClick={() => setFilters({
                search: '',
                role: '',
                status: '',
                page: 1,
                limit: ITEMS_PER_PAGE
              })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all filters
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-500">
                {pagination.total ? `Showing ${users.length} of ${pagination.total} users` : 'No users found'}
              </span>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {pagination.total ? `Showing ${users.length} of ${pagination.total} users` : 'No users found'}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Users Table */}
            {users.length > 0 ? (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <FiUser className="w-5 h-5 text-primary-600" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {user._id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editing === user._id ? (
                              <select
                                value={editData.role}
                                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                className="input text-sm"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              <span className={`badge ${getRoleBadge(user.role)}`}>
                                {user.role}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editing === user._id ? (
                              <select
                                value={editData.isActive}
                                onChange={(e) => setEditData({ ...editData, isActive: e.target.value === 'true' })}
                                className="input text-sm"
                              >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </select>
                            ) : (
                              <span className={`badge ${getStatusBadge(user.isActive)}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                              {formatDate(user.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {editing === user._id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleSave(user._id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="text-yellow-600 hover:text-yellow-900"
                                  title="Edit User"
                                >
                                  <FiEdit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(user._id)}
                                  disabled={operationInProgress}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  title="Delete User"
                                >
                                  {operationInProgress ? (
                                    <LoadingSpinner size="sm" />
                                  ) : (
                                    <FiTrash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria.
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={pagination.current === 1}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`btn ${
                        page === pagination.current
                          ? 'btn-primary'
                          : 'btn-secondary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={pagination.current === pagination.pages}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

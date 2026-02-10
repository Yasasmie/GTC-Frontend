// src/Admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  adminListUsers,
  adminApproveUser,
  adminDeleteUser,
} from '../api'; // update path if needed

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntries, setShowEntries] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminListUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    user =>
      (user.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user.email || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * showEntries,
    currentPage * showEntries
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / showEntries)
  );

  const getStatusColor = status => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getKycColor = kycCompleted => {
    return kycCompleted
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-orange-100 text-orange-800 border-orange-200';
  };

  const toggleRowSelection = userId => {
    setSelectedRows(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedUsers.map(user => user.id));
    }
    setAllSelected(!allSelected);
  };

  const handleApprove = async id => {
    try {
      await adminApproveUser(id);
      await loadUsers();
    } catch (err) {
      console.error('Failed to approve user', err);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminDeleteUser(id);
      await loadUsers();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-1 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-slate-800 bg-clip-text text-transparent mb-2">
              Manage Users
            </h1>
            <p className="text-xl text-slate-600 font-medium">
              Control and monitor all platform users
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl">
              <span className="text-sm text-slate-600 font-medium">
                Show
              </span>
              <select
                value={showEntries}
                onChange={e => {
                  setShowEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-slate-800 font-bold text-sm focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-slate-600 font-medium">
                entries
              </span>
            </div>

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-12 pr-4 py-3 w-80 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent outline-none shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/50 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-5">
                    <input
                      type="checkbox"
                      checked={
                        paginatedUsers.length > 0 &&
                        selectedRows.length === paginatedUsers.length
                      }
                      onChange={toggleSelectAll}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-slate-800 text-lg">
                    #
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-slate-800 text-lg">
                    Name
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-slate-800 text-lg">
                    Email
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-slate-800 text-lg">
                    Status
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-slate-800 text-lg">
                    KYC
                  </th>
                  <th className="px-6 py-5 text-left font-bold text-slate-800 text-lg">
                    UID
                  </th>
                  <th className="px-6 py-5 text-right font-bold text-slate-800 text-lg">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map(user => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(user.id)}
                        onChange={() => toggleRowSelection(user.id)}
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-900 text-lg">
                      {user.id}
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {(user.name || user.email || '?')
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <span>{user.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-700 font-medium">
                      {user.email}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status === 'approved'
                          ? 'Approved'
                          : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getKycColor(
                          user.kycCompleted
                        )}`}
                      >
                        {user.kycCompleted ? 'Completed' : 'Required'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {user.uid}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors group">
                          <Eye
                            size={18}
                            className="group-hover:text-blue-600"
                          />
                        </button>
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors group">
                          <Edit3
                            size={18}
                            className="group-hover:text-green-600"
                          />
                        </button>
                        {user.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="px-3 py-1 text-xs font-bold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors group"
                        >
                          <Trash2
                            size={18}
                            className="group-hover:text-red-600"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 pt-8 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            Showing{' '}
            {filteredUsers.length === 0
              ? 0
              : (currentPage - 1) * showEntries + 1}{' '}
            to{' '}
            {Math.min(currentPage * showEntries, filteredUsers.length)} of{' '}
            {filteredUsers.length}{' '}
            entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentPage(prev => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent rounded-xl transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 py-2 text-sm font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(prev =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent rounded-xl transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;

// src/Admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  ArrowUpRight
} from 'lucide-react';
import {
  adminListUsers,
  adminApproveUser,
  adminDeleteUser,
} from '../api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntries, setShowEntries] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminListUsers();
      setUsers(data);
    } catch (err) {
      console.error('Terminal Error: Data Retrieval Failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    user =>
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * showEntries,
    currentPage * showEntries
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / showEntries));

  const toggleRowSelection = userId => {
    setSelectedRows(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleApprove = async id => {
    if (!window.confirm('Authorize this operator for system access?')) return;
    try {
      await adminApproveUser(id);
      await loadUsers();
    } catch (err) {
      console.error('Authorization Failed', err);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('TERMINATE USER: This action is irreversible. Proceed?')) return;
    try {
      await adminDeleteUser(id);
      await loadUsers();
    } catch (err) {
      console.error('Termination Failed', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-500/20 border-t-amber-500"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 animate-pulse">Decrypting Registry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">System Security // User Access Registry</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">
              Operator <span className="text-amber-500">Registry</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/5 px-4 py-3 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-zinc-500">Scale:</span>
              <select
                value={showEntries}
                onChange={e => { setShowEntries(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-transparent border-none text-white font-black text-xs focus:outline-none appearance-none cursor-pointer"
              >
                {[10, 25, 50].map(val => <option key={val} value={val} className="bg-zinc-950 text-white">{val}</option>)}
              </select>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="SEARCH OPERATOR ID OR EMAIL..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-12 pr-6 py-3 w-80 bg-white/5 border border-white/5 rounded-2xl focus:border-amber-500/50 outline-none text-xs font-bold text-white uppercase tracking-widest transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        {selectedRows.length > 0 && (
          <div className="mb-6 p-4 bg-amber-500 rounded-2xl flex items-center justify-between shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <span className="text-black text-xs font-black uppercase tracking-widest pl-2">
              {selectedRows.length} Operators Selected for Batch Command
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase rounded-xl hover:bg-zinc-800 transition-colors">Authorize All</button>
              <button className="px-4 py-2 bg-rose-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-rose-700 transition-colors">Purge Data</button>
            </div>
          </div>
        )}

        {/* Terminal Table */}
        <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-900/30 border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Select</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Identity</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Access Status</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">KYC Verify</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">System Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-8 py-5">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(user.id)}
                        onChange={() => toggleRowSelection(user.id)}
                        className="w-4 h-4 rounded border-white/10 bg-zinc-900 text-amber-500 focus:ring-amber-500/50"
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center text-amber-500 font-black text-xs shadow-inner">
                          {(user.name || user.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{user.name || 'Anonymous Operator'}</p>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        user.status === 'approved' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${user.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {user.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${user.kycCompleted ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {user.kycCompleted ? <ShieldCheck size={14} className="text-emerald-500" /> : <ShieldAlert size={14} />}
                        {user.kycCompleted ? 'Verified' : 'Unverified'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-2.5 bg-zinc-900 rounded-xl hover:text-amber-500 border border-transparent hover:border-amber-500/30 transition-all">
                          <Eye size={16} />
                        </button>
                        {user.status !== 'approved' && (
                          <button 
                            onClick={() => handleApprove(user.id)}
                            className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/10"
                          >
                            Authorize
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2.5 bg-zinc-900 rounded-xl hover:text-rose-500 border border-transparent hover:border-rose-500/30 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Console */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-12 pb-12 border-t border-white/5 pt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            Record Block {Math.min(currentPage * showEntries, filteredUsers.length)} of {filteredUsers.length} entries // System Stable
          </p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 bg-zinc-950 border border-white/5 text-zinc-500 hover:text-amber-500 disabled:opacity-20 rounded-xl transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-xl">
              <span className="text-xs font-black text-white uppercase tracking-widest">
                Page <span className="text-amber-500">{currentPage}</span> <span className="text-zinc-600">/</span> {totalPages}
              </span>
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 bg-zinc-950 border border-white/5 text-zinc-500 hover:text-amber-500 disabled:opacity-20 rounded-xl transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
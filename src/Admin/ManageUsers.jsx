import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Network,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  adminListUsers,
  adminApproveUser,
  adminDeleteUser,
  adminGetUserNetwork,
  getKycRequestById,
  approveKycRequest,
  rejectKycRequest,
} from '../api';
import { useNavigate } from 'react-router-dom';

const badgeClass = status => {
  switch ((status || 'pending').toLowerCase()) {
    case 'approved':
      return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
    case 'rejected':
      return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
    default:
      return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
  }
};

const kycText = user => (!user.kycCompleted ? 'not submitted' : user.kycStatus || 'pending');

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntries, setShowEntries] = useState(10);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [networkLoadingUid, setNetworkLoadingUid] = useState(null);
  const [userNetworks, setUserNetworks] = useState({});
  const [selectedNetworkMember, setSelectedNetworkMember] = useState({});
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      setUsers(await adminListUsers());
    } catch (err) {
      console.error(err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        user =>
          (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * showEntries,
    currentPage * showEntries
  );
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / showEntries));

  const loadNetwork = async user => {
    setNetworkLoadingUid(user.uid);
    setError('');
    try {
      const data = await adminGetUserNetwork(user.uid);
      setUserNetworks(prev => ({ ...prev, [user.uid]: data }));
      setSelectedNetworkMember(prev => ({
        ...prev,
        [user.uid]: prev[user.uid] || data.directReferrals[0]?.id || '',
      }));
    } catch (err) {
      console.error(err);
      setError('Failed to load referral network.');
    } finally {
      setNetworkLoadingUid(null);
    }
  };

  const toggleNetwork = async user => {
    if (expandedUserId === user.id) {
      setExpandedUserId(null);
      return;
    }
    setExpandedUserId(user.id);
    if (!userNetworks[user.uid]) {
      await loadNetwork(user);
    }
  };

  const handleViewBots = user => {
    if (!user?.uid) {
      setError('This user has no UID recorded.');
      return;
    }
    navigate(`/admin/users/${user.id}/bots?uid=${encodeURIComponent(user.uid)}`);
  };

  const handleDelete = async id => {
    if (!window.confirm('TERMINATE USER: This action is irreversible. Proceed?')) return;
    try {
      await adminDeleteUser(id);
      await loadUsers();
      if (expandedUserId === id) setExpandedUserId(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete user.');
    }
  };

  const openKyc = async id => {
    setError('');
    try {
      setSelectedKyc(await getKycRequestById(id));
    } catch (err) {
      console.error(err);
      setError('Failed to load KYC details.');
    }
  };

  const closeKyc = () => setSelectedKyc(null);

  const handleKyc = async status => {
    if (!selectedKyc) return;
    setActionLoading(true);
    try {
      if (status === 'approved') await approveKycRequest(selectedKyc.id);
      else await rejectKycRequest(selectedKyc.id);
      const expandedUser = users.find(user => user.id === expandedUserId);
      closeKyc();
      await loadUsers();
      if (expandedUser) await loadNetwork(expandedUser);
    } catch (err) {
      console.error(err);
      setError(`Failed to ${status === 'approved' ? 'approve' : 'reject'} KYC.`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-500/20 border-t-amber-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400">
      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Admin // User Management
              </span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">
              User <span className="text-amber-500">Management</span>
            </h1>
            <p className="mt-3 text-sm text-zinc-500 max-w-2xl">
              Expand a user to see the referral network under that referral link and review network KYC from the dropdown.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/5 px-4 py-3 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-zinc-500">Scale:</span>
              <select
                value={showEntries}
                onChange={e => {
                  setShowEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-white font-black text-xs focus:outline-none appearance-none cursor-pointer"
              >
                {[10, 25, 50].map(val => (
                  <option key={val} value={val} className="bg-zinc-950 text-white">{val}</option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500" size={18} />
              <input
                type="text"
                placeholder="SEARCH NAME OR EMAIL..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-12 pr-6 py-3 w-80 bg-white/5 border border-white/5 rounded-2xl focus:border-amber-500/50 outline-none text-xs font-bold text-white uppercase tracking-widest"
              />
            </div>
          </div>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

        <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-900/30 border-b border-white/5">
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">User</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">KYC</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Performance</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Network</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedUsers.map(user => {
                  const networkData = userNetworks[user.uid];
                  const isExpanded = expandedUserId === user.id;
                  const selectedMember = networkData?.directReferrals.find(
                    member => member.id === Number(selectedNetworkMember[user.uid])
                  );

                  return (
                    <React.Fragment key={user.id}>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center text-amber-500 font-black text-xs">
                              {(user.name || user.email || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-black text-white uppercase tracking-tight">{user.name || 'Anonymous Operator'}</p>
                              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${badgeClass(user.status)}`}>
                            {user.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() => user.kycCompleted && openKyc(user.id)}
                            disabled={!user.kycCompleted}
                            className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${user.kycCompleted ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 cursor-not-allowed'}`}
                          >
                            {user.kycCompleted ? <ShieldCheck size={14} className="text-emerald-500" /> : <ShieldAlert size={14} />}
                            {kycText(user)}
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-black text-amber-500 uppercase">{user.totalSells || 0} Sales</p>
                          <p className="text-[9px] font-bold text-zinc-500 uppercase">${(user.totalRevenue || 0).toLocaleString()} Revenue</p>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() => toggleNetwork(user)}
                            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-white/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:border-amber-500/30 hover:text-white"
                          >
                            <Network size={14} className="text-amber-500" />
                            {isExpanded ? 'Hide Network' : 'View Network'}
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              className="p-2.5 bg-zinc-900 rounded-xl hover:text-amber-500 border border-transparent hover:border-amber-500/30"
                              onClick={() => handleViewBots(user)}
                              title="View user bots"
                            >
                              <Eye size={16} />
                            </button>
                            {user.status !== 'approved' && (
                              <button
                                onClick={() => adminApproveUser(user.id).then(loadUsers).catch(() => setError('Failed to approve user.'))}
                                className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-emerald-500"
                              >
                                Approve User
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2.5 bg-zinc-900 rounded-xl hover:text-rose-500 border border-transparent hover:border-rose-500/30"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-black/40">
                          <td colSpan="6" className="px-6 pb-6">
                            <div className="rounded-[2rem] border border-white/5 bg-black p-6">
                              {networkLoadingUid === user.uid ? (
                                <div className="flex items-center justify-center py-10">
                                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/20 border-t-amber-500" />
                                </div>
                              ) : !networkData || networkData.directReferrals.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950/60 p-8 text-center text-sm text-zinc-500">
                                  No users have registered with this referral link yet.
                                </div>
                              ) : (
                                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                                  <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Referral Network</p>
                                      <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-500">
                                        {networkData.referralCount} Members
                                      </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left">
                                        <thead>
                                          <tr className="border-b border-white/5 text-zinc-500">
                                            <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest">Name</th>
                                            <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest">Email</th>
                                            <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-widest">KYC</th>
                                            <th className="py-3 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                          {networkData.directReferrals.map(member => (
                                            <tr key={member.id}>
                                              <td className="py-3 pr-4 text-sm font-bold text-white">{member.name || 'Unknown User'}</td>
                                              <td className="py-3 pr-4 text-xs text-zinc-500">{member.email}</td>
                                              <td className="py-3 pr-4">
                                                <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${badgeClass(kycText(member))}`}>
                                                  {kycText(member)}
                                                </span>
                                              </td>
                                              <td className="py-3 text-right">
                                                <button
                                                  type="button"
                                                  disabled={!member.hasKyc}
                                                  onClick={() => openKyc(member.id)}
                                                  className="rounded-xl bg-amber-500 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-black hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600"
                                                >
                                                  {member.hasKyc ? 'Review KYC' : 'No KYC'}
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                  <div className="rounded-2xl border border-white/5 bg-zinc-950/60 p-5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3">KYC Dropdown Review</p>
                                    <select
                                      value={selectedNetworkMember[user.uid] || ''}
                                      onChange={e => setSelectedNetworkMember(prev => ({ ...prev, [user.uid]: Number(e.target.value) }))}
                                      className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-amber-500/40"
                                    >
                                      {networkData.directReferrals.map(member => (
                                        <option key={member.id} value={member.id}>
                                          {(member.name || member.email) + ' - ' + kycText(member).toUpperCase()}
                                        </option>
                                      ))}
                                    </select>
                                    {selectedMember && (
                                      <div className="mt-4 rounded-2xl border border-white/5 bg-black p-4">
                                        <p className="text-lg font-black text-white uppercase tracking-tight">{selectedMember.name || 'Unnamed User'}</p>
                                        <p className="mt-1 text-xs text-zinc-500">{selectedMember.email}</p>
                                        <div className="mt-4 space-y-2 text-xs uppercase tracking-widest">
                                          <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">User Status</span>
                                            <span className="text-white">{selectedMember.status}</span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">KYC Status</span>
                                            <span className="text-white">{kycText(selectedMember)}</span>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => openKyc(selectedMember.id)}
                                          disabled={!selectedMember.hasKyc}
                                          className="mt-5 w-full rounded-2xl bg-amber-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600"
                                        >
                                          {selectedMember.hasKyc ? 'Open KYC Review' : 'No KYC Submitted'}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-12 pb-12 border-t border-white/5 pt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            Record Block {Math.min(currentPage * showEntries, filteredUsers.length)} of {filteredUsers.length} entries
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 bg-zinc-950 border border-white/5 text-zinc-500 hover:text-amber-500 disabled:opacity-20 rounded-xl"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-xl text-xs font-black text-white uppercase tracking-widest">
              Page <span className="text-amber-500">{currentPage}</span> / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 bg-zinc-950 border border-white/5 text-zinc-500 hover:text-amber-500 disabled:opacity-20 rounded-xl"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {selectedKyc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-zinc-950 shadow-2xl">
              <div className="border-b border-white/5 p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Identity Review</p>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">{selectedKyc.name || 'KYC Details'}</h2>
              </div>
              <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailCard label="Name" value={selectedKyc.name} />
                  <DetailCard label="Email" value={selectedKyc.email} />
                  <DetailCard label="Address" value={selectedKyc.kyc.address} />
                  <DetailCard label="City / Country" value={`${selectedKyc.kyc.city}, ${selectedKyc.kyc.country}`} />
                  <DetailCard label="ID Number" value={selectedKyc.kyc.idNumber} />
                  <DetailCard label="Current Status" value={selectedKyc.kycStatus || 'pending'} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedKyc.kyc.nicFront && <ImageCard label="NIC Front" src={selectedKyc.kyc.nicFront} />}
                  {selectedKyc.kyc.nicBack && <ImageCard label="NIC Back" src={selectedKyc.kyc.nicBack} />}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/5 p-6">
                <button type="button" onClick={closeKyc} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black uppercase tracking-widest text-zinc-300 hover:bg-white/5">
                  Close
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleKyc('rejected')}
                    disabled={actionLoading || (selectedKyc.kycStatus || '').toLowerCase() === 'rejected'}
                    className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-rose-500 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKyc('approved')}
                    disabled={actionLoading || (selectedKyc.kycStatus || '').toLowerCase() === 'approved'}
                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailCard = ({ label, value }) => (
  <div className="rounded-2xl border border-white/5 bg-black p-4">
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">{label}</p>
    <p className="text-sm font-bold text-white">{value || 'N/A'}</p>
  </div>
);

const ImageCard = ({ label, src }) => (
  <div className="rounded-2xl border border-white/5 bg-black p-4">
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3">{label}</p>
    <img src={src} alt={label} className="w-full max-h-72 object-contain rounded-xl border border-white/10" />
  </div>
);

export default ManageUsers;

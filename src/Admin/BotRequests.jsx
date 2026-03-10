// src/Admin/BotRequests.jsx
import React, { useEffect, useState } from 'react';
import {
  getBotRequests,
  getBotRequestById,
  approveBotRequest,
  rejectBotRequest,
} from '../api';
import { ShieldAlert, FileText, CheckCircle, XCircle, User, Activity, Clock, Search } from 'lucide-react';

const isPdf = value =>
  typeof value === 'string' &&
  (value.startsWith('data:application/pdf') || value.toLowerCase().endsWith('.pdf'));

const BotRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getBotRequests();
      setRequests(data);
    } catch (err) {
      setError('Permission Denied: Unable to fetch incoming requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const openView = async id => {
    setError('');
    try {
      const data = await getBotRequestById(id);
      setSelected(data);
      setModalOpen(true);
    } catch (err) {
      setError('System Error: Could not retrieve agreement manifest.');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  const handleApprove = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await approveBotRequest(selected.id);
      closeModal();
      await loadRequests();
    } catch (err) {
      setError('Deployment Failed: Approval logic error.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await rejectBotRequest(selected.id);
      closeModal();
      await loadRequests();
    } catch (err) {
      setError('Rejection Failed: Security override error.');
    } finally {
      setActionLoading(false);
    }
  };

  const statusStyle = status => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'approved') return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
    if (s === 'rejected') return 'text-red-500 border-red-500/20 bg-red-500/5';
    return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
  };

  const formatDate = iso => iso ? new Date(iso).toLocaleDateString() : 'N/A';
  const formatDateTime = iso => iso ? new Date(iso).toLocaleString() : 'N/A';
  const getExpiryDate = iso => {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <ShieldAlert size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Security Clearance Queue</span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">
            Deployment <span className="text-amber-500">Requests</span>
          </h1>
          <p className="mt-2 text-zinc-500 text-sm max-w-2xl font-medium">
            Verify signed legal agreements and authorize bot unit assignments to verified broker accounts.
          </p>
        </header>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
            <ShieldAlert size={16} />
            {error}
          </div>
        )}

        {/* Requests Table */}
        <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500/20 border-t-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Scanning Requests...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-zinc-600 font-black uppercase tracking-widest text-sm italic">
              Queue clear. No pending authorizations.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-900/30 border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Operator/Account</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Bot Designation</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Timeline</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map(r => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white uppercase italic tracking-tight">{r.userName || 'ANONYMOUS'}</span>
                          <span className="text-[10px] font-mono text-zinc-600">{r.broker} // {r.accountNumber}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-300 uppercase">{r.botName}</span>
                          <span className="text-[10px] font-mono text-amber-500/60">${r.price}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col text-[10px] font-mono">
                          <span className="text-zinc-500">REQ: {formatDate(r.createdAt)}</span>
                          <span className="text-zinc-700">EXP: {getExpiryDate(r.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyle(r.status)}`}>
                          {r.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openView(r.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                          >
                            <FileText size={14} /> Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {modalOpen && selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/20">
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Manifest Verification</h2>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mt-1">Request ID: {selected.id}</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-full transition-colors"><XCircle size={24}/></button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              {/* Grid Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DetailBox icon={<User size={14}/>} label="Operator Identity" value={selected.userName} subValue={selected.userEmail} />
                <DetailBox icon={<Activity size={14}/>} label="Broker Destination" value={selected.broker} subValue={selected.accountNumber} />
                <DetailBox icon={<Clock size={14}/>} label="Temporal Window" value={`REQ: ${formatDateTime(selected.createdAt)}`} subValue={`EXP: ${getExpiryDate(selected.createdAt)}`} />
              </div>

              {selected.paymentSlip && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">Payment Slip</label>
                  <div className="relative aspect-[4/3] md:aspect-[16/9] bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 group">
                    {isPdf(selected.paymentSlip) ? (
                      <iframe
                        title="Payment Slip"
                        src={selected.paymentSlip}
                        className="w-full h-full bg-white"
                      />
                    ) : (
                      <img
                        src={selected.paymentSlip}
                        alt="Payment Slip"
                        className="w-full h-full object-contain p-4"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Document Preview */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">Signed Agreement Manifest</label>
                <div className="relative aspect-[4/3] md:aspect-[16/9] bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 group">
                  {isPdf(selected.signedAgreementUrl) ? (
                    <iframe
                      title="Agreement"
                      src={selected.signedAgreementUrl}
                      className="w-full h-full bg-white"
                    />
                  ) : (
                    <img
                      src={selected.signedAgreementUrl}
                      alt="Agreement"
                      className="w-full h-full object-contain p-4"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-full">Secure Document Viewer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-8 bg-zinc-900/30 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
              <button
                onClick={closeModal}
                className="w-full md:w-auto px-8 py-3 text-zinc-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
              >
                Exit Console
              </button>
              <div className="flex gap-4 w-full md:w-auto">
                <button
                  onClick={handleReject}
                  disabled={actionLoading || selected.status?.toLowerCase() === 'rejected'}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-red-600/10 border border-red-600/20 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-30"
                >
                  <XCircle size={16} /> {actionLoading ? 'Executing...' : 'Deny Access'}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading || selected.status?.toLowerCase() === 'approved'}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all disabled:opacity-30"
                >
                  <CheckCircle size={16} /> {actionLoading ? 'Executing...' : 'Authorize Unit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Internal UI Component */
const DetailBox = ({ icon, label, value, subValue }) => (
  <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-2xl">
    <div className="flex items-center gap-2 text-zinc-600 mb-2">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-white font-black uppercase italic tracking-tight">{value || 'N/A'}</p>
    <p className="text-[10px] font-mono text-zinc-600 truncate mt-1">{subValue}</p>
  </div>
);

export default BotRequests;

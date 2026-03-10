import React, { useEffect, useState } from 'react';
import {
  getKycRequests,
  getKycRequestById,
  approveKycRequest,
  rejectKycRequest,
} from '../api';

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

const KycRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      setRequests(await getKycRequests());
    } catch (err) {
      console.error(err);
      setError('Failed to load KYC requests.');
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
      setSelected(await getKycRequestById(id));
    } catch (err) {
      console.error(err);
      setError('Failed to load KYC details.');
    }
  };

  const handleAction = async status => {
    if (!selected) return;
    setActionLoading(true);
    try {
      if (status === 'approved') await approveKycRequest(selected.id);
      else await rejectKycRequest(selected.id);
      setSelected(null);
      await loadRequests();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${status === 'approved' ? 'approve' : 'reject'} KYC.`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400">
      <div className="max-w-[1500px] mx-auto p-4 md:p-8">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">
              Admin // Identity Queue
            </span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">
            KYC <span className="text-amber-500">Requests</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Review submitted identity documents and approve or reject them from the admin queue.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="min-h-[260px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-500/20 border-t-amber-500" />
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-zinc-950 p-12 text-center text-zinc-500">
            No KYC requests found.
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-white/5 bg-zinc-950 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-900/30 border-b border-white/5">
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">#</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">User</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Email</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map((request, index) => (
                    <tr key={request.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-5 text-sm font-black text-zinc-500">{index + 1}</td>
                      <td className="px-6 py-5 text-sm font-black text-white uppercase tracking-tight">
                        {request.name || 'N/A'}
                      </td>
                      <td className="px-6 py-5 text-xs text-zinc-500">{request.email}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${badgeClass(request.kycStatus)}`}>
                          {request.kycStatus || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() => openView(request.id)}
                          className="rounded-xl bg-amber-500 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black hover:bg-amber-400"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-zinc-950 shadow-2xl">
              <div className="border-b border-white/5 p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">
                  Identity Review
                </p>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                  {selected.name || 'KYC Details'}
                </h2>
              </div>

              <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailCard label="Name" value={selected.name} />
                  <DetailCard label="Email" value={selected.email} />
                  <DetailCard label="Address" value={selected.kyc.address} />
                  <DetailCard label="City / Country" value={`${selected.kyc.city}, ${selected.kyc.country}`} />
                  <DetailCard label="ID Number" value={selected.kyc.idNumber} />
                  <DetailCard label="Current Status" value={selected.kycStatus || 'pending'} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selected.kyc.nicFront && <ImageCard label="NIC Front" src={selected.kyc.nicFront} />}
                  {selected.kyc.nicBack && <ImageCard label="NIC Back" src={selected.kyc.nicBack} />}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/5 p-6">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black uppercase tracking-widest text-zinc-300 hover:bg-white/5"
                >
                  Close
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleAction('rejected')}
                    disabled={actionLoading || (selected.kycStatus || '').toLowerCase() === 'rejected'}
                    className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-rose-500 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('approved')}
                    disabled={actionLoading || (selected.kycStatus || '').toLowerCase() === 'approved'}
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

export default KycRequests;

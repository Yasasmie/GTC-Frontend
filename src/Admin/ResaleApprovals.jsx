import React, { useEffect, useState } from 'react';
import {
  adminGetResaleApprovals,
  adminGetResaleApprovalById,
  adminApproveResaleApproval,
  adminRejectResaleApproval,
} from '../api';

const isPdf = value =>
  typeof value === 'string' &&
  (value.startsWith('data:application/pdf') || value.toLowerCase().endsWith('.pdf'));
const isHttpLink = value =>
  typeof value === 'string' &&
  /^https?:\/\//i.test(value);

const FilePreview = ({ src, label }) => {
  if (!src) return null;
  return (
    <div className="rounded-2xl border border-white/5 bg-black p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3">{label}</p>
      {isHttpLink(src) ? (
        <div className="h-80 rounded-xl border border-white/10 flex items-center justify-center">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest"
          >
            Open Link
          </a>
        </div>
      ) : isPdf(src) ? (
        <iframe title={label} src={src} className="w-full h-80 rounded-xl border border-white/10 bg-white" />
      ) : (
        <img src={src} alt={label} className="w-full max-h-80 object-contain rounded-xl border border-white/10" />
      )}
    </div>
  );
};

const badge = status => {
  switch ((status || '').toLowerCase()) {
    case 'approved':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'rejected':
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    default:
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  }
};

const ResaleApprovals = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await adminGetResaleApprovals());
    } catch (err) {
      console.error(err);
      setError('Failed to load resale approvals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const open = async id => {
    try {
      setSelected(await adminGetResaleApprovalById(id));
    } catch (err) {
      console.error(err);
      setError('Failed to load resale approval details.');
    }
  };

  const handle = async type => {
    if (!selected) return;
    setActionLoading(true);
    try {
      if (type === 'approve') await adminApproveResaleApproval(selected.id);
      else await adminRejectResaleApproval(selected.id);
      setSelected(null);
      await load();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${type} resale approval.`);
    } finally {
      setActionLoading(false);
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.resellerUid]) {
      acc[item.resellerUid] = {
        resellerName: item.resellerName,
        resellerEmail: item.resellerEmail,
        items: [],
      };
    }
    acc[item.resellerUid].items.push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">
            Resale <span className="text-amber-500">Approvals</span>
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Final admin approval queue for reseller-to-customer bot sales.
          </p>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

        <div className="rounded-[2.5rem] border border-white/5 bg-zinc-950 overflow-hidden">
          {loading ? (
            <div className="py-24 text-center text-zinc-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="py-24 text-center text-zinc-500">No resale approvals found.</div>
          ) : (
            <div className="p-6 space-y-6">
              {Object.values(groupedItems).map(group => (
                <div key={group.resellerName} className="rounded-[2rem] border border-white/5 overflow-hidden">
                  <div className="bg-zinc-900/40 px-6 py-4 border-b border-white/5">
                    <p className="text-white font-black uppercase tracking-tight">{group.resellerName}</p>
                    <p className="text-[10px] font-mono text-zinc-500">{group.resellerEmail}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 bg-zinc-900/20">
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Customer</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Bot</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Prices</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">View</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {group.items.map(item => (
                          <tr key={item.id}>
                            <td className="px-6 py-5 text-zinc-300">{item.buyerName}</td>
                            <td className="px-6 py-5 text-zinc-300">{item.botName}</td>
                            <td className="px-6 py-5 text-xs font-mono">
                              <div>Client: ${item.resalePrice}</div>
                              <div className="text-amber-500">Admin 65%: ${item.adminPayablePrice}</div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${badge(item.status)}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button onClick={() => open(item.id)} className="rounded-xl bg-amber-500 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black hover:bg-amber-400">
                                Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-5xl rounded-[2rem] border border-white/10 bg-zinc-950 shadow-2xl">
              <div className="border-b border-white/5 p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">{selected.botName}</h2>
              </div>
              <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Detail label="Reseller" value={selected.resellerName} />
                  <Detail label="Buyer" value={selected.buyerName} />
                  <Detail label="Broker / Account" value={`${selected.broker} / ${selected.accountNumber}`} />
                  <Detail label="Client Price" value={`$${selected.resalePrice}`} />
                  <Detail label="Actual Price" value={`$${selected.adminBasePrice}`} />
                  <Detail label="Admin Payable (65%)" value={`$${selected.adminPayablePrice}`} />
                  <Detail label="Profit" value={`$${selected.commissionAmount}`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FilePreview src={selected.customerPaymentSlip} label="Customer Payment Slip" />
                  <FilePreview src={selected.resellerAdminPaymentSlip} label="Reseller Admin Payment Slip" />
                </div>
              </div>
              <div className="border-t border-white/5 p-6 flex justify-between">
                <button onClick={() => setSelected(null)} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black uppercase tracking-widest text-zinc-300 hover:bg-white/5">
                  Close
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => handle('reject')}
                    disabled={actionLoading || selected.status !== 'pending'}
                    className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-rose-500 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handle('approve')}
                    disabled={actionLoading || selected.status !== 'pending'}
                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-emerald-500 disabled:opacity-50"
                  >
                    Approve
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

const Detail = ({ label, value }) => (
  <div className="rounded-2xl border border-white/5 bg-black p-4">
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">{label}</p>
    <p className="text-sm font-bold text-white">{value}</p>
  </div>
);

export default ResaleApprovals;

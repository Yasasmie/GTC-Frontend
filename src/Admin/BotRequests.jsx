// src/Admin/BotRequests.jsx
import React, { useEffect, useState } from 'react';
import {
  getBotRequests,
  getBotRequestById,
  approveBotRequest,
  rejectBotRequest,
} from '../api';

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
      console.error(err);
      setError('Failed to load bot requests.');
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
      console.error(err);
      setError('Failed to load bot request.');
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
      console.error(err);
      setError('Failed to approve bot request.');
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
      console.error(err);
      setError('Failed to reject bot request.');
    } finally {
      setActionLoading(false);
    }
  };

  const statusBadgeClass = status => {
    switch ((status || 'pending').toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const formatDate = iso => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  const formatDateTime = iso => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString();
  };

  const getExpiryDate = iso => {
    if (!iso) return '';
    const d = new Date(iso);
    d.setFullYear(d.getFullYear() + 1);
    return d.toLocaleDateString();
  };

  return (
    <div className="p-1 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900">
              Bot Requests
            </h1>
            <p className="text-slate-600">
              Review pending bot assignments and approve or reject them.
            </p>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-2">
            {error}
          </p>
        )}

        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="min-h-[200px] flex items-center justify-center text-slate-500">
            No bot requests.
          </div>
        ) : (
          <div className="bg-white/80 rounded-3xl border border-slate-200/50 overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Bot
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Requested Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm text-slate-800">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {r.userName || 'Unknown'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {r.userEmail}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {r.broker} – {r.accountNumber}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {r.botName} (${r.price})
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {getExpiryDate(r.createdAt)}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeClass(
                            r.status
                          )}`}
                        >
                          {r.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openView(r.id)}
                            className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                          >
                            View Agreement
                          </button>
                          <button
                            onClick={async () => {
                              setSelected(r);
                              await handleApprove();
                            }}
                            disabled={
                              actionLoading ||
                              (r.status &&
                                r.status.toLowerCase() === 'approved')
                            }
                            className="px-3 py-1 rounded-xl bg-green-600 text-white text-xs font-semibold hover:bg-green-700 disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              setSelected(r);
                              await handleReject();
                            }}
                            disabled={
                              actionLoading ||
                              (r.status &&
                                r.status.toLowerCase() === 'rejected')
                            }
                            className="px-3 py-1 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View modal */}
        {modalOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Bot Request Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    User
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {selected.userName || 'Unknown'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selected.userEmail}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Account
                  </p>
                  <p className="text-sm text-slate-900">
                    {selected.broker} – {selected.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Bot
                  </p>
                  <p className="text-sm text-slate-900">
                    {selected.botName} (${selected.price})
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Requested / Expiry
                  </p>
                  <p className="text-sm text-slate-900">
                    {formatDateTime(selected.createdAt)} (exp:{' '}
                    {getExpiryDate(selected.createdAt)})
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeClass(
                      selected.status
                    )}`}
                  >
                    {selected.status || 'pending'}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  Signed Agreement
                </p>
                {/* treat URL as image; if in real app it might be file, adjust accordingly */}
                <img
                  src={selected.signedAgreementUrl}
                  alt="Signed Agreement"
                  className="w-full max-h-96 object-contain rounded-xl border"
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={
                      actionLoading ||
                      (selected.status &&
                        selected.status.toLowerCase() === 'rejected')
                    }
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={
                      actionLoading ||
                      (selected.status &&
                        selected.status.toLowerCase() === 'approved')
                    }
                    className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
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

export default BotRequests;

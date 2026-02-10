// src/Admin/KycRequests.jsx
import React, { useEffect, useState } from 'react';
import {
  getKycRequests,
  getKycRequestById,
  approveKycRequest,
  rejectKycRequest,
} from '../api';

const KycRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null); // full KYC details
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getKycRequests(); // returns all KYC with kycStatus
      setRequests(data);
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
      const data = await getKycRequestById(id);
      setSelected(data);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Failed to load KYC details.');
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
      await approveKycRequest(selected.id);
      closeModal();
      await loadRequests(); // refresh list, status will become approved
    } catch (err) {
      console.error(err);
      setError('Failed to approve KYC.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await rejectKycRequest(selected.id);
      closeModal();
      await loadRequests(); // refresh list, status will become rejected
    } catch (err) {
      console.error(err);
      setError('Failed to reject KYC.');
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

  return (
    <div className="p-1 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900">
              KYC Requests
            </h1>
            <p className="text-slate-600">
              Review and approve or reject user KYC submissions.
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
            No KYC requests.
          </div>
        ) : (
          <div className="bg-white/80 rounded-3xl border border-slate-200/50 overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Proof
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((r, index) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm font-medium text-slate-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {r.name || 'N/A'}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {r.email}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeClass(
                            r.kycStatus
                          )}`}
                        >
                          {r.kycStatus || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <button
                          onClick={() => openView(r.id)}
                          className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
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

        {/* View modal */}
        {modalOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-3xl">
              <div className="bg-white rounded-3xl shadow-xl p-6 max-h-[80vh] overflow-y-auto mx-auto">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  KYC Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Name
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {selected.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Email
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {selected.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Address
                    </p>
                    <p className="text-sm text-slate-900">
                      {selected.kyc.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      City / Country
                    </p>
                    <p className="text-sm text-slate-900">
                      {selected.kyc.city}, {selected.kyc.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      ID Number
                    </p>
                    <p className="text-sm text-slate-900">
                      {selected.kyc.idNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Current Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeClass(
                        selected.kycStatus
                      )}`}
                    >
                      {selected.kycStatus || 'pending'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {selected.kyc.nicFront && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        NIC Front
                      </p>
                      <img
                        src={selected.kyc.nicFront}
                        alt="NIC Front"
                        className="w-full max-h-64 object-contain rounded-xl border"
                      />
                    </div>
                  )}
                  {selected.kyc.nicBack && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        NIC Back
                      </p>
                      <img
                        src={selected.kyc.nicBack}
                        alt="NIC Back"
                        className="w-full max-h-64 object-contain rounded-xl border"
                      />
                    </div>
                  )}
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
                        (selected.kycStatus &&
                          selected.kycStatus.toLowerCase() === 'rejected')
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
                        (selected.kycStatus &&
                          selected.kycStatus.toLowerCase() === 'approved')
                      }
                      className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
                    >
                      {actionLoading ? 'Processing...' : 'Approve'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KycRequests;

// src/Admin/AdminCareers.jsx
import React, { useEffect, useState } from 'react';

const AdminCareers = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/admin/careers');
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to load applications');
        }
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openDetails = app => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const closeDetails = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Career Applications</h1>
      {applications.length === 0 ? (
        <p className="text-gray-400">No applications submitted yet.</p>
      ) : (
        <div className="overflow-x-auto bg-slate-800 rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-700 text-left text-xs uppercase tracking-wide text-gray-300">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">NIC</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Working?</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Preferred role</th>
                <th className="px-4 py-3">Available from</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr
                  key={app.id}
                  className="border-t border-slate-700 hover:bg-slate-800 cursor-pointer"
                  onClick={() => openDetails(app)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{app.name}</div>
                    <div className="text-xs text-gray-400 break-words">
                      {app.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">{app.nic}</td>
                  <td className="px-4 py-3">{app.phone}</td>
                  <td className="px-4 py-3">{app.whatsapp}</td>
                  <td className="px-4 py-3">
                    {app.currentlyWorking === 'yes' ? 'Yes' : 'No'}
                  </td>
                  <td className="px-4 py-3">{app.employmentType}</td>
                  <td className="px-4 py-3">{app.preferredRole}</td>
                  <td className="px-4 py-3">
                    {app.availableFrom || '-'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {showModal && selectedApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={closeDetails}
        >
          <div
            className="bg-slate-900 rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Application Details
              </h2>
              <button
                onClick={closeDetails}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <DetailRow label="Full Name" value={selectedApp.name} />
              <DetailRow label="NIC" value={selectedApp.nic} />
              <DetailRow label="Address" value={selectedApp.address} />
              <DetailRow label="Mobile" value={selectedApp.phone} />
              <DetailRow label="WhatsApp" value={selectedApp.whatsapp} />
              <DetailRow label="Email" value={selectedApp.email || '-'} />
              <DetailRow
                label="Currently working"
                value={
                  selectedApp.currentlyWorking === 'yes' ? 'Yes' : 'No'
                }
              />
              <DetailRow
                label="Preferred to join"
                value={selectedApp.employmentType}
              />
              <DetailRow
                label="Years of experience"
                value={selectedApp.yearsExperience || '-'}
              />
              <DetailRow
                label="Preferred role / department"
                value={selectedApp.preferredRole || '-'}
              />
              <DetailRow
                label="Available from"
                value={selectedApp.availableFrom || '-'}
              />
              <DetailRow
                label="Submitted at"
                value={
                  selectedApp.createdAt
                    ? new Date(selectedApp.createdAt).toLocaleString()
                    : '-'
                }
              />
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase mb-1">
                  Additional information
                </div>
                <div className="text-gray-100 whitespace-pre-line">
                  {selectedApp.notes || '-'}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeDetails}
                className="px-4 py-2 rounded-lg bg-slate-700 text-gray-100 hover:bg-slate-600 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs font-semibold text-gray-400 uppercase">
      {label}
    </span>
    <span className="text-gray-100 break-words">{value}</span>
  </div>
);

export default AdminCareers;

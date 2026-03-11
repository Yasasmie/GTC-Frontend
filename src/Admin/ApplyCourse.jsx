// src/Admin/ApplyCourse.jsx
import React, { useEffect, useState } from 'react';
import { getCourseApplications, updateCourseApplicationStatus } from '../api';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

const isPdf = value =>
  typeof value === 'string' &&
  (value.startsWith('data:application/pdf') || value.toLowerCase().endsWith('.pdf'));
const isHttpLink = value =>
  typeof value === 'string' &&
  /^https?:\/\//i.test(value);

const ApplyCourse = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const loadApps = async () => {
    try {
      const data = await getCourseApplications();
      setApps(data);
    } catch (err) {
      console.error('Failed to load course applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateCourseApplicationStatus(id, status);
      loadApps();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-white italic mb-6 uppercase">
        Course <span className="text-amber-500">Applications</span>
      </h1>

      {loading ? (
        <p className="text-zinc-400">Loading applications...</p>
      ) : apps.length === 0 ? (
        <p className="text-zinc-500 text-sm">No course applications yet.</p>
      ) : (
        <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
          <table className="min-w-full text-xs text-left text-zinc-300">
            <thead className="bg-black/60 text-[10px] uppercase tracking-widest">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="font-bold text-[11px]">{app.name}</div>
                    <div className="text-[10px] text-zinc-500">{app.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[11px]">{app.courseTitle}</div>
                    <div className="text-[10px] text-zinc-500">{app.category}</div>
                  </td>
                  <td className="px-4 py-3 text-[10px] uppercase">
                    {app.type}
                  </td>
                  <td className="px-4 py-3 text-[10px]">
                    {app.price != null ? `$${app.price}` : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-[10px] text-zinc-500">
                    {new Date(app.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, 'approved')}
                        className="p-1 rounded bg-emerald-600 hover:bg-emerald-500"
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, 'rejected')}
                        className="p-1 rounded bg-rose-600 hover:bg-rose-500"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-black text-white uppercase italic">
                Application Details
              </h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-zinc-400 hover:text-white"
              >
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm text-zinc-300">
              <p>
                <span className="font-bold">Course:</span> {selectedApp.courseTitle} (
                {selectedApp.category} • {selectedApp.type})
              </p>
              <p>
                <span className="font-bold">Applicant:</span> {selectedApp.name}
              </p>
              <p>
                <span className="font-bold">Email:</span> {selectedApp.email}
              </p>
              {selectedApp.phone && (
                <p>
                  <span className="font-bold">Phone:</span> {selectedApp.phone}
                </p>
              )}
              {selectedApp.price != null && (
                <p>
                  <span className="font-bold">Price:</span> ${selectedApp.price}
                </p>
              )}
              {selectedApp.notes && (
                <p>
                  <span className="font-bold">Notes:</span> {selectedApp.notes}
                </p>
              )}
              <p>
                <span className="font-bold">Status:</span> <StatusBadge status={selectedApp.status} />
              </p>
              <p className="flex items-center gap-2 text-[11px] text-zinc-500">
                <Clock size={12} /> {new Date(selectedApp.createdAt).toLocaleString()}
              </p>

              {selectedApp.paymentSlip && (
                <div className="mt-4">
                  <p className="font-bold mb-2 text-zinc-200 text-sm">Payment Slip</p>
                  {isHttpLink(selectedApp.paymentSlip) ? (
                    <a
                      href={selectedApp.paymentSlip}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex px-4 py-2 rounded-lg bg-amber-500 text-black text-[11px] font-black uppercase tracking-widest"
                    >
                      Open Payment Slip Link
                    </a>
                  ) : isPdf(selectedApp.paymentSlip) ? (
                    <iframe
                      title="Payment slip"
                      src={selectedApp.paymentSlip}
                      className="w-full h-80 rounded border border-white/10 bg-white"
                    />
                  ) : (
                    <img
                      src={selectedApp.paymentSlip}
                      alt="Payment slip"
                      className="w-full rounded border border-white/10"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let color = 'bg-zinc-700 text-zinc-200';
  if (status === 'approved') color = 'bg-emerald-600 text-white';
  if (status === 'rejected') color = 'bg-rose-600 text-white';
  if (status === 'pending') color = 'bg-amber-500 text-black';

  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${color}`}>
      {status || 'pending'}
    </span>
  );
};

export default ApplyCourse;

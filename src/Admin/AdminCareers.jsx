// src/Admin/AdminCareers.jsx
import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Phone, Calendar, Briefcase, 
  Clock, MapPin, ClipboardList, X 
} from 'lucide-react'; // Note: Ensure lucide-react is installed

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

  const openDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const closeDetails = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 font-medium">Fetching applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100">
          <p className="text-red-500 font-semibold text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Career Applications</h1>
            <p className="text-slate-500 mt-1">Manage and review all incoming job applications.</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
            <span className="text-sm font-medium text-slate-600">Total Applications: </span>
            <span className="text-blue-600 font-bold">{applications.length}</span>
          </div>
        </header>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-slate-200">
            <ClipboardList className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg">No applications submitted yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role & Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Availability</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr 
                      key={app.id || app._id} 
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {app.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-900">{app.name}</div>
                            <div className="text-xs text-slate-500">{app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 font-medium">{app.preferredRole}</div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {app.employmentType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700">{app.yearsExperience || '0'} Years</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {app.availableFrom || 'Immediate'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openDetails(app)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modern Detail Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-slate-900">Application Profile</h2>
              <button onClick={closeDetails} className="p-2 hover:bg-slate-100 rounded-full transition">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="px-8 py-8 space-y-8">
              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem icon={<User />} label="Full Name" value={selectedApp.name} />
                <DetailItem icon={<Mail />} label="Email Address" value={selectedApp.email} />
                <DetailItem icon={<Phone />} label="Mobile Phone" value={selectedApp.phone} />
                <DetailItem icon={<MapPin />} label="NIC / ID" value={selectedApp.nic} />
                <DetailItem icon={<Briefcase />} label="Currently Working" value={selectedApp.currentlyWorking === 'yes' ? 'Yes' : 'No'} />
                <DetailItem icon={<Calendar />} label="Available From" value={selectedApp.availableFrom} />
              </div>

              {/* Work Details Section */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Role Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Desired Position</p>
                    <p className="text-lg font-semibold text-blue-600">{selectedApp.preferredRole}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Employment Type</p>
                    <p className="text-lg font-semibold text-slate-800">{selectedApp.employmentType}</p>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Additional Information</h3>
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedApp.notes || "No additional notes provided by the candidate."}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center text-xs text-slate-400">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Submitted on: {selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleString() : '-'}
                </div>
                <button 
                  onClick={closeDetails}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Helper Component for Modal Rows */
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="mt-1 text-blue-500">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-slate-900 font-medium break-words">{value || '-'}</p>
    </div>
  </div>
);

export default AdminCareers;
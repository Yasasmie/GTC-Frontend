// src/Admin/AdminCareers.jsx
import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Phone, Calendar, Briefcase, 
  Clock, MapPin, ClipboardList, X, FileSearch, ArrowUpRight, CheckCircle2 
} from 'lucide-react';
import { API_BASE } from '../api';

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
        const res = await fetch(`${API_BASE}/api/admin/careers`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Data stream interrupted');
        }
        const data = await res.json();
        setApplications(data);
      } catch (err) {
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
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-500/20 border-t-amber-500"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Scanning Talent Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 pb-20">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileSearch size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Recruitment Portal // Intelligence</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">
              Career <span className="text-amber-500">Applications</span>
            </h1>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Candidates</span>
            <span className="text-2xl font-black text-amber-500 font-mono italic">{applications.length.toString().padStart(2, '0')}</span>
          </div>
        </header>

        {applications.length === 0 ? (
          <div className="bg-zinc-950 border border-dashed border-white/10 rounded-[2.5rem] p-32 text-center">
            <ClipboardList className="mx-auto h-16 w-16 text-zinc-800 mb-6" />
            <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">No new intelligence submitted.</p>
          </div>
        ) : (
          <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-zinc-900/30 border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Candidate Info</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Designation</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Experience</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Deployment</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {applications.map((app) => (
                    <tr key={app.id || app._id} className="hover:bg-white/[0.02] transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-amber-500 font-black text-xs">
                            {app.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-black text-white uppercase tracking-tight">{app.name}</div>
                            <div className="text-[10px] font-mono text-zinc-500 lowercase">{app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{app.preferredRole}</div>
                        <span className="text-[9px] font-black text-amber-500/70 uppercase tracking-tighter">
                          [{app.employmentType}]
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-white italic font-mono">{app.yearsExperience || '0'}</span>
                          <span className="text-[10px] font-black text-zinc-600 uppercase">Years</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          {app.availableFrom || 'Immediate'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => openDetails(app)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-zinc-400 hover:text-amber-500 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-amber-500/30"
                        >
                          Review <ArrowUpRight size={14} />
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

      {/* Dossier Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div 
            className="bg-[#0A0A0A] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/20">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Candidate Dossier</span>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mt-1">Profile Analysis</h2>
              </div>
              <button onClick={closeDetails} className="p-4 hover:bg-white/5 rounded-2xl transition-all text-zinc-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
              {/* Primary Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <DetailItem icon={<User />} label="Legal Name" value={selectedApp.name} />
                <DetailItem icon={<Mail />} label="Comm channel" value={selectedApp.email} />
                <DetailItem icon={<Phone />} label="Relay Phone" value={selectedApp.phone} />
                <DetailItem icon={<MapPin />} label="ID / NIC Tag" value={selectedApp.nic} />
                <DetailItem icon={<Briefcase />} label="Operational Status" value={selectedApp.currentlyWorking === 'yes' ? 'Actively Engaged' : 'Free Agent'} />
                <DetailItem icon={<Calendar />} label="Earliest Deployment" value={selectedApp.availableFrom} />
              </div>

              {/* Strategy/Role Box */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CheckCircle2 size={80} className="text-amber-500" />
                </div>
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[.3em] mb-6">Strategic Alignment</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Target Position</p>
                    <p className="text-xl font-black text-amber-500 uppercase italic tracking-tighter">{selectedApp.preferredRole}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Engagement Model</p>
                    <p className="text-xl font-black text-white uppercase italic tracking-tighter">{selectedApp.employmentType}</p>
                  </div>
                </div>
              </div>

              {/* Intel / Notes */}
              <div>
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[.3em] mb-4">Candidate Intelligence</h3>
                <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 text-sm text-zinc-400 leading-relaxed font-medium italic">
                  "{selectedApp.notes || "No supplemental intel provided by candidate."}"
                </div>
              </div>

              {/* Timestamp Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                  <Clock size={12} />
                  Logged: {selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleString() : 'N/A'}
                </div>
                <button 
                  onClick={closeDetails}
                  className="px-10 py-4 bg-amber-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                  Terminate Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

/* Helper Component for Dossier Rows */
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 text-zinc-700">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-white font-bold text-sm tracking-tight uppercase">{value || 'N/A'}</p>
    </div>
  </div>
);

export default AdminCareers;

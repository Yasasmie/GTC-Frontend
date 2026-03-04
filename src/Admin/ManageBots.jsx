// src/Admin/ManageBots.jsx
import React, { useEffect, useState } from 'react';
import {
  adminListBots,
  adminCreateBot,
  adminUpdateBot,
  adminDeleteBot,
} from '../api';
import { Plus, Edit3, Trash2, Cpu, DollarSign, Clock, X, AlertCircle } from 'lucide-react';

const ManageBots = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentBot, setCurrentBot] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    cost: '',
    subscriptionFee: '',
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadBots = async () => {
    setLoading(true);
    try {
      const data = await adminListBots();
      setBots(data);
    } catch (err) {
      console.error(err);
      setError('System failure: Unable to synchronize bot list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBots();
  }, []);

  const openAddModal = () => {
    setError('');
    setForm({ name: '', price: '', cost: '', subscriptionFee: '' });
    setIsAddModalOpen(true);
  };

  const openEditModal = bot => {
    setError('');
    setCurrentBot(bot);
    setForm({
      name: bot.name,
      price: bot.price.toString(),
      cost: bot.cost.toString(),
      subscriptionFee: bot.subscriptionFee.toString(),
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = bot => {
    setError('');
    setCurrentBot(bot);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentBot(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) { setError('Bot identifier is required.'); return false; }
    if (!form.price || isNaN(Number(form.price))) { setError('Invalid price format.'); return false; }
    if (!form.cost || isNaN(Number(form.cost))) { setError('Invalid cost format.'); return false; }
    if (!form.subscriptionFee || isNaN(Number(form.subscriptionFee))) { setError('Invalid fee format.'); return false; }
    return true;
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    try {
      setSaving(true);
      const created = await adminCreateBot({
        name: form.name.trim(),
        price: Number(form.price),
        cost: Number(form.cost),
        subscriptionFee: Number(form.subscriptionFee),
      });
      setBots(prev => [created, ...prev]);
      closeAllModals();
    } catch (err) {
      setError('Failed to initialize new bot unit.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    if (!currentBot) return;
    setError('');
    if (!validateForm()) return;
    try {
      setSaving(true);
      const updated = await adminUpdateBot(currentBot.id, {
        name: form.name.trim(),
        price: Number(form.price),
        cost: Number(form.cost),
        subscriptionFee: Number(form.subscriptionFee),
      });
      setBots(prev => prev.map(b => (b.id === updated.id ? updated : b)));
      closeAllModals();
    } catch (err) {
      setError('Failed to reconfigure bot unit.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentBot) return;
    setError('');
    try {
      setDeleting(true);
      await adminDeleteBot(currentBot.id);
      setBots(prev => prev.filter(b => b.id !== currentBot.id));
      closeAllModals();
    } catch (err) {
      setError('Decommissioning failed.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDateTime = iso => iso ? new Date(iso).toLocaleDateString() : 'N/A';

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 text-amber-500">
              <Cpu size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Hardware Configuration</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">
              Bot <span className="text-amber-500">Management</span>
            </h1>
          </div>
          <button
            onClick={openAddModal}
            className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90" />
            Initialize Bot
          </button>
        </header>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Desktop Table View */}
        <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/20 border-t-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Accessing Core...</span>
            </div>
          ) : bots.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-zinc-600 font-black uppercase tracking-widest text-sm">
              No active bot units detected.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-900/30 border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Unit ID</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Bot Designation</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Market Price</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Oper. Cost</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Sub Fee</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bots.map(bot => (
                    <tr key={bot.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6 font-mono text-[10px] text-zinc-600">#{bot.id.toString().slice(-6)}</td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-white uppercase tracking-tight italic group-hover:text-amber-500 transition-colors">
                          {bot.name}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-mono text-sm text-zinc-300">${bot.price}</td>
                      <td className="px-8 py-6 font-mono text-sm text-zinc-300">${bot.cost}</td>
                      <td className="px-8 py-6 font-mono text-sm text-amber-500/80">${bot.subscriptionFee}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => openEditModal(bot)}
                            className="p-2 bg-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(bot)}
                            className="p-2 bg-white/5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 size={16} />
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

      {/* MODAL OVERLAYS - Re-themed for High-Security UI */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-zinc-900/20 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                {isAddModalOpen ? 'Initialize Unit' : 'Reconfigure Unit'}
              </h2>
              <button onClick={closeAllModals} className="text-zinc-500 hover:text-white transition-colors"><X /></button>
            </div>
            <form onSubmit={isAddModalOpen ? handleCreate : handleUpdate} className="p-8 space-y-6">
              <div className="space-y-4">
                <FormInput label="Designation Name" name="name" value={form.name} onChange={handleChange} placeholder="Unit Alpha-7" />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Deployment Price" name="price" type="number" value={form.price} onChange={handleChange} placeholder="0.00" />
                  <FormInput label="Base Oper. Cost" name="cost" type="number" value={form.cost} onChange={handleChange} placeholder="0.00" />
                </div>
                <FormInput label="Monthly Subscription Fee" name="subscriptionFee" type="number" value={form.subscriptionFee} onChange={handleChange} placeholder="0.00" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeAllModals} className="flex-1 px-6 py-4 rounded-2xl border border-white/5 text-zinc-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">Abort</button>
                <button type="submit" disabled={saving} className="flex-1 px-6 py-4 rounded-2xl bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all disabled:opacity-50">
                  {saving ? 'Processing...' : (isAddModalOpen ? 'Commit Unit' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && currentBot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-[#0A0A0A] border border-red-500/20 rounded-[2rem] w-full max-w-sm p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={28} />
            </div>
            <h2 className="text-xl font-black text-white uppercase italic mb-2 tracking-tighter">Decommission Unit?</h2>
            <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-8">
              This will permanently purge <span className="text-white font-bold">{currentBot.name}</span> from the active fleet.
            </p>
            <div className="flex gap-3">
              <button onClick={closeAllModals} className="flex-1 px-4 py-3 rounded-xl border border-white/5 text-zinc-500 font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all">
                {deleting ? 'Purging...' : 'Confirm Purge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Internal Form Helper */
const FormInput = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-zinc-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-zinc-700 font-mono"
    />
  </div>
);

export default ManageBots;
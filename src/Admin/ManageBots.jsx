// src/Admin/ManageBots.jsx
import React, { useEffect, useState } from 'react';
import {
  adminListBots,
  adminCreateBot,
  adminUpdateBot,
  adminDeleteBot,
} from '../api';

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
      setError('Failed to load bots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBots();
  }, []);

  const openAddModal = () => {
    setError('');
    setForm({
      name: '',
      price: '',
      cost: '',
      subscriptionFee: '',
    });
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
    if (!form.name.trim()) {
      setError('Bot Name is required.');
      return false;
    }
    if (!form.price || isNaN(Number(form.price))) {
      setError('Bot Price must be a number.');
      return false;
    }
    if (!form.cost || isNaN(Number(form.cost))) {
      setError('Bot Cost must be a number.');
      return false;
    }
    if (!form.subscriptionFee || isNaN(Number(form.subscriptionFee))) {
      setError('Subscription Fee must be a number.');
      return false;
    }
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
      setBots(prev => [created, ...prev]); // newest first
      closeAllModals();
    } catch (err) {
      console.error(err);
      setError('Failed to create bot.');
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
      console.error(err);
      setError('Failed to update bot.');
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
      console.error(err);
      setError('Failed to delete bot.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDateTime = iso => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="p-1 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900">
              Manage Bots
            </h1>
            <p className="text-slate-600">
              Create and manage trading bots and pricing.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-2xl bg-slate-900 text-white font-semibold shadow hover:bg-slate-800"
          >
            Add Bot
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-2">
            {error}
          </p>
        )}

        {/* Table */}
        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : bots.length === 0 ? (
          <div className="min-h-[200px] flex items-center justify-center text-slate-500">
            No bots created yet. Click &quot;Add Bot&quot; to create one.
          </div>
        ) : (
          <div className="bg-white/80 rounded-3xl border border-slate-200/50 overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Bot Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Initial Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Subscription Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bots.map(bot => (
                    <tr key={bot.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm font-medium text-slate-700">
                        {bot.id}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {bot.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        ${bot.price}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        ${bot.cost}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        ${bot.subscriptionFee}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {formatDateTime(bot.createdAt)}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(bot)}
                            className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(bot)}
                            className="px-3 py-1 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                          >
                            Delete
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

        {/* Add Bot Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Add Bot
              </h2>
              {error && (
                <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Bot Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Bot Price
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Bot Cost
                  </label>
                  <input
                    name="cost"
                    type="number"
                    step="0.01"
                    value={form.cost}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Subscription Fee
                  </label>
                  <input
                    name="subscriptionFee"
                    type="number"
                    step="0.01"
                    value={form.subscriptionFee}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeAllModals}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Bot Modal */}
        {isEditModalOpen && currentBot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Edit Bot
              </h2>
              {error && (
                <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Bot Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Bot Price
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Bot Cost
                  </label>
                  <input
                    name="cost"
                    type="number"
                    step="0.01"
                    value={form.cost}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Subscription Fee
                  </label>
                  <input
                    name="subscriptionFee"
                    type="number"
                    step="0.01"
                    value={form.subscriptionFee}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeAllModals}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete confirmation */}
        {isDeleteModalOpen && currentBot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Delete Bot
              </h2>
              <p className="text-sm text-slate-700 mb-4">
                Are you sure you want to delete the bot{' '}
                <span className="font-semibold">{currentBot.name}</span>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBots;

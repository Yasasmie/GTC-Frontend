// src/Admin/UserBotsDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Clock, DollarSign } from 'lucide-react';
import { adminGetUserBots, adminListUsers, getUserAccounts } from '../api';

const UserBotsDetail = () => {
  const { id } = useParams(); // user id (numeric)
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');

  const [user, setUser] = useState(null);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const [users, userBots, userAccounts] = await Promise.all([
        adminListUsers(),
        adminGetUserBots(uid),
        getUserAccounts(uid)
      ]);

      const found = users.find(u => String(u.id) === String(id));
      setUser(found || null);

      // Enrich bots with accountType from accounts if available
      const enrichedBots = userBots.map(bot => {
        const account = userAccounts.find(a => a.id === bot.brokerAccountId);
        return {
          ...bot,
          accountType: bot.accountType || account?.accountType || 'N/A',
          tradingPlatform: bot.tradingPlatform || account?.tradingPlatform || 'MT5',
        };
      });
      setBots(enrichedBots);
    } catch (err) {
      console.error('Failed to load user bots detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, id]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-500/20 border-t-amber-500"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 animate-pulse">
          Loading User Bots...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400">
      <div className="max-w-[1200px] mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-amber-500"
          >
            <ArrowLeft size={14} />
            Back to Operator Registry
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-2">
            User <span className="text-amber-500">Bots</span>
          </h1>
          {user && (
            <p className="text-xs text-zinc-500 uppercase tracking-[0.2em]">
              {user.email} // {user.name || 'Anonymous Operator'}
            </p>
          )}
        </div>

        {user && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <div className="bg-zinc-950 border border-white/5 p-6 rounded-3xl">
              <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Total Sales</p>
              <p className="text-2xl font-black text-white italic">{user.totalSells || 0}</p>
            </div>
            <div className="bg-zinc-950 border border-white/5 p-6 rounded-3xl">
              <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-black text-amber-500 italic">${(user.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-zinc-950 border border-white/5 p-6 rounded-3xl">
              <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Status</p>
              <p className="text-sm font-black text-emerald-500 uppercase mt-2 italic">{user.status}</p>
            </div>
            <div className="bg-zinc-950 border border-white/5 p-6 rounded-3xl">
              <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Account Created</p>
              <p className="text-[11px] font-bold text-zinc-400 mt-2">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        )}

        {bots.length === 0 ? (
          <p className="text-sm text-zinc-500">
            This operator has not purchased or been assigned any bots yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bots.map(bot => (
              <div
                key={bot.id}
                onClick={() => {
                  setSelectedBot(bot);
                  setShowModal(true);
                }}
                className="bg-zinc-950 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 cursor-pointer hover:border-amber-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                      <Cpu size={18} className="text-zinc-500 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tight">
                        {bot.botName || 'Trading Bot'}
                      </p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
                        #{bot.id}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg ${
                      bot.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : bot.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {bot.status || 'pending'}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-500 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(bot.createdAt).toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <DollarSign size={12} />
                    {bot.price != null ? `$${bot.price}` : 'N/A'}
                  </span>
                </div>

                <div className="mt-2 text-[10px] font-black uppercase tracking-[0.1em] text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view full details
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bot Detail Modal */}
      {showModal && selectedBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic tracking-tighter uppercase text-white">Bot Details</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Purchase ID: {selectedBot.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Bot Type</p>
                      <p className="text-sm text-zinc-300">{selectedBot.botType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Status</p>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg inline-block ${
                        selectedBot.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 
                        selectedBot.status === 'rejected' ? 'bg-rose-500/10 text-rose-400' : 
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {selectedBot.status || 'pending'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Broker Provider</p>
                      <p className="text-sm text-white font-bold">{selectedBot.broker || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Account Type</p>
                      <p className="text-sm text-white font-bold tracking-tight uppercase">{selectedBot.accountType || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Account ID</p>
                      <p className="text-sm text-zinc-300 font-mono italic">{selectedBot.accountNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Platform</p>
                      <p className="text-sm text-amber-500 font-black uppercase">{selectedBot.tradingPlatform || 'MT5'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Bot Model</p>
                      <p className="text-sm text-zinc-300 font-bold">{selectedBot.botModel || 'N/A'}</p>
                    </div>
                    <div />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Licence Fee</p>
                    <p className="text-2xl font-black text-amber-500 italic">
                      {selectedBot.price != null ? `$${selectedBot.price}` : 'N/A'}
                    </p>
                  </div>
                </div>
            </div>
            <div className="px-8 py-4 bg-zinc-900/50 flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all"
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

export default UserBotsDetail;

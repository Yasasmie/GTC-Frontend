// src/Admin/UserBotsDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Clock, DollarSign } from 'lucide-react';
import { adminGetUserBots, adminListUsers } from '../api';

const UserBotsDetail = () => {
  const { id } = useParams(); // user id (numeric)
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');

  const [user, setUser] = useState(null);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const users = await adminListUsers();
      const found = users.find(u => String(u.id) === String(id));
      setUser(found || null);

      const userBots = await adminGetUserBots(uid);
      setBots(userBots);
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
              {user.name || 'Anonymous Operator'} // {user.email}
            </p>
          )}
        </div>

        {bots.length === 0 ? (
          <p className="text-sm text-zinc-500">
            This operator has not purchased or been assigned any bots yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bots.map(bot => (
              <div
                key={bot.id}
                className="bg-zinc-950 border border-white/5 rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center">
                      <Cpu size={18} className="text-amber-500" />
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
                  <span className="inline-flex items-center gap-1">
                    Broker: {bot.broker || 'N/A'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    Account: {bot.accountNumber || 'N/A'}
                  </span>
                </div>

                {bot.signedAgreementUrl && (
                  <a
                    href={bot.signedAgreementUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4"
                  >
                    View signed agreement
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBotsDetail;

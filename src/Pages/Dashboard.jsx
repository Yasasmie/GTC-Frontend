import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Users, 
  Wallet, 
  Trophy, 
  ArrowUpRight, 
  History, 
  TrendingUp 
} from 'lucide-react';

const Dashboard = ({ currentUser }) => {
  const [copied, setCopied] = useState(false);
  const [earnings, setEarnings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    currentPackageAmount: 50.00,
    currentPackageName: 'Gold Tier Package',
    accountsCount: 1,
    activePackagesCount: 9,
    teamCount: 2,
    totalCommission: 125.50,
  });

  // Protect against undefined currentUser
  const referralLink = currentUser
    ? `${window.location.origin}/register?ref=${currentUser.uid || currentUser.id}`
    : `${window.location.origin}/register?ref=GOLDFX_USER`;

  const handleCopy = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    // Placeholder for future Firebase/Backend data fetching
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">
            Market <span className="text-amber-500">Overview</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Home / Dashboard</p>
        </div>
        <div className="bg-zinc-900/50 border border-amber-500/20 px-4 py-2 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">System Active</span>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-zinc-950 rounded-3xl border border-white/5 p-6 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
        
        <div className="relative z-10">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">
            Your Affiliate Network Link
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-gray-300 font-mono truncate">
              {referralLink}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/10 min-w-[140px]"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'COPIED' : 'COPY LINK'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Investment Portfolio"
          subTitle={stats.currentPackageName}
          value={`$${stats.currentPackageAmount.toFixed(2)}`}
          growth={`+$${stats.totalCommission.toFixed(2)} Profit`}
          icon={<Wallet className="text-amber-500" size={24} />}
        />
        <StatCard 
          title="Active Accounts"
          value={stats.accountsCount}
          subTitle="Live Licenses"
          growth={`${stats.activePackagesCount} Active Nodes`}
          icon={<TrendingUp className="text-amber-500" size={24} />}
        />
        <StatCard 
          title="Team Network"
          subTitle="Direct Referrals"
          value={stats.teamCount}
          growth="Total Members"
          icon={<Users className="text-amber-500" size={24} />}
        />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Earnings Table */}
        <TableContainer title="Earnings Breakdown" icon={<Trophy size={20} className="text-amber-500" />}>
          {earnings.length === 0 ? (
            <EmptyState message="No earning records detected" />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  {['Level', 'Account', 'Amount', 'Date'].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {earnings.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-amber-500 font-bold">Lvl {row.level}</td>
                    <td className="px-6 py-4 text-gray-300">{row.userAccount}</td>
                    <td className="px-6 py-4 text-white font-mono">${row.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableContainer>

        {/* Transactions Table */}
        <TableContainer title="Transaction History" icon={<History size={20} className="text-amber-500" />}>
          {transactions.length === 0 ? (
            <EmptyState message="No transaction history found" />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  {['Type', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx, i) => (
                  <tr key={tx.id || i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-300 uppercase text-[10px] tracking-tighter">{tx.type}</td>
                    <td className="px-6 py-4 text-amber-500 font-mono">${tx.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{tx.description}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableContainer>
      </div>
    </div>
  );
};

/* --- Reusable Sub-Components --- */

const StatCard = ({ title, subTitle, value, growth, icon }) => (
  <div className="bg-zinc-950 rounded-3xl border border-white/5 p-6 hover:border-amber-500/30 transition-all duration-300 group shadow-xl">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-amber-500/5 rounded-2xl group-hover:bg-amber-500/10 transition-colors">
        {icon}
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</p>
        <p className="text-[10px] text-amber-500/60 font-bold uppercase mt-1">{subTitle}</p>
      </div>
    </div>
    <div className="space-y-1">
      <h2 className="text-4xl font-black text-white tracking-tighter">{value}</h2>
      <div className="flex items-center gap-1.5 pt-2">
        <ArrowUpRight size={14} className="text-emerald-500" />
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{growth}</span>
      </div>
    </div>
  </div>
);

const TableContainer = ({ title, icon, children }) => (
  <div className="bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
    <div className="p-6 border-b border-white/5 flex items-center gap-3">
      {icon}
      <h3 className="text-sm font-black text-white uppercase tracking-widest">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      {children}
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="p-20 text-center">
    <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
      <TrendingUp size={32} className="text-gray-700" />
    </div>
    <p className="text-gray-600 text-sm italic font-medium">{message}</p>
  </div>
);

export default Dashboard;
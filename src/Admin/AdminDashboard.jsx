import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Cpu, 
  DollarSign, 
  BarChart3, 
  Bell, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPackages: 9,
    totalRevenue: 320.00,
    totalUsers: 15,
    activeNews: 3
  });

  const [recentEarnings] = useState([
    { rank: 1, name: 'Divya Patel', packageName: 'Gold Scalper V2', amount: '$200.00', company: 'NordFX' },
    { rank: 2, name: 'Kishore Kumar', packageName: 'Hedge Master', amount: '$150.00', company: 'Exness' },
    { rank: 3, name: 'Priya Sharma', packageName: 'Gold Scalper V2', amount: '$120.00', company: 'IC Markets' },
    { rank: 4, name: 'Ramesh Kumar', packageName: 'Trend Pro', amount: '$180.00', company: 'NordFX' },
    { rank: 5, name: 'Sita Devi', packageName: 'Gold Scalper V1', amount: '$95.00', company: 'Exness' }
  ]);

  const [news] = useState([
    {
      id: 1,
      title: 'XAUUSD Volatility Alert',
      description: 'Increased spreads detected on major liquidity providers. Adjusting bot slippage parameters.',
      date: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Infrastructure Scale-up',
      description: 'Deployed 4 new AWS instances to handle high-frequency trading latency.',
      date: '1 day ago',
      priority: 'normal'
    },
    {
      id: 3,
      title: 'KYC Protocol v4',
      description: 'Automated identity verification now integrated with global sanctions list.',
      date: '3 days ago',
      priority: 'normal'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalRevenue: Number((prev.totalRevenue + Math.random() * 2).toFixed(2))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans selection:bg-amber-500 selection:text-black">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">System Live // Global Authority</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
              Control <span className="text-amber-500">Center</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-white/5 hover:border-amber-500/50 text-xs font-black uppercase tracking-widest transition-all rounded-xl">
              <Activity size={16} className="text-amber-500" />
              Node Status
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-widest transition-all rounded-xl shadow-lg shadow-amber-500/10">
              <Zap size={16} />
              Instant Action
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Deployments', val: stats.totalPackages, icon: Cpu, color: 'text-amber-500' },
            { label: 'Platform Revenue', val: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500' },
            { label: 'Total Clients', val: stats.totalUsers, icon: Users, color: 'text-blue-500' },
            { label: 'Alert Signals', val: stats.activeNews, icon: Bell, color: 'text-rose-500' },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-950 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <ArrowUpRight size={16} className="text-zinc-700 group-hover:text-amber-500 transition-colors" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{item.label}</p>
              <p className="text-3xl font-black tracking-tight">{item.val}</p>
            </div>
          ))}
        </div>

        {/* Main Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Feed */}
          <div className="lg:col-span-2 bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-amber-500" size={20} />
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">Deployment Revenue Feed</h2>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">REALTIME_STREAMS_ENCRYPTED</span>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-600 border-b border-white/5">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Rank</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Client</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Asset Model</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Value</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest">Gateway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentEarnings.map((earning) => (
                    <tr key={earning.rank} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-mono text-amber-500/50 text-sm">#0{earning.rank}</td>
                      <td className="p-4 font-bold text-sm">{earning.name}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-zinc-400">
                          {earning.packageName}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-emerald-500 text-sm">{earning.amount}</td>
                      <td className="p-4 text-zinc-500 text-xs font-bold uppercase tracking-tighter">{earning.company}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Logs / News */}
          <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center gap-3 bg-zinc-900/30">
              <ShieldCheck className="text-amber-500" size={20} />
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Platform Logs</h2>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {news.map((item) => (
                <div key={item.id} className="p-5 bg-black border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-sm text-zinc-200 group-hover:text-amber-500 transition-colors">
                      {item.title}
                    </h3>
                    {item.priority === 'high' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">{item.date}</span>
                    <TrendingUp size={12} className="text-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
            
            <button className="m-6 p-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
              View All System Events
            </button>
          </div>

        </div>

        {/* Global Footer Note */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">
          <p>© 2026 GOLD FX ADMINISTRATIVE INTERFACE</p>
          <p>AUTHORIZED_SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
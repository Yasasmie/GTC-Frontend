import React, { useState, useEffect } from 'react';
import { adminGetResaleHistory } from '../api';
import { 
  History, 
  Search, 
  TrendingUp, 
  User, 
  Bot, 
  Calendar, 
  DollarSign, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

const ResaleHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await adminGetResaleHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load resale history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.botName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.buyerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVolume = history.reduce((sum, item) => sum + item.price, 0);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-500/20 border-t-amber-500"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 animate-pulse">Retrieving Ledger...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 p-8">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Admin // Financial Oversight
              </span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">
              Bot Sales <span className="text-amber-500">History</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-6">
             <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl flex items-center gap-4">
               <div className="p-3 bg-emerald-500/10 rounded-2xl">
                 <DollarSign size={20} className="text-emerald-500" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Marketplace Volume</p>
                  <p className="text-2xl font-black text-white">${totalVolume.toLocaleString()}</p>
               </div>
             </div>

            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search bots or users..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 w-80 bg-white/5 border border-white/5 rounded-2xl focus:border-amber-500/50 outline-none text-xs font-bold text-white uppercase tracking-widest transition-all"
              />
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
           <div className="p-8 border-b border-white/5 bg-zinc-900/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <History className="text-amber-500" size={20} />
                 <h2 className="text-sm font-black uppercase tracking-widest text-white">Transaction Ledger</h2>
              </div>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{filteredHistory.length} successful sales</span>
           </div>

           {filteredHistory.length === 0 ? (
             <div className="py-32 text-center">
                <History size={48} className="text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest italic">No transaction records found in specified range</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-white/5 text-zinc-600">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Transaction ID</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Asset Details</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Seller</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Buyer</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Value</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Timestamp</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6 font-mono text-[10px] text-zinc-600 uppercase">
                          #{item.id.substring(0, 12)}
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-500/10 rounded-lg">
                                 <Bot size={14} className="text-amber-500" />
                              </div>
                              <span className="text-sm font-black text-white uppercase">{item.botName}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <User size={12} className="text-zinc-500" />
                              <span className="text-xs font-bold text-zinc-400">{item.sellerName}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <User size={12} className="text-amber-500/50" />
                              <span className="text-xs font-bold text-white">{item.buyerName}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 font-mono text-emerald-500 font-black text-sm">
                           ${item.price.toLocaleString()}
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase italic">
                              <Calendar size={12} />
                              {new Date(item.date).toLocaleString()}
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           )}
        </div>

        {/* Global Footer Note */}
        <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 italic">
          <p>AUTHORIZED LEDGER VIEW // DATA REPLICATION ENCRYPTED</p>
          <TrendingUp size={16} />
        </div>
      </div>
    </div>
  );
};

export default ResaleHistory;

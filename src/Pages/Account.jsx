import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { getUserAccounts, createUserAccount } from '../api';
import { Plus, Wallet, Shield, Globe, Hash, X, Loader2 } from 'lucide-react';

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [broker, setBroker] = useState('XM');
  const [accountType, setAccountType] = useState('Standard account');
  const [accountNumber, setAccountNumber] = useState('');

  const [error, setError] = useState('');
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    const loadAccounts = async () => {
      if (!user) {
        setLoadingAccounts(false);
        return;
      }
      try {
        const data = await getUserAccounts(user.uid);
        setAccounts(data);
      } catch (err) {
        console.error('Failed to load accounts', err);
      } finally {
        setLoadingAccounts(false);
      }
    };

    loadAccounts();
  }, [user]);

  const openModal = () => {
    setError('');
    setBroker('XM');
    setAccountType('Standard account');
    setAccountNumber('');
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleCreateAccount = async e => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!accountNumber.trim()) {
      setError('Broker account number is required.');
      setIsSubmitting(false);
      return;
    }

    if (!user) {
      setError('Session expired. Please log in.');
      setIsSubmitting(false);
      return;
    }

    try {
      const created = await createUserAccount(user.uid, {
        broker,
        accountType,
        accountNumber: accountNumber.trim(),
      });
      setAccounts(prev => [...prev, created]);
      setIsModalOpen(false);
    } catch (err) {
      setError('Gateway error. Please verify account details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
              Trading <span className="text-amber-500">Accounts</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Link and manage your external broker portfolios</p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Plus size={20} strokeWidth={3} />
            ADD ACCOUNT
          </button>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Shield className="text-amber-500" size={24} />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Add License</h2>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-tighter">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreateAccount} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Preferred Broker</label>
                    <select
                      value={broker}
                      onChange={e => setBroker(e.target.value)}
                      className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm font-bold"
                    >
                      <option value="XM">XM Global</option>
                      <option value="Nord fx">Nord FX</option>
                      <option value="Momaxa">Momaxa Markets</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Account Category</label>
                    <select
                      value={accountType}
                      onChange={e => setAccountType(e.target.value)}
                      className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm font-bold"
                    >
                      <option value="Standard account">Standard Account</option>
                      <option value="cents account">Cents Account</option>
                      <option value="demo account">Demo Account</option>
                      <option value="copy trading account">Copy Trading</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">MT4/MT5 Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm font-bold placeholder-gray-700"
                      placeholder="e.g. 8829102"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'INITIALIZE CONNECTION'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Accounts Display */}
        <div className="bg-zinc-950 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/30">
            <div className="flex items-center gap-3">
              <Wallet className="text-amber-500" size={20} />
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Linked Portfolios</h2>
            </div>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black rounded-full border border-amber-500/20 uppercase tracking-widest">
              Total: {accounts.length}
            </span>
          </div>

          {loadingAccounts ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-amber-500" size={32} />
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Synchronizing...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="py-24 text-center">
              <div className="inline-flex p-5 rounded-full bg-white/5 mb-4">
                <Globe size={40} className="text-zinc-800" />
              </div>
              <p className="text-gray-500 text-sm font-medium italic max-w-xs mx-auto">
                No active broker connections found. Connect your first account to start trading.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/5">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Index</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Broker Provider</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Account ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {accounts.map((acc, index) => (
                    <tr key={acc.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5 text-sm font-mono text-gray-600">
                        {(index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-sm font-black text-white">{acc.broker}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">{acc.accountType}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-amber-500 font-mono text-sm">
                          <Hash size={14} className="opacity-50" />
                          {acc.accountNumber}
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
    </div>
  );
};

export default Account;
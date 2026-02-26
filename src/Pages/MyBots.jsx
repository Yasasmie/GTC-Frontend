import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import {
  getUserAccounts,
  getUserBots,
  createUserBot,
  getUserByUid,
  adminListBots,
} from '../api';
import { 
  Cpu, 
  Plus, 
  FileText, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  X,
  Loader2,
  DollarSign
} from 'lucide-react';

const Bots = () => {
  const [accounts, setAccounts] = useState([]);
  const [botsCatalog, setBotsCatalog] = useState([]);
  const [userBots, setUserBots] = useState([]);

  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingBots, setLoadingBots] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);

  const [userRecord, setUserRecord] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);

  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedBotId, setSelectedBotId] = useState('');
  const [signedAgreementFile, setSignedAgreementFile] = useState(null);

  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const firebaseUser = auth.currentUser;

  useEffect(() => {
    const loadData = async () => {
      if (!firebaseUser) {
        setLoadingAccounts(false);
        setLoadingBots(false);
        setLoadingUser(false);
        return;
      }
      try {
        const [accData, catalog, myBots, userRec] = await Promise.all([
          getUserAccounts(firebaseUser.uid),
          adminListBots(),
          getUserBots(firebaseUser.uid),
          getUserByUid(firebaseUser.uid),
        ]);
        setAccounts(accData);
        setBotsCatalog(catalog);
        setUserBots(myBots);
        setUserRecord(userRec);
      } catch (err) {
        console.error('Failed to load bots data', err);
      } finally {
        setLoadingAccounts(false);
        setLoadingBots(false);
        setLoadingUser(false);
      }
    };
    loadData();
  }, [firebaseUser]);

  const isKycApproved =
    userRecord &&
    (userRecord.kycStatus || '').toLowerCase() === 'approved';

  const openAddModal = () => {
    setError('');
    setSelectedAccountId(accounts[0]?.id || '');
    setSelectedBotId(botsCatalog[0]?.id || '');
    setSignedAgreementFile(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const handleCreateBot = async e => {
    e.preventDefault();
    setError('');

    if (!firebaseUser) {
      setError('Authentication required.');
      return;
    }

    if (!isKycApproved) {
      setError('Identity verification (KYC) must be approved first.');
      return;
    }

    if (!selectedAccountId) {
      setError('Please select an active broker account.');
      return;
    }
    if (!selectedBotId) {
      setError('Please select a bot model.');
      return;
    }
    if (!signedAgreementFile) {
      setError('Please upload the signed service agreement.');
      return;
    }

    const fakeUrl = `/signed-agreements/${signedAgreementFile.name}`;

    try {
      setCreating(true);
      const created = await createUserBot(firebaseUser.uid, {
        brokerAccountId: Number(selectedAccountId),
        botId: Number(selectedBotId),
        signedAgreementUrl: fakeUrl,
      });
      setUserBots(prev => [...prev, created]);
      setIsAddModalOpen(false);
    } catch (err) {
      setError('Deployment failed. Internal server error.');
    } finally {
      setCreating(false);
    }
  };

  const isGlobalLoading = loadingAccounts || loadingBots || loadingUser;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
              Bot <span className="text-amber-500">Fleet</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Automated algorithmic trading deployments</p>
          </div>
          <button
            onClick={openAddModal}
            disabled={isGlobalLoading || accounts.length === 0 || !isKycApproved || botsCatalog.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-30 disabled:grayscale"
          >
            <Plus size={20} strokeWidth={3} />
            DEPLOY BOT
          </button>
        </div>

        {/* Status Notifications */}
        <div className="space-y-4 mb-8">
          {!loadingUser && userRecord && !isKycApproved && (
            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-amber-500">
              <AlertCircle size={20} />
              <p className="text-xs font-bold uppercase tracking-widest">Action Required: KYC Approval Pending</p>
            </div>
          )}
          
          {!loadingAccounts && accounts.length === 0 && (
            <div className="flex items-center gap-3 bg-zinc-900 border border-white/5 p-4 rounded-2xl text-gray-400">
              <AlertCircle size={20} />
              <p className="text-xs font-bold uppercase tracking-widest">Connect a broker account to enable bot deployment</p>
            </div>
          )}
        </div>

        {isGlobalLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-amber-500" size={32} />
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Synchronizing Systems...</p>
          </div>
        ) : (
          <div className="bg-zinc-950 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/30">
              <div className="flex items-center gap-3">
                <Cpu className="text-amber-500" size={20} />
                <h2 className="text-sm font-black uppercase tracking-widest text-white">Active Deployments</h2>
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Load: {userBots.length} Unit(s)</span>
            </div>

            {userBots.length === 0 ? (
              <div className="py-24 text-center">
                <div className="inline-flex p-5 rounded-full bg-white/5 mb-4">
                  <Cpu size={40} className="text-zinc-800" />
                </div>
                <p className="text-gray-500 text-sm font-medium italic max-w-xs mx-auto">
                  No active bot configurations found. Initialize a deployment to begin.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-white/5">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Index</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Deployment Target</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Bot Model</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">License Fee</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Legal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {userBots.map((b, index) => (
                      <tr key={b.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5 text-sm font-mono text-gray-600">{(index + 1).toString().padStart(2, '0')}</td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-white">{b.broker}</p>
                          <p className="text-[10px] text-amber-500/70 font-mono tracking-tighter">ID: {b.accountNumber}</p>
                        </td>
                        <td className="px-8 py-5 font-bold text-gray-300 text-sm">{b.botName}</td>
                        <td className="px-8 py-5 font-mono text-amber-500 text-sm">${b.price}</td>
                        <td className="px-8 py-5">
                          <a href="#" className="flex items-center gap-1 text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                            <FileText size={12} className="text-amber-500" />
                            View Terms
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add Bot Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-xl relative overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Cpu className="text-amber-500" size={24} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight">System Deployment</h2>
                  </div>
                  <button onClick={closeAddModal} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-tighter">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreateBot} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Target Account</label>
                      <select
                        value={selectedAccountId}
                        onChange={e => setSelectedAccountId(Number(e.target.value))}
                        className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm font-bold"
                      >
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.broker} - {acc.accountNumber}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bot Algorithm</label>
                      <select
                        value={selectedBotId}
                        onChange={e => setSelectedBotId(Number(e.target.value))}
                        className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm font-bold"
                      >
                        {botsCatalog.map(bot => (
                          <option key={bot.id} value={bot.id}>{bot.name} (${bot.price})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-black border border-white/10 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-amber-500" />
                        <span className="text-xs font-black uppercase tracking-widest">Service Agreement</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setIsAgreementOpen(true)}
                        className="text-[10px] font-black text-amber-500 hover:text-amber-400 transition-colors uppercase underline"
                      >
                        Read Terms
                      </button>
                    </div>
                    
                    <div className="relative group">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={e => setSignedAgreementFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center justify-center gap-3 py-6 border-2 border-dashed border-white/10 rounded-2xl group-hover:border-amber-500/50 transition-colors">
                        <Upload size={18} className="text-gray-500" />
                        <span className="text-xs font-bold text-gray-500">
                          {signedAgreementFile ? signedAgreementFile.name : "Upload Signed PDF"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                  >
                    {creating ? <Loader2 className="animate-spin" size={20} /> : 'INITIALIZE DEPLOYMENT'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Agreement Overlay */}
        {isAgreementOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in duration-200">
            <div className="bg-zinc-950 border border-white/10 rounded-[2.5rem] p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <Shield className="text-amber-500" size={24} />
                <h2 className="text-xl font-black uppercase tracking-tight">Legal Disclosures</h2>
              </div>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p><span className="text-amber-500 font-bold uppercase">Risk Warning:</span> Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you.</p>
                <p>By activating this automated system, you acknowledge that Gold FX provides trading software "as-is" without guarantee of performance. All financial decisions and outcomes remain the sole responsibility of the account holder.</p>
                <p>The user agrees to indemnify Gold FX against any losses incurred through algorithmic operations, market volatility, or technical latency.</p>
              </div>
              <button
                onClick={() => setIsAgreementOpen(false)}
                className="mt-8 w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-2xl border border-white/5 transition-colors"
              >
                I UNDERSTAND
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bots;
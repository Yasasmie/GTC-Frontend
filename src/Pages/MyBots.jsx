import React, { useEffect, useState } from 'react';
import {
  getUserAccounts,
  getUserBots,
  createUserBot,
  getUserByUid,
  adminListBots,
  resellUserBot,
  cancelResellUserBot,
  getSellerRequests,
  updateResaleRequestStatus,
  getSaleHistory,
} from '../api';
import { useOutletContext } from 'react-router-dom';
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
  DollarSign,
  Tag,
  ArrowRightLeft,
  History,
  ClipboardCheck,
  Eye,
  Check,
  Ban,
  Shield
} from 'lucide-react';

const isPdfFile = value =>
  typeof value === 'string' &&
  (value.startsWith('data:application/pdf') || value.toLowerCase().endsWith('.pdf'));
const isHttpLink = value =>
  typeof value === 'string' &&
  /^https?:\/\//i.test(value);

const requestStatusLabel = status => {
  if (status === 'pending_admin') return 'waiting for admin';
  return status;
};

const WHATSAPP_NUMBER = '94703755312';

const openWhatsAppRequest = message => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const Bots = () => {
  const { currentUser: firebaseUser, userProfile } = useOutletContext();
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
  const [requestType, setRequestType] = useState('direct_buy');
  const [signedAgreementValue, setSignedAgreementValue] = useState('');
  const [signedAgreementName, setSignedAgreementName] = useState('');
  const [signedAgreementLink, setSignedAgreementLink] = useState('');
  const [paymentSlipValue, setPaymentSlipValue] = useState('');
  const [paymentSlipName, setPaymentSlipName] = useState('');
  const [paymentSlipLink, setPaymentSlipLink] = useState('');

  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  // Resale states
  const [isResaleModalOpen, setIsResaleModalOpen] = useState(false);
  const [resaleBot, setResaleBot] = useState(null);
  const [resalePrice, setResalePrice] = useState('');
  const [reselling, setReselling] = useState(false);

  // Seller Panel states
  const [activeTab, setActiveTab] = useState('my-bots'); // 'my-bots', 'requests', 'history'
  const [requests, setRequests] = useState([]);
  const [saleHistory, setSaleHistory] = useState([]);
  const [loadingSellerData, setLoadingSellerData] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [selectedApprovalRequest, setSelectedApprovalRequest] = useState(null);
  const [adminPaymentSlipValue, setAdminPaymentSlipValue] = useState('');
  const [adminPaymentSlipName, setAdminPaymentSlipName] = useState('');
  const [adminPaymentSlipLink, setAdminPaymentSlipLink] = useState('');

  const isReferredUser = !!userProfile?.referredBy;

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

        // Load seller data if user has listed bots and is NOT a restricted buyer
        if (!isReferredUser && myBots.some(b => b.isForResale)) {
          loadSellerPanelData();
        }
      } catch (err) {
        console.error('Failed to load bots data', err);
      } finally {
        setLoadingAccounts(false);
        setLoadingBots(false);
        setLoadingUser(false);
      }
    };
    loadData();
  }, [firebaseUser, isReferredUser]);

  const loadSellerPanelData = async () => {
    if (!firebaseUser || isReferredUser) return;
    setLoadingSellerData(true);
    try {
      const [reqs, history] = await Promise.all([
        getSellerRequests(firebaseUser.uid),
        getSaleHistory(firebaseUser.uid)
      ]);
      setRequests(reqs);
      setSaleHistory(history);
    } catch (err) {
      console.error('Failed to load seller data', err);
    } finally {
      setLoadingSellerData(false);
    }
  };

  const isKycApproved =
    userRecord &&
    (userRecord.kycStatus || '').toLowerCase() === 'approved';

  const openAddModal = () => {
    setError('');
    setSelectedAccountId(accounts[0]?.id || '');
    setSelectedBotId(botsCatalog[0]?.id || '');
    setRequestType('direct_buy');
    setSignedAgreementValue('');
    setSignedAgreementName('');
    setSignedAgreementLink('');
    setPaymentSlipValue('');
    setPaymentSlipName('');
    setPaymentSlipLink('');
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
    if (!signedAgreementValue && !signedAgreementLink.trim()) {
      setError('Please upload or paste a link for the signed service agreement.');
      return;
    }
    if (!paymentSlipValue && !paymentSlipLink.trim()) {
      setError('Please upload or paste a link for the admin payment slip.');
      return;
    }
    const signedAgreementUrl = signedAgreementLink.trim() || signedAgreementValue;
    const paymentSlip = paymentSlipLink.trim() || paymentSlipValue;

    try {
      setCreating(true);
      const created = await createUserBot(firebaseUser.uid, {
        brokerAccountId: Number(selectedAccountId),
        botId: Number(selectedBotId),
        signedAgreementUrl,
        paymentSlip,
        requestType,
      });
      setUserBots(prev => [...prev, created]);
      setIsAddModalOpen(false);
      const selectedAccount = accounts.find(acc => Number(acc.id) === Number(selectedAccountId));
      const selectedBot = botsCatalog.find(bot => Number(bot.id) === Number(selectedBotId));
      openWhatsAppRequest(
        [
          requestType === 'resell_request' ? 'Resell Bot Request' : 'Direct Bot Request',
          `Client: ${userRecord?.name || firebaseUser?.displayName || firebaseUser?.email || 'Unknown'}`,
          `Email: ${firebaseUser?.email || 'N/A'}`,
          `Bot: ${selectedBot?.name || created.botName}`,
          `Broker: ${selectedAccount?.broker || created.broker || 'N/A'}`,
          `Account Number: ${selectedAccount?.accountNumber || created.accountNumber || 'N/A'}`,
          `Price: $${selectedBot?.price ?? created.price ?? 0}`,
          `Request Type: ${requestType === 'resell_request' ? 'Resell Request' : 'Buying Bot'}`,
          'Payment slip uploaded in system.',
        ].join('\n')
      );
    } catch {
      setError('Deployment failed. Internal server error.');
    } finally {
      setCreating(false);
    }
  };

  const handleUploadAsBase64 = (file, setter, nameSetter) => {
    if (!file) {
      setter('');
      if (nameSetter) nameSetter('');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result || '');
      if (nameSetter) nameSetter(file.name || '');
    };
    reader.readAsDataURL(file);
  };

  const handleResell = async (e) => {
    e.preventDefault();
    if (!resaleBot || !resalePrice) return;

    setReselling(true);
    try {
      await resellUserBot(firebaseUser.uid, resaleBot.id, Number(resalePrice));
      const updatedBots = await getUserBots(firebaseUser.uid);
      setUserBots(updatedBots);
      setIsResaleModalOpen(false);
      setResaleBot(null);
      setResalePrice('');
    } catch (err) {
      console.error(err);
      setError('Failed to list bot for resale');
    } finally {
      setReselling(false);
    }
  };

  const handleCancelResale = async (botId) => {
    try {
      await cancelResellUserBot(firebaseUser.uid, botId);
      const updatedBots = await getUserBots(firebaseUser.uid);
      setUserBots(updatedBots);
    } catch (err) {
      console.error(err);
      setError('Failed to cancel resale');
    }
  };

  const handleRequestStatus = async (requestId, status, slip = null) => {
    try {
      await updateResaleRequestStatus(requestId, status, slip);
      await loadSellerPanelData();
      const updatedBots = await getUserBots(firebaseUser.uid);
      setUserBots(updatedBots);
    } catch (err) {
      alert(err.message || 'Failed to update request');
    }
  };

  const openApproveModal = request => {
    setSelectedApprovalRequest(request);
    setAdminPaymentSlipValue('');
    setAdminPaymentSlipName('');
    setAdminPaymentSlipLink('');
  };

  const handleApproveWithSlip = async e => {
    e.preventDefault();
    const slip = adminPaymentSlipLink.trim() || adminPaymentSlipValue;
    if (!selectedApprovalRequest || !slip) return;
    await handleRequestStatus(selectedApprovalRequest.id, 'approved', slip);
    setSelectedApprovalRequest(null);
    setAdminPaymentSlipValue('');
    setAdminPaymentSlipName('');
    setAdminPaymentSlipLink('');
  };

  const isGlobalLoading = loadingAccounts || loadingBots || loadingUser;

  const openResaleModal = (bot) => {
    setResaleBot(bot);
    setResalePrice(bot.price || '');
    setIsResaleModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
              My <span className="text-amber-500">Bots</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              {isReferredUser ? 'View and monitor your purchased bots' : 'Manage your bot collection and view sales requests'}
            </p>
          </div>
          
          {!isReferredUser && (
            <button
              onClick={openAddModal}
              disabled={isGlobalLoading || accounts.length === 0 || !isKycApproved || botsCatalog.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-30 disabled:grayscale"
            >
              <Plus size={20} strokeWidth={3} />
              ADD NEW BOT
            </button>
          )}
        </div>

        {/* Status Notifications */}
        <div className="space-y-4 mb-8">
          {!loadingUser && userRecord && !isKycApproved && (
            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-amber-500">
              <AlertCircle size={20} />
              <p className="text-xs font-bold uppercase tracking-widest">Action Required: KYC Approval Pending</p>
            </div>
          )}

          {!loadingAccounts && accounts.length === 0 && !isReferredUser && (
            <div className="flex items-center gap-3 bg-zinc-900 border border-white/5 p-4 rounded-2xl text-gray-400">
              <AlertCircle size={20} />
              <p className="text-xs font-bold uppercase tracking-widest">Connect a broker account to enable bot deployment</p>
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-white/5 p-1 rounded-2xl mb-8 w-fit">
          <button
            onClick={() => setActiveTab('my-bots')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'my-bots' ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            My Bots
          </button>
          
          {!isReferredUser && (
            <>
              <button 
                onClick={() => { setActiveTab('requests'); loadSellerPanelData(); }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'requests' ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                Sales Requests
                {requests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] border-2 border-black">
                    {requests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => { setActiveTab('history'); loadSellerPanelData(); }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                Sales History
              </button>
            </>
          )}
        </div>

        {isGlobalLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-amber-500" size={32} />
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Loading...</p>
          </div>
        ) : (
          <div className="bg-zinc-950 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
            {activeTab === 'my-bots' && (
              <>
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/30">
                  <div className="flex items-center gap-3">
                    <Cpu className="text-amber-500" size={20} />
                    <h2 className="text-sm font-black uppercase tracking-widest text-white">Bot List</h2>
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">You have {userBots.length} bot(s)</span>
                </div>

                {userBots.length === 0 ? (
                  <div className="py-24 text-center">
                    <div className="inline-flex p-5 rounded-full bg-white/5 mb-4">
                      <Cpu size={40} className="text-zinc-800" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium italic max-w-xs mx-auto">
                      {isReferredUser ? 'You haven\'t purchased any bots yet. Visit the Bot Shop to get started.' : 'No active bot configurations found. Initialize a deployment to begin.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-white/5">
                          <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">No.</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Account</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Bot Model</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Price Paid</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Purchase Info</th>
                          {!isReferredUser && <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Selling Status</th>}
                          <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Actions</th>
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
                              {b.boughtFrom ? (
                                <div className="space-y-1">
                                  <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                    Purchased From Reseller
                                  </span>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    Seller: {b.boughtFrom}
                                  </p>
                                  {b.amountInAsset != null && (
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                                      Asset Amount: {b.amountInAsset}
                                    </p>
                                  )}
                                </div>
                              ) : b.canResell ? (
                                <span className="text-[10px] font-black text-cyan-500 uppercase">Resell Request Bot</span>
                              ) : (
                                <span className="text-[10px] font-black text-zinc-600 uppercase">Direct Purchase</span>
                              )}
                            </td>
                            {!isReferredUser && (
                              <td className="px-8 py-5">
                                {b.isForResale ? (
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-green-500 uppercase">Listed at ${b.resalePrice}</span>
                                    <button 
                                      onClick={() => handleCancelResale(b.id)}
                                      className="text-[9px] text-red-500 font-bold hover:underline w-fit"
                                    >
                                      Cancel Listing
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-black text-gray-600 uppercase">Private</span>
                                )}
                              </td>
                            )}
                            <td className="px-8 py-5">
                              {!isReferredUser && b.status === 'approved' && !b.isForResale && !b.boughtFrom && b.canResell && (
                                <button 
                                  onClick={() => openResaleModal(b)}
                                  className="flex items-center gap-1 text-[10px] font-black text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest"
                                >
                                  <Tag size={12} />
                                  Sell Bot
                                </button>
                              )}
                              {(b.boughtFrom || isReferredUser) && (
                                <span className="text-[10px] font-black text-gray-700 uppercase italic">Resale Restricted</span>
                              )}
                              {!isReferredUser && b.status === 'approved' && !b.isForResale && !b.boughtFrom && !b.canResell && (
                                <span className="text-[10px] font-black text-gray-700 uppercase italic">Direct Purchase - No Resale</span>
                              )}
                              {b.status !== 'approved' && (
                                <span className="text-[10px] font-black text-gray-600 uppercase italic">Waiting for Approval</span>
                              )}
                              {!isReferredUser && b.isForResale && (
                                <span className="text-[10px] font-black text-green-500/50 uppercase italic">On Market</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {activeTab === 'requests' && (
              <>
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/30">
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="text-amber-500" size={20} />
                    <h2 className="text-sm font-black uppercase tracking-widest text-white">Purchase Requests</h2>
                  </div>
                </div>

                {loadingSellerData ? (
                  <div className="py-24 flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-amber-500" size={32} />
                  </div>
                ) : requests.length === 0 ? (
                  <div className="py-24 text-center">
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">No requests found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="text-left border-b border-white/5">
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Buyer</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Bot</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Broker</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Account Number</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Asset Amount</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Amount</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Payment Slip</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Admin Price</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {requests.map(req => (
                          <tr key={req.id} className="hover:bg-white/[0.02]">
                            <td className="px-8 py-5 font-black text-white lg:whitespace-nowrap">{req.buyerName}</td>
                            <td className="px-8 py-5 font-bold text-gray-400">{req.botName}</td>
                            <td className="px-8 py-5 font-bold text-gray-400">{req.broker}</td>
                            <td className="px-8 py-5 font-mono text-zinc-400">{req.accountNumber}</td>
                            <td className="px-8 py-5 font-mono text-blue-400">{req.amountInAsset}</td>
                            <td className="px-8 py-5 font-mono text-amber-500">${req.price}</td>
                            <td className="px-8 py-5">
                              <button
                                onClick={() => setSelectedSlip(req.paymentSlip)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-[10px] font-black uppercase"
                              >
                                <Eye size={12} /> View Slip
                              </button>
                            </td>
                            <td className="px-8 py-5">
                              <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                  Admin Price
                                </p>
                                <p className="font-mono text-emerald-500">${req.adminPayablePrice}</p>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`px-2 py-0.5 rounded-full font-black uppercase text-[8px] ${req.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                  req.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                    'bg-amber-500/10 text-amber-500'
                                }`}>
                                {requestStatusLabel(req.status)}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              {req.status === 'pending' && (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openApproveModal(req)}
                                    className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-all" title="Approve"
                                  >
                                    <Check size={14} strokeWidth={3} />
                                  </button>
                                  <button
                                    onClick={() => handleRequestStatus(req.id, 'rejected')}
                                    className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-black transition-all" title="Decline"
                                  >
                                    <Ban size={14} strokeWidth={3} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {activeTab === 'history' && (
              <>
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/30">
                  <div className="flex items-center gap-3">
                    <History className="text-amber-500" size={20} />
                    <h2 className="text-sm font-black uppercase tracking-widest text-white">Sales History</h2>
                  </div>
                </div>

                {loadingSellerData ? (
                  <div className="py-24 flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-amber-500" size={32} />
                  </div>
                ) : saleHistory.length === 0 ? (
                  <div className="py-24 text-center">
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">No sales records found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="text-left border-b border-white/5">
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Buyer</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Bot Sold</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Account Number</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Price</th>
                          <th className="px-8 py-5 font-black text-gray-500 uppercase tracking-widest">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {saleHistory.map(item => (
                          <tr key={item.id} className="hover:bg-white/[0.02]">
                            <td className="px-8 py-5 font-black text-white">{item.buyerName}</td>
                            <td className="px-8 py-5 font-bold text-gray-400">{item.botName}</td>
                            <td className="px-8 py-5 text-zinc-500 font-mono">{item.accountNumber}</td>
                            <td className="px-8 py-5 font-mono text-green-500 font-black">+${item.price}</td>
                            <td className="px-8 py-5 text-zinc-500 font-mono italic">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
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
                    <h2 className="text-xl font-black uppercase tracking-tight">Add New Bot</h2>
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
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Connect to Account</label>
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
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Choose Bot Model</label>
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

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Request Mode</label>
                    <select
                      value={requestType}
                      onChange={e => setRequestType(e.target.value)}
                      className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm font-bold"
                    >
                      <option value="direct_buy">Buying Bot (No Resale)</option>
                      <option value="resell_request">Resell Request (Resale Enabled After Approval)</option>
                    </select>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {requestType === 'resell_request'
                        ? 'This request asks admin for a resale-eligible bot.'
                        : 'Direct buy bots are for personal use and cannot be resold.'}
                    </p>
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
                        onChange={e => handleUploadAsBase64(e.target.files?.[0] || null, setSignedAgreementValue, setSignedAgreementName)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center justify-center gap-3 py-6 border-2 border-dashed border-white/10 rounded-2xl group-hover:border-amber-500/50 transition-colors">
                        <Upload size={18} className="text-gray-500" />
                        <span className="text-xs font-bold text-gray-500">
                          {signedAgreementName || 'Upload Signed PDF'}
                        </span>
                      </div>
                    </div>
                    <input
                      type="url"
                      value={signedAgreementLink}
                      onChange={e => setSignedAgreementLink(e.target.value)}
                      placeholder="Or paste signed agreement link (https://...)"
                      className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-2xl text-xs text-white outline-none focus:ring-1 focus:ring-amber-500/50"
                    />

                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={e => handleUploadAsBase64(e.target.files?.[0] || null, setPaymentSlipValue, setPaymentSlipName)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center justify-center gap-3 py-6 border-2 border-dashed border-white/10 rounded-2xl group-hover:border-amber-500/50 transition-colors">
                        <Upload size={18} className="text-gray-500" />
                        <span className="text-xs font-bold text-gray-500">
                          {paymentSlipName || 'Upload Admin Payment Slip'}
                        </span>
                      </div>
                    </div>
                    <input
                      type="url"
                      value={paymentSlipLink}
                      onChange={e => setPaymentSlipLink(e.target.value)}
                      placeholder="Or paste payment slip link (https://...)"
                      className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-2xl text-xs text-white outline-none focus:ring-1 focus:ring-amber-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                  >
                    {creating ? <Loader2 className="animate-spin" size={20} /> : 'CONFIRM AND ADD BOT'}
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

        {/* Resale Modal */}
        {isResaleModalOpen && resaleBot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-md relative overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <DollarSign className="text-green-500" size={24} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Sell Your Bot</h2>
                  </div>
                  <button onClick={() => setIsResaleModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-2">You are putting your <span className="text-white font-bold">{resaleBot.botName}</span> bot up for sale in the shop.</p>
                  <p className="text-[10px] text-gray-500 uppercase">Original Price: ${resaleBot.price}</p>
                </div>

                <form onSubmit={handleResell} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Set Your Price (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={resalePrice}
                        onChange={e => setResalePrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3.5 bg-black border border-white/10 rounded-2xl focus:ring-1 focus:ring-green-500/50 outline-none text-sm font-bold text-green-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={reselling}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-black font-black rounded-2xl transition-all shadow-lg shadow-green-500/10 flex items-center justify-center gap-2"
                  >
                    {reselling ? <Loader2 className="animate-spin" size={20} /> : 'PUT UP FOR SALE'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {selectedApprovalRequest && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-white">Approve Resale</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">
                      Upload the admin payment slip for the actual bot price before releasing the bot.
                    </p>
                  </div>
                  <button onClick={() => setSelectedApprovalRequest(null)} className="text-gray-500 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleApproveWithSlip} className="space-y-6">
                  <div className="rounded-3xl border border-white/5 bg-black p-5 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bot</p>
                    <p className="text-lg font-black uppercase text-white">{selectedApprovalRequest.botName}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Client pays ${selectedApprovalRequest.price} | Admin payable (65%) ${selectedApprovalRequest.adminPayablePrice}
                    </p>
                  </div>

                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={e => handleUploadAsBase64(e.target.files?.[0] || null, setAdminPaymentSlipValue, setAdminPaymentSlipName)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center justify-center gap-3 py-6 border-2 border-dashed border-white/10 rounded-2xl group-hover:border-amber-500/50 transition-colors">
                        <Upload size={18} className="text-gray-500" />
                        <span className="text-xs font-bold text-gray-500">
                        {adminPaymentSlipName || 'Upload Admin Price Payment Slip'}
                        </span>
                      </div>
                    </div>
                    <input
                      type="url"
                      value={adminPaymentSlipLink}
                      onChange={e => setAdminPaymentSlipLink(e.target.value)}
                      placeholder="Or paste admin payment slip link (https://...)"
                      className="w-full px-4 py-3.5 bg-black border border-white/10 rounded-2xl text-xs text-white outline-none focus:ring-1 focus:ring-amber-500/50"
                    />

                  <button
                    type="submit"
                    disabled={!adminPaymentSlipValue && !adminPaymentSlipLink.trim()}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-2xl transition-all disabled:opacity-30"
                  >
                    Approve And Release Bot
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Slip Review Modal */}
        {selectedSlip && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setSelectedSlip(null)}
          >
            <div className="relative max-w-4xl w-full">
              <button
                className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black uppercase tracking-widest text-[10px] hover:text-amber-500 transition-colors"
                onClick={() => setSelectedSlip(null)}
              >
                Close <X size={20} />
              </button>
              {isPdfFile(selectedSlip) ? (
                <iframe
                  title="Payment Slip"
                  src={selectedSlip}
                  className="w-full h-[80vh] rounded-[2rem] border border-white/10 shadow-2xl bg-white"
                />
              ) : isHttpLink(selectedSlip) ? (
                <div className="w-full h-[80vh] rounded-[2rem] border border-white/10 shadow-2xl bg-zinc-950 flex items-center justify-center">
                  <a
                    href={selectedSlip}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-amber-500 text-black font-black uppercase tracking-widest text-sm"
                  >
                    Open Payment Slip Link
                  </a>
                </div>
              ) : (
                <img
                  src={selectedSlip}
                  alt="Payment Slip"
                  className="w-full h-auto rounded-[2rem] border border-white/10 shadow-2xl"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bots;

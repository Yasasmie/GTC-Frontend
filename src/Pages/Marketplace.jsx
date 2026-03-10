import React, { useEffect, useState } from 'react';
import {
  getResaleMarketplace,
  getUserAccounts,
  submitResaleRequest,
} from '../api';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Cpu,
  X,
  Upload,
} from 'lucide-react';

const WHATSAPP_NUMBER = '94703755312';

const openWhatsAppRequest = message => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const Marketplace = () => {
  const { currentUser: firebaseUser, userProfile } = useOutletContext();
  const [listings, setListings] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [broker, setBroker] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amountInAsset, setAmountInAsset] = useState('');
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const isReferredUser = !!userProfile?.referredBy;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resaleData = await getResaleMarketplace(firebaseUser?.uid);
        setListings(resaleData);
        
        if (firebaseUser) {
          const accs = await getUserAccounts(firebaseUser.uid);
          setAccounts(accs);
          if (accs.length > 0) {
            setSelectedAccountId(String(accs[0].id));
            setBroker(accs[0].broker || '');
            setAccountNumber(accs[0].accountNumber || '');
          }
        }
      } catch (err) {
        setError('Connection failed. Market data unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [firebaseUser]);

  const openPurchaseModal = (listing) => {
    if (!firebaseUser) {
      alert('Authentication required to access marketplace assets.');
      return;
    }
    setSelectedListing(listing);
    setPurchaseModalOpen(true);
    setSuccessMessage('');
    setAmountInAsset('');
    if (accounts.length > 0) {
      setSelectedAccountId(String(accounts[0].id));
      setBroker(accounts[0].broker || '');
      setAccountNumber(accounts[0].accountNumber || '');
    } else {
      setSelectedAccountId('');
      setBroker('');
      setAccountNumber('');
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!selectedListing || !broker || !accountNumber || !amountInAsset || !firebaseUser) return;

    setPurchasing(true);
    setError('');
    
    try {
      await submitResaleRequest({
        uid: firebaseUser.uid,
        botInstanceId: selectedListing.id,
        broker,
        accountNumber,
        amountInAsset: Number(amountInAsset),
        paymentSlip: paymentSlip,
      });
      openWhatsAppRequest(
        [
          'Resale Bot Request',
          `Customer: ${firebaseUser.displayName || firebaseUser.email || 'Unknown'}`,
          `Email: ${firebaseUser.email || 'N/A'}`,
          `Bot: ${selectedListing.botName}`,
          `Reseller: ${selectedListing.sellerName}`,
          `Broker: ${broker}`,
          `Account Number: ${accountNumber}`,
          `Amount In Asset: ${amountInAsset}`,
          `Resale Price: $${selectedListing.resalePrice}`,
          'Payment slip uploaded in system.',
        ].join('\n')
      );
      setSuccessMessage(`Order Placed: Your request for ${selectedListing.botName} has been sent to the seller.`);
      
      setTimeout(() => {
        setPurchaseModalOpen(false);
        setSelectedListing(null);
        setPaymentSlip(null);
        setAmountInAsset('');
        setSuccessMessage('');
      }, 4000);
    } catch (err) {
      setError(err.message || 'Transmission aborted by network security.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentSlip(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAccountSelect = value => {
    setSelectedAccountId(value);
    const account = accounts.find(acc => String(acc.id) === String(value));
    if (account) {
      setBroker(account.broker || '');
      setAccountNumber(account.accountNumber || '');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <ShoppingBag className="text-amber-500" size={24} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">
              Bot <span className="text-amber-500">Shop</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest pl-12">
            {isReferredUser ? 'Buy Trading Bots From Your Linked Client' : 'Buy and Sell Trading Bots'}
          </p>
        </div>

        {/* How it Works / Resale Guide */}
        {!isReferredUser && (
          <div className="mb-12 bg-zinc-950 border border-white/5 rounded-[2rem] p-6">
            <h2 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" />
              How to Resell Your Bots
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
              <div className="space-y-2">
                <p className="font-bold text-white uppercase text-xs">1. Go to "My Bots"</p>
                <p>Find the bot you want to sell in your personal collection.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-white uppercase text-xs">2. Click "Sell Bot"</p>
                <p>Set the price you want to sell it for. The bot must be approved first.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-white uppercase text-xs">3. Approve & Earn</p>
                <p>Review payment slips from buyers. Once you approve, you get paid and they get the bot.</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-amber-500" size={32} />
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Scanning Market Frequencies...</p>
          </div>
        ) : (
          <>
            {listings.length === 0 ? (
              <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] py-24 text-center">
                <div className="inline-flex p-6 rounded-full bg-white/5 mb-6 text-zinc-800">
                  <ShoppingBag size={48} />
                </div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Market is currently silent. No active listings found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <div key={listing.id} className="bg-zinc-950 border border-white/5 rounded-[2rem] p-6 group hover:border-amber-500/30 transition-all duration-500 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                          {listing.botName}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-gray-500" />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{listing.sellerName}</span>
                        </div>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                        <span className="text-amber-500 font-black text-sm font-mono">${listing.resalePrice}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8 flex-grow relative z-10">
                      <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-gray-600">
                        <div className="space-y-1">
                          <p>Type</p>
                          <p className="text-white text-[11px]">{listing.botType}</p>
                        </div>
                        <div className="space-y-1">
                          <p>Model</p>
                          <p className="text-white text-[11px]">{listing.botModel}</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-black/50 border border-white/5 rounded-2xl">
                        <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Performance Index</p>
                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-grow bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-4/5 bg-amber-500" />
                          </div>
                          <span className="text-[10px] font-mono text-amber-500">8.4</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openPurchaseModal(listing)}
                      className="w-full py-4 bg-zinc-900 border border-white/5 hover:bg-amber-500 hover:text-black hover:border-amber-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 relative z-10"
                    >
                      REQUEST PURCHASE
                      <ArrowRight size={16} strokeWidth={3} />
                    </button>
                    
                    {listing.uid === firebaseUser?.uid && (
                      <div className="absolute top-2 left-2 bg-green-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase italic">Your Listing</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Purchase Modal */}
        {purchaseModalOpen && selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-lg relative overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                      <ShoppingBag size={24} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Purchase Request</h2>
                  </div>
                  <button onClick={() => setPurchaseModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                </div>

                {successMessage ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="inline-flex p-4 bg-green-500/10 rounded-full text-green-500 mb-2">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{successMessage}</h3>
                    <p className="text-sm text-gray-500 italic uppercase tracking-tighter text-center max-w-xs mx-auto">Please wait for the seller to approve your purchase.</p>
                  </div>
                ) : (
                  <form onSubmit={handlePurchase} className="space-y-8">
                    <div className="bg-black/50 border border-white/5 p-6 rounded-3xl">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Bot Name</p>
                          <h4 className="text-xl font-black text-white uppercase">{selectedListing.botName}</h4>
                        </div>
                        <p className="text-xl font-mono text-amber-500 font-black">${selectedListing.resalePrice}</p>
                      </div>
                      <div className="flex items-center gap-2 py-3 border-t border-white/5">
                        <User size={14} className="text-amber-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seller: {selectedListing.sellerName}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                        Use Saved Account (Optional)
                      </label>
                      {accounts.length > 0 ? (
                        <select
                          value={selectedAccountId}
                          onChange={e => handleAccountSelect(e.target.value)}
                          className="w-full px-4 py-4 bg-black border border-white/10 rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm font-bold text-white transition-all appearance-none"
                        >
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                              {acc.broker} - {acc.accountNumber} ({acc.accountType})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-4 bg-zinc-900 border border-white/10 rounded-2xl text-[10px] font-black text-zinc-500 uppercase">
                          No saved accounts found. Enter broker and account details manually below.
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                          Broker
                        </label>
                        <input
                          type="text"
                          required
                          value={broker}
                          onChange={e => setBroker(e.target.value)}
                          placeholder="Exness"
                          className="w-full px-4 py-4 bg-black border border-white/10 rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm font-bold text-white transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          required
                          value={accountNumber}
                          onChange={e => setAccountNumber(e.target.value)}
                          placeholder="12345678"
                          className="w-full px-4 py-4 bg-black border border-white/10 rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm font-bold text-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                        Amount In Asset
                      </label>
                      <div className="relative">
                        <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={amountInAsset}
                          onChange={e => setAmountInAsset(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-11 pr-4 py-4 bg-black border border-white/10 rounded-2xl focus:ring-1 focus:ring-amber-500/50 outline-none text-sm font-bold text-white transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Upload Payment Slip</label>
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${paymentSlip ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 group-hover:border-white/20'}`}>
                          <Upload size={20} className={paymentSlip ? 'text-amber-500' : 'text-gray-500'} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                            {paymentSlip ? 'Payment Slip Loaded' : 'Upload Proof of Payment'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-[10px] font-black uppercase">
                          <AlertCircle size={14} />
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={purchasing || !paymentSlip || !broker || !accountNumber || !amountInAsset}
                        className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-2xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-30 flex items-center justify-center gap-2"
                      >
                        {purchasing ? <Loader2 className="animate-spin" size={20} /> : 'SUBMIT PURCHASE REQUEST'}
                      </button>
                      <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest text-center italic">The seller will review your payment before approving the bot.</p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;

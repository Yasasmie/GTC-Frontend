// src/Pages/Bots.jsx
import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import {
  getUserAccounts,
  getUserBots,
  createUserBot,
  getUserByUid,
  adminListBots,
} from '../api';

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

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCreateBot = async e => {
    e.preventDefault();
    setError('');

    if (!firebaseUser) {
      setError('You must be logged in.');
      return;
    }

    if (!isKycApproved) {
      setError('Your KYC must be approved before adding bots.');
      return;
    }

    if (!selectedAccountId) {
      setError('Please select a broker account.');
      return;
    }
    if (!selectedBotId) {
      setError('Please select a bot.');
      return;
    }
    if (!signedAgreementFile) {
      setError('Please upload the signed agreement.');
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
      console.error(err);
      setError('Failed to assign bot. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const isGlobalLoading =
    loadingAccounts || loadingBots || loadingUser;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-slate-900">My Bots</h1>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold shadow hover:bg-slate-800 transition-colors disabled:opacity-60"
            disabled={
              isGlobalLoading ||
              accounts.length === 0 ||
              !isKycApproved ||
              botsCatalog.length === 0
            }
          >
            Add Bot
          </button>
        </div>

        {!loadingUser && userRecord && !isKycApproved && (
          <div className="mb-4 text-sm text-slate-700 bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
            Your KYC is not approved yet. You can only add bots after an
            admin approves your KYC.
          </div>
        )}

        {!loadingAccounts && accounts.length === 0 && (
          <div className="mb-4 text-sm text-slate-600 bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
            You don't have any broker accounts yet. Please add an account
            first in the <span className="font-semibold">Accounts</span> page
            before assigning bots.
          </div>
        )}

        {!loadingBots && botsCatalog.length === 0 && (
          <div className="mb-4 text-sm text-slate-600 bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
            No bots are available yet. Please contact admin.
          </div>
        )}

        {isGlobalLoading && (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-lg relative">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Add Bot to Account
              </h2>

              {error && (
                <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}

              <form onSubmit={handleCreateBot} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Broker Account
                  </label>
                  <select
                    value={selectedAccountId}
                    onChange={e =>
                      setSelectedAccountId(Number(e.target.value))
                    }
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.broker} – {acc.accountType} –{' '}
                        {acc.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Bot
                  </label>
                  <select
                    value={selectedBotId}
                    onChange={e => setSelectedBotId(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    {botsCatalog.map(bot => (
                      <option key={bot.id} value={bot.id}>
                        {bot.name} – ${bot.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Signed Agreement
                  </label>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAgreementOpen(true)}
                      className="inline-flex items-center justify-center px-3 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50"
                    >
                      View Agreement
                    </button>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={e =>
                        setSignedAgreementFile(
                          e.target.files?.[0] || null
                        )
                      }
                      className="block w-full text-sm text-slate-600"
                    />
                    {signedAgreementFile && (
                      <p className="text-xs text-slate-500">
                        Selected: {signedAgreementFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
                  >
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAgreementOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto relative">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Bot Service Agreement
              </h2>
              <p className="text-sm text-slate-700 mb-4">
                [Sample agreement text] By using this trading bot, you
                acknowledge that trading involves risk and you are solely
                responsible for any gains or losses. This bot does not
                guarantee profit. You agree not to hold the provider liable
                for any financial outcome resulting from using this bot.
              </p>
              <p className="text-sm text-slate-700 mb-4">
                You must read and agree to these terms before activating a
                bot on your trading account.
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAgreementOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-3xl shadow border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">My Bots</h2>
            <span className="text-sm text-slate-500">
              Total: {userBots.length}
            </span>
          </div>

          {userBots.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              You have not added any bots yet. Click{' '}
              <span className="font-semibold">Add Bot</span> to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Broker Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Bot
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Signed Agreement
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userBots.map((b, index) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm font-medium text-slate-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {b.broker} – {b.accountNumber}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {b.botName}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        ${b.price}
                      </td>
                      <td className="px-6 py-3 text-sm text-blue-600 underline">
                        {b.signedAgreementUrl}
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

export default Bots;

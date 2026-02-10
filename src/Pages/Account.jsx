// src/Pages/Account.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { getUserAccounts, createUserAccount } from '../api';

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [broker, setBroker] = useState('XM');
  const [accountType, setAccountType] = useState('Standard account');
  const [accountNumber, setAccountNumber] = useState('');

  const [error, setError] = useState('');
  const [loadingAccounts, setLoadingAccounts] = useState(true);

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

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateAccount = async e => {
    e.preventDefault();
    setError('');

    if (!accountNumber.trim()) {
      setError('Broker account number is required.');
      return;
    }

    if (!user) {
      setError('You must be logged in to create an account.');
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
      console.error(err);
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-slate-900">
            My Accounts
          </h1>
          <button
            onClick={openModal}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold shadow hover:bg-slate-800 transition-colors"
          >
            Add Account
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md relative">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Add New Account
              </h2>

              {error && (
                <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}

              <form onSubmit={handleCreateAccount} className="space-y-4">
                {/* Broker */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Broker Account
                  </label>
                  <select
                    value={broker}
                    onChange={e => setBroker(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="XM">XM</option>
                    <option value="Nord fx">Nord fx</option>
                    <option value="Momaxa">Momaxa</option>
                  </select>
                </div>

                {/* Account type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Account Type
                  </label>
                  <select
                    value={accountType}
                    onChange={e => setAccountType(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="Standard account">Standard account</option>
                    <option value="cents account">cents account</option>
                    <option value="demo account">demo account</option>
                    <option value="copy trading account">
                      copy trading account
                    </option>
                  </select>
                </div>

                {/* Account number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Broker Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Enter broker account number"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Accounts table */}
        <div className="mt-8 bg-white rounded-3xl shadow border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">
              Added Accounts
            </h2>
            <span className="text-sm text-slate-500">
              Total: {accounts.length}
            </span>
          </div>

          {loadingAccounts ? (
            <div className="px-6 py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              You have not added any accounts yet. Click{' '}
              <span className="font-semibold">Add Account</span> to create one.
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
                      Broker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Account Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Broker Account Number
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accounts.map((acc, index) => (
                    <tr key={acc.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-sm font-medium text-slate-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {acc.broker}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {acc.accountType}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800">
                        {acc.accountNumber}
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

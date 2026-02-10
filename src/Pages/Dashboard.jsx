import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

const Dashboard = ({ currentUser }) => {
  const [copied, setCopied] = useState(false);
  const [earnings, setEarnings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    currentPackageAmount: 9,
    currentPackageName: 'Package 50',
    accountsCount: 1,
    activePackagesCount: 9,
    teamCount: 2,
    totalCommission: 9,
  });

  // protect against undefined currentUser when app loads
  const referralLink = currentUser
    ? `${window.location.origin}/register?ref=${currentUser.id}`
    : '';

  const handleCopy = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    // later you will fetch data here from backend
    // setEarnings(...)
    // setTransactions(...)
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Home / Dashboard</p>
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <p className="text-sm font-semibold text-gray-700 mb-2">Your Link</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            readOnly
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50"
            value={referralLink}
            placeholder="Referral link will appear here"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg whitespace-nowrap"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Package */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Current Package
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {stats.currentPackageName}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ${stats.currentPackageAmount.toFixed(2)}
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              ${stats.totalCommission.toFixed(2)} Total Commission Earned
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xl">
            $
          </div>
        </div>

        {/* Accounts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Accounts
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {stats.accountsCount}
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              {stats.activePackagesCount} Active Packages
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 font-bold text-xl">
            <ExternalLink size={20} />
          </div>
        </div>

        {/* Your Team */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Your Team
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Direct</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {stats.teamCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">Members</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 font-bold text-xl">
            👥
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-blue-900">Earnings Breakdown</h3>
        </div>
        {earnings.length === 0 ? (
          <div className="p-12 text-center text-gray-400 italic">
            No entries found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    User Account
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    Amount ($)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((row) => (
                  <tr key={row.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{row.level}</td>
                    <td className="px-4 py-3">{row.userAccount}</td>
                    <td className="px-4 py-3">${row.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-blue-900">Transactions</h3>
        </div>
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-400 italic">
            No entries found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    Amount ($)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={tx.id || i} className="border-t border-gray-100">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">{tx.type}</td>
                    <td className="px-4 py-3">${tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">{tx.description}</td>
                    <td className="px-4 py-3">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

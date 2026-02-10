import React, { useState, useEffect } from 'react';
import { Users, Package, DollarSign, BarChart3, Bell, TrendingUp, Award } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPackages: 9,
    totalRevenue: 320.00,
    totalUsers: 15,
    activeNews: 3
  });

  const [recentEarnings] = useState([
    { rank: 1, name: 'Divya Patel', packageName: 'Package 10', amount: '$200.00', company: 'ABC Corp' },
    { rank: 2, name: 'Kishore Kumar', packageName: 'Package 15', amount: '$150.00', company: 'XYZ Ltd' },
    { rank: 3, name: 'Priya Sharma', packageName: 'Package 10', amount: '$120.00', company: 'Tech Innovate' },
    { rank: 4, name: 'Ramesh Kumar', packageName: 'Package 15', amount: '$180.00', company: 'Global Trade' },
    { rank: 5, name: 'Sita Devi', packageName: 'Package 10', amount: '$95.00', company: 'FinTech Solutions' }
  ]);

  const [news] = useState([
    {
      id: 1,
      title: 'New broker integration completed',
      description: 'NordFX API integration now live with enhanced security features.',
      date: '2 hours ago'
    },
    {
      id: 2,
      title: 'Package pricing updated',
      description: 'New pricing structure implemented across all subscription tiers.',
      date: '1 day ago'
    },
    {
      id: 3,
      title: 'System maintenance completed',
      description: 'All services restored after scheduled maintenance window.',
      date: '3 days ago'
    }
  ]);

  // Fixed: Proper cleanup of interval
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalRevenue: Number((prev.totalRevenue + Math.random() * 10).toFixed(2))
      }));
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-1 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-slate-800 bg-clip-text text-transparent mb-4">
              Dashboard
            </h1>
            <p className="text-xl text-slate-600 font-medium">Welcome back! Here's what's happening with your platform.</p>
          </div>
          
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center gap-3 whitespace-nowrap">
              <TrendingUp size={24} />
              View Reports
            </button>
            <button className="px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 flex items-center gap-3 whitespace-nowrap">
              <Award size={24} />
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Packages */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-white/20 overflow-hidden">
            <div 
              className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-all duration-1000"
              style={{ animation: 'tilt 3s infinite ease-in-out' }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Package size={24} />
                </div>
                <div className="w-6 h-6 bg-white/30 rounded-full animate-ping"></div>
              </div>
              <div>
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-2">Total Packages</p>
                <p className="text-4xl font-black">{stats.totalPackages}</p>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="group relative bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-white/20 overflow-hidden">
            <div 
              className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-all duration-1000"
              style={{ animation: 'tilt 3s infinite ease-in-out' }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <DollarSign size={24} />
                </div>
                <div className="w-6 h-6 bg-white/30 rounded-full animate-ping"></div>
              </div>
              <div>
                <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-2">Total Revenue</p>
                <p className="text-4xl font-black">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-white/20 overflow-hidden">
            <div 
              className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-purple-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-all duration-1000"
              style={{ animation: 'tilt 3s infinite ease-in-out' }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div className="w-6 h-6 bg-white/30 rounded-full animate-ping"></div>
              </div>
              <div>
                <p className="text-purple-100 text-sm font-medium uppercase tracking-wider mb-2">Total Users</p>
                <p className="text-4xl font-black">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Active News */}
          <div className="group relative bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-white/20 overflow-hidden">
            <div 
              className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-all duration-1000"
              style={{ animation: 'tilt 3s infinite ease-in-out' }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Bell size={24} />
                </div>
                <div className="w-6 h-6 bg-white/30 rounded-full animate-ping"></div>
              </div>
              <div>
                <p className="text-orange-100 text-sm font-medium uppercase tracking-wider mb-2">Active News</p>
                <p className="text-4xl font-black">{stats.activeNews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Earnings Breakdown */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-1">Earnings Breakdown</h2>
                <p className="text-slate-600">Top performers this month</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 pr-4 font-bold text-slate-800">#</th>
                    <th className="text-left py-4 font-bold text-slate-800 w-48">Username</th>
                    <th className="text-left py-4 font-bold text-slate-800 w-48">Package Name</th>
                    <th className="text-left py-4 font-bold text-slate-800 w-32">Total</th>
                    <th className="text-left py-4 font-bold text-slate-800 w-40">Company</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEarnings.map((earning, index) => (
                    <tr key={earning.rank} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 pr-4 font-bold text-emerald-600 text-lg">{earning.rank}</td>
                      <td className="py-4 font-semibold text-slate-900 group-hover:text-emerald-700">{earning.name}</td>
                      <td className="py-4 text-slate-700">{earning.packageName}</td>
                      <td className="py-4 font-bold text-emerald-600 text-lg">{earning.amount}</td>
                      <td className="py-4 text-slate-600">{earning.company}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* News & Updates */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Bell className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-1">News & Updates</h2>
                <p className="text-slate-600 text-sm">Latest platform activities</p>
              </div>
            </div>

            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="group border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-orange-300 transition-all duration-200 cursor-pointer">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-600 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{item.description}</p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    {item.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CSS Styles - Fixed */}
        <style jsx global>{`
          @keyframes tilt {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(2deg); }
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdminDashboard;

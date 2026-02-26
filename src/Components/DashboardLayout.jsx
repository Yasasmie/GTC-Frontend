import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Wallet,
  Bot,
  FileText,
  Menu,
  Search,
  Bell,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Profile', icon: User, path: '/dashboard/profile' },
    { name: 'My Accounts', icon: Wallet, path: '/dashboard/accounts' },
    { name: 'My Bots', icon: Bot, path: '/dashboard/bots' },
    {
      name: 'Plans and Billing',
      icon: FileText,
      path: '/dashboard/billing',
      hasSub: true,
    },
  ];

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Trader';
  const userId = user?.uid?.substring(0, 6).toUpperCase() || 'FX-0000';

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside
        className={`bg-zinc-950 border-r border-white/5 transition-all duration-300 z-20 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Asset Farm Logo"
            className="w-8 h-8 object-contain flex-shrink-0"
          />
          {isSidebarOpen && (
            <span className="font-bold text-xl text-amber-500">
              FX Gold
            </span>
          )}
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-amber-500'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-black' : 'group-hover:text-amber-500'} />
                {isSidebarOpen && (
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-sm">{item.name}</span>
                    {item.hasSub && <ChevronDown size={14} opacity={0.5} />}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-zinc-950 border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search
                className="absolute left-3 top-2.5 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search markets..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-white/5 rounded-lg outline-none focus:ring-1 focus:ring-amber-500/50 text-sm text-white placeholder-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-gray-400 hover:text-amber-500 relative transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border-2 border-zinc-950" />
            </button>
            
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-white truncate max-w-[120px] uppercase tracking-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-amber-500/70 font-bold">
                  ID: {userId}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all shadow-inner"
                title="Secure Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 md:p-8 overflow-y-auto flex-1 bg-black">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
// src/Admin/AdminNav.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Bot, FileText, Users, Shield, Package, 
  Menu, Search, Bell, LogOut, ChevronDown, ChevronRight, FileCheck, Activity, Terminal
} from 'lucide-react';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AdminNav = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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

  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 w-6 h-6" />
        </div>
      </div>
    );
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Operator';
  const userId = user?.uid?.substring(0, 8).toUpperCase() || 'SYS-ALPHA';

  const navItems = [
    { name: 'Command Center', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'User Registry', icon: Users, path: '/admin/users' },
    { name: 'Career Data', icon: FileText, path: '/admin/careers' },
    { name: 'Bot Algorithms', icon: Bot, path: '/admin/bots' },
    { name: 'Execution Requests', icon: Activity, path: '/admin/bot-requests' },
    { name: 'Identity (KYC)', icon: FileCheck, path: '/admin/kyc' },
    { name: 'Add Courses', icon: FileCheck, path: '/admin/courses' },
     {name: 'Apply Courses', icon: FileCheck, path: '/admin/apply-courses' },
    { 
      name: 'Transactions', 
      icon: Package, 
      dropdownKey: 'purchases',
      subItems: [
        { name: 'Pending Ledger', path: '/admin/purchases/pending' },
        { name: 'Full History', path: '/admin/purchases/all' },
        { name: 'Marketplace History', path: '/admin/resale-history' }
      ]
    },
    { name: 'Network Tree', icon: Shield, path: '/admin/referrals' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex text-zinc-400 font-sans selection:bg-amber-500 selection:text-black">
      {/* Sidebar */}
      <aside className={`bg-black border-r border-white/5 transition-all duration-500 flex flex-col ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Shield className="text-black w-6 h-6" strokeWidth={2.5} />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <span className="block font-black text-xl tracking-tighter text-white italic uppercase">
                Gold <span className="text-amber-500 font-black">FX</span>
              </span>
              <span className="block text-[8px] font-black tracking-[.4em] text-zinc-600 -mt-1 uppercase">
                Admin Authority
              </span>
            </div>
          )}
        </div>

        <nav className="mt-4 px-4 space-y-2 flex-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.name}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.dropdownKey)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                        openDropdowns[item.dropdownKey] ? 'bg-zinc-900 text-white' : 'hover:bg-white/5'
                      }`}
                    >
                      <item.icon
                        size={20}
                        className={
                          openDropdowns[item.dropdownKey]
                            ? 'text-amber-500'
                            : 'group-hover:text-amber-500'
                        }
                      />
                      {isSidebarOpen && (
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold text-xs uppercase tracking-widest">
                            {item.name}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-500 ${
                              openDropdowns[item.dropdownKey] ? 'rotate-180 text-amber-500' : ''
                            }`}
                          />
                        </div>
                      )}
                    </button>
                    {isSidebarOpen && openDropdowns[item.dropdownKey] && (
                      <div className="mt-2 ml-10 space-y-1 border-l border-white/5">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className={`flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                              location.pathname === subItem.path
                                ? 'text-amber-500'
                                : 'text-zinc-600 hover:text-white'
                            }`}
                          >
                            <ChevronRight
                              size={12}
                              className={location.pathname === subItem.path ? 'opacity-100' : 'opacity-0'}
                            />
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                        : 'hover:bg-white/5 text-zinc-500 hover:text-white'
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={
                        isActive ? 'text-black' : 'group-hover:text-amber-500 transition-colors'
                      }
                    />
                    {isSidebarOpen && (
                      <span className="font-bold text-xs uppercase tracking-widest">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Card Fixed at Bottom */}
        <div className="p-4 border-t border-white/5">
          <div className={`bg-zinc-900/50 rounded-2xl p-4 transition-all ${isSidebarOpen ? '' : 'items-center'}`}>
            {isSidebarOpen && (
              <div className="mb-4">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">
                  {displayName}
                </p>
                <p className="text-[9px] text-zinc-600 font-mono mt-1 uppercase tracking-tighter">
                  NODE: {userId}
                </p>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full py-2 px-3 rounded-xl bg-white/5 text-zinc-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all font-black text-[10px] uppercase tracking-widest ${
                !isSidebarOpen && 'justify-center'
              }`}
            >
              <LogOut size={16} />
              {isSidebarOpen && 'Terminate Session'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top Header */}
        <header className="h-20 bg-black/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-6 flex-1">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="text-zinc-500 hover:text-amber-500 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="relative max-w-xl w-full hidden lg:block group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-amber-500 transition-colors"
                size={18}
              />
              <input 
                type="text" 
                placeholder="EXECUTE SEARCH OVER SYSTEM DATA..." 
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl outline-none focus:border-amber-500/50 transition-all text-xs font-bold text-zinc-300 placeholder-zinc-700 uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-zinc-900/50 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Network Secure
              </span>
            </div>
            
            <button className="text-zinc-500 relative p-3 hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-black"></span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#050505]">
          <Outlet />
        </main>
      </div>

      {/* Plain style tag: no jsx/global attributes */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AdminNav;

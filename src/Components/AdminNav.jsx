import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, User, Wallet, Bot, FileText, Users, Shield, Package, 
  Menu, Search, Bell, LogOut, ChevronDown, ChevronRight, DollarSign, FileCheck 
} from 'lucide-react';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AdminNav = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();

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
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin';
  const userId = user?.uid?.substring(0, 6).toUpperCase() || 'ADMIN1';

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Manage Users', icon: Users, path: '/admin/users' },
    { name: 'Manage Careers', icon: FileText, path: '/admin/careers' },
    /*{ name: 'Manage Packages', icon: Package, path: '/admin/packages' },*/
    /*{ name: 'Manage Brokers', icon: Wallet, path: '/admin/brokers' },
    { name: 'Manage Accounts', icon: FileText, path: '/admin/accounts' },*/
    { name: 'Manage Bots', icon: Bot, path: '/admin/bots' },
    { 
      name: 'Bot Requests', 
      icon: Bot, 
      path: '/admin/bot-requests',
      dropdownKey: 'botRequests'
    },
    /*{ name: 'Provider Payouts', icon: DollarSign, path: '/admin/payouts' },*/
    { name: 'KYC Requests', icon: FileCheck, path: '/admin/kyc' },
    { 
      name: 'Purchases', 
      icon: Package, 
      dropdownKey: 'purchases',
      subItems: [
        { name: 'Pending Purchases', path: '/admin/purchases/pending' },
        { name: 'All Purchases', path: '/admin/purchases/all' }
      ]
    },
    { name: 'Referral Tree', icon: FileText, path: '/admin/referrals' }
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex-shrink-0" />
          {isSidebarOpen && <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Admin Panel</span>}
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                /* Dropdown Menu Item */
                <div>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors cursor-pointer group ${openDropdowns[item.dropdownKey] ? 'bg-blue-50 text-blue-600' : ''}`}
                    onClick={() => toggleDropdown(item.dropdownKey)}
                  >
                    <item.icon size={20} />
                    {isSidebarOpen && (
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium text-sm">{item.name}</span>
                        <ChevronDown 
                          size={14} 
                          className={`transition-transform ${openDropdowns[item.dropdownKey] ? 'rotate-180' : ''}`} 
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Submenu */}
                  {isSidebarOpen && openDropdowns[item.dropdownKey] && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="flex items-center gap-3 px-4 py-2 text-xs text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors pl-2"
                        >
                          <ChevronRight size={14} />
                          <span>{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Regular Menu Item */
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group"
                >
                  <item.icon size={20} />
                  {isSidebarOpen && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search admin panel..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-gray-500 relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 truncate max-w-[120px]">{displayName}</p>
                <p className="text-[10px] text-gray-400">Admin ID: {userId}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-purple-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 shadow-sm"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminNav;

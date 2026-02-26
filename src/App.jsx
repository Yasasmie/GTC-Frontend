// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import PendingApproval from './Pages/PendingApproval';
import KycForm from './Pages/KycForm';
import Careers from './Pages/Careers';

import DashboardLayout from './Components/DashboardLayout';
import Dashboard from './Pages/Dashboard';
import MyBots from './Pages/MyBots';
import Account from './Pages/Account';
import Profile from './Pages/Profile';

import AdminLogin from './Admin/AdminLogin';
import AdminNav from './Components/AdminNav';
import AdminDashboard from './Admin/AdminDashboard';
import ManageUsers from './Admin/ManageUsers';
import KycRequests from './Admin/KycRequests';
import ManageBots from './Admin/ManageBots';
import BotRequests from './Admin/BotRequests';
import AdminCareers from './Admin/AdminCareers';

import { getUserByUid } from './api';

// User Protected Route with status + KYC logic
const ProtectedRoute = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [userStatus, setUserStatus] = useState(null); // { status, kycCompleted }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async currentUser => {
      if (!currentUser) {
        setAuthUser(null);
        setUserStatus(null);
        setLoading(false);
        return;
      }

      setAuthUser(currentUser);

      try {
        const rec = await getUserByUid(currentUser.uid);
        setUserStatus({
          status: rec.status,
          kycCompleted: rec.kycCompleted,
        });
      } catch (e) {
        // no backend record: treat as pending
        setUserStatus({
          status: 'pending',
          kycCompleted: false,
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (!userStatus) {
    // safety: treat as pending
    return <Navigate to="/pending-approval" replace />;
  }

  if (userStatus.status === 'pending') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (userStatus.status === 'approved' && !userStatus.kycCompleted) {
    return <Navigate to="/kyc" replace />;
  }

  // approved + KYC done -> allow dashboard routes
  return children;
};

// Admin Protected Route
const AdminProtectedRoute = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      setAuthUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/admin-login" replace />;
  }

  const isAdmin =
    authUser.email &&
    (authUser.email.endsWith('@admin.com') ||
      authUser.email.toLowerCase().includes('admin'));

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/kyc" element={<KycForm />} />

        {/* User dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="bots" element={<MyBots />} />
          <Route path="accounts" element={<Account />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminNav />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="kyc" element={<KycRequests />} />
          <Route path="bots" element={<ManageBots />} />
          <Route path="bot-requests" element={<BotRequests />} />
          <Route path="careers" element={<AdminCareers />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

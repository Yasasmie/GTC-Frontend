// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import Courses from './Pages/Courses';
import Marketplace from './Pages/Marketplace';

import AdminLogin from './Admin/AdminLogin';
import AdminNav from './Components/AdminNav';
import AdminDashboard from './Admin/AdminDashboard';
import ManageUsers from './Admin/ManageUsers';
import KycRequests from './Admin/KycRequests';
import ManageBots from './Admin/ManageBots';
import BotRequests from './Admin/BotRequests';
import AdminCareers from './Admin/AdminCareers';
import AdminCourses from './Admin/AdminCourses';
import ApplyCourses from './Admin/ApplyCourse';
import UserBotsDetail from './Admin/UserBotsDetail';
import ResaleHistory from './Admin/ResaleHistory';
import ResaleApprovals from './Admin/ResaleApprovals';

import { createUserRecord, getUserByUid } from './api';

const AppLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-amber-500/20 border-t-amber-500" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Loading</p>
    </div>
  </div>
);

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
        let rec;
        try {
          rec = await getUserByUid(currentUser.uid);
        } catch {
          rec = await createUserRecord({
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || '',
            referredBy: null,
          });
        }
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
    return <AppLoader />;
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (!userStatus) {
    // safety: treat as pending
    return <Navigate to="/pending-approval" replace />;
  }

  if (userStatus.status !== 'approved') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (userStatus.status === 'approved' && !userStatus.kycCompleted) {
    return <Navigate to="/kyc" replace />;
  }

  // approved + KYC done -> allow dashboard routes
  return children;
};

const KycRoute = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
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
        let rec;
        try {
          rec = await getUserByUid(currentUser.uid);
        } catch {
          rec = await createUserRecord({
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || '',
            referredBy: null,
          });
        }
        setUserStatus({
          status: rec.status,
          kycCompleted: rec.kycCompleted,
        });
      } catch {
        setUserStatus({ status: 'pending', kycCompleted: false });
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <AppLoader />;
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (!userStatus || userStatus.status !== 'approved') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (userStatus.kycCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <KycForm />;
};

const PendingApprovalRoute = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
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
        let rec;
        try {
          rec = await getUserByUid(currentUser.uid);
        } catch {
          rec = await createUserRecord({
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || '',
            referredBy: null,
          });
        }
        setUserStatus({
          status: rec.status,
          kycCompleted: rec.kycCompleted,
        });
      } catch {
        setUserStatus({ status: 'pending', kycCompleted: false });
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <AppLoader />;
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (userStatus?.status === 'approved' && !userStatus?.kycCompleted) {
    return <Navigate to="/kyc" replace />;
  }

  if (userStatus?.status === 'approved' && userStatus?.kycCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <PendingApproval />;
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
    return <AppLoader />;
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
        <Route path="/pending-approval" element={<PendingApprovalRoute />} />
        <Route path="/kyc" element={<KycRoute />} />

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
          <Route path="courses" element={<Courses />} />
          <Route path="marketplace" element={<Marketplace />} />
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
          <Route path="referrals" element={<ManageUsers />} />
          <Route path="users/:id/bots" element={<UserBotsDetail />} />
          <Route path="kyc" element={<KycRequests />} />
          <Route path="bots" element={<ManageBots />} />
          <Route path="bot-requests" element={<BotRequests />} />
          <Route path="resale-approvals" element={<ResaleApprovals />} />
          <Route path="careers" element={<AdminCareers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="apply-courses" element={<ApplyCourses />} />
          <Route path="resale-history" element={<ResaleHistory />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


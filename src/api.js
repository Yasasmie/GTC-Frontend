// src/api.js

// In Vite, environment variables are accessed via import.meta.env
// Define VITE_API_BASE in your .env file if you want to override the default.
const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// Helper to handle responses consistently
const handleResponse = async (res, errorMessage) => {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || errorMessage);
  }
  return res.json();
};

// User endpoints
export const createUserRecord = async ({ uid, email, name }) => {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, email, name }),
  });
  return handleResponse(res, 'Failed to create user record');
};

export const getUserByUid = async (uid) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}`);
  return handleResponse(res, 'Failed to get user record');
};

export const getUserProfile = async (uid) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/profile`);
  return handleResponse(res, 'Failed to get user profile');
};

export const submitKyc = async (uid, kycData) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/kyc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(kycData),
  });
  return handleResponse(res, 'Failed to submit KYC');
};

// Admin user helpers
export const adminListUsers = async () => {
  const res = await fetch(`${API_BASE}/api/admin/users`);
  return handleResponse(res, 'Failed to load users');
};

export const adminApproveUser = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}/approve`, {
    method: 'PUT',
  });
  return handleResponse(res, 'Failed to approve user');
};

export const adminDeleteUser = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res, 'Failed to delete user');
};

// User accounts
export const getUserAccounts = async (uid) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/accounts`);
  return handleResponse(res, 'Failed to load accounts');
};

export const createUserAccount = async (uid, data) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Failed to create account');
};

// Bots (user)
export const getBotCatalog = async () => {
  const res = await fetch(`${API_BASE}/api/bots/catalog`);
  return handleResponse(res, 'Failed to load bots');
};

export const getUserBots = async (uid) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/bots`);
  return handleResponse(res, 'Failed to load user bots');
};

export const createUserBot = async (uid, data) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/bots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Failed to create user bot');
};

// KYC requests (admin)
export const getKycRequests = async () => {
  const res = await fetch(`${API_BASE}/api/admin/kyc-requests`);
  return handleResponse(res, 'Failed to load KYC requests');
};

export const getKycRequestById = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/kyc-requests/${id}`);
  return handleResponse(res, 'Failed to load KYC details');
};

export const approveKycRequest = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/kyc-requests/${id}/approve`, {
    method: 'PUT',
  });
  return handleResponse(res, 'Failed to approve KYC');
};

export const rejectKycRequest = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/kyc-requests/${id}/reject`, {
    method: 'PUT',
  });
  return handleResponse(res, 'Failed to reject KYC');
};

// Bots (admin)
export const adminListBots = async () => {
  const res = await fetch(`${API_BASE}/api/admin/bots`);
  return handleResponse(res, 'Failed to load bots');
};

export const adminCreateBot = async (data) => {
  const res = await fetch(`${API_BASE}/api/admin/bots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Failed to create bot');
};

export const adminUpdateBot = async (id, data) => {
  const res = await fetch(`${API_BASE}/api/admin/bots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Failed to update bot');
};

export const adminDeleteBot = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/bots/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res, 'Failed to delete bot');
};

// Bot requests (admin)
export const getBotRequests = async () => {
  const res = await fetch(`${API_BASE}/api/admin/bot-requests`);
  return handleResponse(res, 'Failed to load bot requests');
};

export const getBotRequestById = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/bot-requests/${id}`);
  return handleResponse(res, 'Failed to load bot request');
};

export const approveBotRequest = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/bot-requests/${id}/approve`, {
    method: 'PUT',
  });
  return handleResponse(res, 'Failed to approve bot request');
};

export const rejectBotRequest = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/bot-requests/${id}/reject`, {
    method: 'PUT',
  });
  return handleResponse(res, 'Failed to reject bot request');
};

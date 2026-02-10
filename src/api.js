// src/api.js
export const API_BASE =
  process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export const createUserRecord = async ({ uid, email, name }) => {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, email, name }),
  });
  if (!res.ok) throw new Error('Failed to create user record');
  return res.json();
};

export const getUserByUid = async uid => {
  const res = await fetch(`${API_BASE}/api/users/${uid}`);
  if (!res.ok) throw new Error('Failed to get user record');
  return res.json();
};

export const getUserProfile = async uid => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/profile`);
  if (!res.ok) throw new Error('Failed to get user profile');
  return res.json();
};

export const submitKyc = async (uid, kycData) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/kyc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(kycData),
  });
  if (!res.ok) throw new Error('Failed to submit KYC');
  return res.json();
};

// Admin helpers (as before)
export const adminListUsers = async () => {
  const res = await fetch(`${API_BASE}/api/admin/users`);
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
};

export const adminApproveUser = async id => {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}/approve`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to approve user');
  return res.json();
};

export const adminDeleteUser = async id => {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
};

export const getUserAccounts = async uid => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/accounts`);
  if (!res.ok) throw new Error('Failed to load accounts');
  return res.json();
};

export const createUserAccount = async (uid, data) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create account');
  return res.json();
};

export const getBotCatalog = async () => {
  const res = await fetch(`${API_BASE}/api/bots/catalog`);
  if (!res.ok) throw new Error('Failed to load bots');
  return res.json();
};

export const getUserBots = async uid => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/bots`);
  if (!res.ok) throw new Error('Failed to load user bots');
  return res.json();
};

export const createUserBot = async (uid, data) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/bots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create user bot');
  return res.json();
};


export const getKycRequests = async () => {
  const res = await fetch(`${API_BASE}/api/admin/kyc-requests`);
  if (!res.ok) throw new Error('Failed to load KYC requests');
  return res.json();
};

export const getKycRequestById = async id => {
  const res = await fetch(`${API_BASE}/api/admin/kyc-requests/${id}`);
  if (!res.ok) throw new Error('Failed to load KYC details');
  return res.json();
};

export const approveKycRequest = async id => {
  const res = await fetch(
    `${API_BASE}/api/admin/kyc-requests/${id}/approve`,
    {
      method: 'PUT',
    }
  );
  if (!res.ok) throw new Error('Failed to approve KYC');
  return res.json();
};

export const rejectKycRequest = async id => {
  const res = await fetch(
    `${API_BASE}/api/admin/kyc-requests/${id}/reject`,
    {
      method: 'PUT',
    }
  );
  if (!res.ok) throw new Error('Failed to reject KYC');
  return res.json();
};

export const adminListBots = async () => {
  const res = await fetch(`${API_BASE}/api/admin/bots`);
  if (!res.ok) throw new Error('Failed to load bots');
  return res.json();
};

export const adminCreateBot = async data => {
  const res = await fetch(`${API_BASE}/api/admin/bots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create bot');
  return res.json();
};

export const adminUpdateBot = async (id, data) => {
  const res = await fetch(`${API_BASE}/api/admin/bots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update bot');
  return res.json();
};

export const adminDeleteBot = async id => {
  const res = await fetch(`${API_BASE}/api/admin/bots/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete bot');
  return res.json();
};

// Bot requests (admin)
export const getBotRequests = async () => {
  const res = await fetch(`${API_BASE}/api/admin/bot-requests`);
  if (!res.ok) throw new Error('Failed to load bot requests');
  return res.json();
};

export const getBotRequestById = async id => {
  const res = await fetch(`${API_BASE}/api/admin/bot-requests/${id}`);
  if (!res.ok) throw new Error('Failed to load bot request');
  return res.json();
};

export const approveBotRequest = async id => {
  const res = await fetch(`${API_BASE}/api/admin/bot-requests/${id}/approve`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to approve bot request');
  return res.json();
};

export const rejectBotRequest = async id => {
  const res = await fetch(`${API_BASE}/api/admin/bot-requests/${id}/reject`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to reject bot request');
  return res.json();
};

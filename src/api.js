// src/api.js

// In Vite, environment variables are accessed via import.meta.env
// Define VITE_API_BASE in your .env file if you want to override the default.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// Helper to handle responses consistently
const handleResponse = async (res, errorMessage) => {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || errorMessage);
  }
  return res.json();
};

// --- USER ENDPOINTS ---

export const createUserRecord = async ({ uid, email, name, referredBy }) => {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, email, name, referredBy }),
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

// --- ADMIN USER HELPERS ---

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

// --- USER ACCOUNTS ---

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

// --- BOTS (USER) ---

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

// --- BOTS (ADMIN VIEW PER USER) ---

// Used by UserBotsDetail.jsx to view all bots for a specific user UID in admin panel.
// Backend route should be: GET /api/admin/users/:uid/bots
export const adminGetUserBots = async (uid) => {
  const res = await fetch(`${API_BASE}/api/admin/users/${uid}/bots`);
  return handleResponse(res, 'Failed to load user bots for admin');
};

// --- KYC REQUESTS (ADMIN) ---

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

// --- BOTS (ADMIN) ---

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

// --- BOT REQUESTS (ADMIN) ---

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

// --- COURSES (USER & ADMIN) ---

export const getCourses = async () => {
  const res = await fetch(`${API_BASE}/api/courses`);
  return handleResponse(res, 'Failed to load course library');
};

export const createCourse = async (data) => {
  // accept youtubeLinks as array, or youtubeLink string
  const payload = { ...data };
  if (payload.youtubeLinks && !Array.isArray(payload.youtubeLinks)) {
    payload.youtubeLinks = [payload.youtubeLinks];
  } else if (!payload.youtubeLinks && payload.youtubeLink) {
    payload.youtubeLinks = [payload.youtubeLink];
  }
  const res = await fetch(`${API_BASE}/api/admin/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res, 'Failed to initialize course deployment');
};

export const updateCourse = async (id, data) => {
  const res = await fetch(`${API_BASE}/api/admin/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Failed to update course');
};

export const deleteCourse = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/courses/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res, 'Failed to terminate course data');
};

// Course applications
export const submitCourseApplication = async (data) => {
  const res = await fetch(`${API_BASE}/api/courses/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Failed to submit course application');
};

export const getCourseApplications = async () => {
  const res = await fetch(`${API_BASE}/api/admin/course-applications`);
  return handleResponse(res, 'Failed to load course applications');
};

export const getUserCourseApplications = async (uid) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/course-applications`);
  return handleResponse(res, 'Failed to load user course applications');
};

export const updateCourseApplicationStatus = async (id, status) => {
  const res = await fetch(
    `${API_BASE}/api/admin/course-applications/${id}/status`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }
  );
  return handleResponse(res, 'Failed to update application status');
};

// --- NOTIFICATIONS ---
export const getUserNotifications = async (uid) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/notifications`);
  return handleResponse(res, 'Failed to fetch notifications');
};

export const markNotificationAsRead = async (uid, notifId) => {
  const res = await fetch(
    `${API_BASE}/api/users/${uid}/notifications/${notifId}/read`,
    {
      method: 'PUT',
    }
  );
  return handleResponse(res, 'Failed to mark notification as read');
};

export const markAllNotificationsAsRead = async (uid) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/notifications/read-all`, {
    method: 'PUT',
  });
  return handleResponse(res, 'Failed to mark all notifications as read');
};

// --- BOT RESALE ---

export const resellUserBot = async (uid, botId, resalePrice) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/bots/${botId}/resell`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resalePrice }),
  });
  return handleResponse(res, 'Failed to list bot for resale');
};

export const cancelResellUserBot = async (uid, botId) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/bots/${botId}/cancel-resale`, {
    method: 'POST',
  });
  return handleResponse(res, 'Failed to cancel resale');
};

export const getResaleMarketplace = async (buyerUid) => {
  const url = buyerUid
    ? `${API_BASE}/api/bots/resale?buyerUid=${buyerUid}`
    : `${API_BASE}/api/bots/resale`;
  const res = await fetch(url);
  return handleResponse(res, 'Failed to load resale marketplace');
};

export const submitResaleRequest = async (data) => {
  const res = await fetch(`${API_BASE}/api/bots/resale/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Failed to submit purchase request');
};

export const getSellerRequests = async (uid) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/seller-requests`);
  return handleResponse(res, 'Failed to load purchase requests');
};

export const updateResaleRequestStatus = async (requestId, status) => {
  const res = await fetch(`${API_BASE}/api/bots/resale/requests/${requestId}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res, `Failed to ${status} request`);
};

export const getSaleHistory = async (uid) => {
  const res = await fetch(`${API_BASE}/api/users/${uid}/sale-history`);
  return handleResponse(res, 'Failed to load sale history');
};

export const adminGetResaleHistory = async () => {
  const res = await fetch(`${API_BASE}/api/admin/resale-history`);
  return handleResponse(res, 'Failed to load global sale history');
};

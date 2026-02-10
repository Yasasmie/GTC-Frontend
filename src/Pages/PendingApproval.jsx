// src/Pages/PendingApproval.jsx
import React from 'react';

const PendingApproval = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-4">
          Account Under Review
        </h1>
        <p className="text-slate-600 mb-4">
          Your account is awaiting admin approval. Once approved, you will be
          able to complete your KYC and access the dashboard.
        </p>
        <p className="text-sm text-slate-400">
          You can close this page and come back later.
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;

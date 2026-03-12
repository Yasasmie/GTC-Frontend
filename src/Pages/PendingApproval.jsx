// src/Pages/PendingApproval.jsx
import React from 'react';

const PendingApproval = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-zinc-950 p-8 md:p-10 text-center shadow-2xl">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Verification Queue</p>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
          Account <span className="text-amber-500">Under Review</span>
        </h1>
        <p className="text-zinc-400 mb-4">
          Your account is awaiting admin approval. Once approved, you will be
          able to complete your KYC and access the dashboard.
        </p>
        <p className="text-sm text-zinc-500">
          You can close this page and come back later.
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;

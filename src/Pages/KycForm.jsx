// src/Pages/KycForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { submitKyc } from '../api';

const KycForm = () => {
  const navigate = useNavigate();
  const [firebaseUser, setFirebaseUser] = useState(auth.currentUser);
  const [form, setForm] = useState({
    fullName: auth.currentUser?.displayName || '',
    address: '',
    city: '',
    country: '',
    idNumber: '',
  });
  const [nicFront, setNicFront] = useState(null); // base64
  const [nicBack, setNicBack] = useState(null); // base64
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      setFirebaseUser(user);
    });
    return () => unsub();
  }, []);

  if (!firebaseUser) {
    return null;
  }

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fileToBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // data URL
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleNicFrontChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setNicFront(base64);
    } catch {
      setError('Failed to read NIC front image.');
    }
  };

  const handleNicBackChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setNicBack(base64);
    } catch {
      setError('Failed to read NIC back image.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!nicFront || !nicBack) {
        setError('Please upload both front and back of NIC.');
        setLoading(false);
        return;
      }

      await submitKyc(firebaseUser.uid, {
        ...form,
        nicFront,
        nicBack,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Failed to submit KYC. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-zinc-950 p-8 md:p-10 shadow-2xl">
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Identity Verification</p>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            KYC <span className="text-amber-500">Form</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Submit your details and NIC images for approval.</p>
        </div>
        {error && (
          <p className="text-red-400 text-sm mb-6 bg-red-500/10 border border-red-500/20 p-3 rounded-2xl">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
              Full Name
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 text-white outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/50"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
              Address
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 text-white outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/50"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                City
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 text-white outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                Country
              </label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 text-white outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
              ID Number
            </label>
            <input
              name="idNumber"
              value={form.idNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-black border border-white/10 text-white outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/50"
            />
          </div>

          {/* NIC images */}
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
              NIC Front Side
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleNicFrontChange}
              className="block w-full text-xs text-zinc-500 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-widest file:text-black hover:file:bg-amber-400"
            />
            {nicFront && (
              <img
                src={nicFront}
                alt="NIC Front Preview"
                className="mt-3 w-full max-h-40 object-contain rounded-2xl border border-white/10 bg-black/50 p-2"
              />
            )}
          </div>
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
              NIC Back Side
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleNicBackChange}
              className="block w-full text-xs text-zinc-500 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-widest file:text-black hover:file:bg-amber-400"
            />
            {nicBack && (
              <img
                src={nicBack}
                alt="NIC Back Preview"
                className="mt-3 w-full max-h-40 object-contain rounded-2xl border border-white/10 bg-black/50 p-2"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3.5 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-colors disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit KYC'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KycForm;

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
    navigate('/login');
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-lg w-full">
        <h1 className="text-3xl font-black text-slate-900 mb-6">
          KYC Verification
        </h1>
        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Address
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                City
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Country
              </label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              ID Number
            </label>
            <input
              name="idNumber"
              value={form.idNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* NIC images */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              NIC Front Side
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleNicFrontChange}
              className="block w-full text-sm text-slate-600"
            />
            {nicFront && (
              <img
                src={nicFront}
                alt="NIC Front Preview"
                className="mt-2 w-full max-h-40 object-contain rounded-xl border"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              NIC Back Side
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleNicBackChange}
              className="block w-full text-sm text-slate-600"
            />
            {nicBack && (
              <img
                src={nicBack}
                alt="NIC Back Preview"
                className="mt-2 w-full max-h-40 object-contain rounded-xl border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3 bg-slate-900 text-white font-bold rounded-2xl disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit KYC'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KycForm;

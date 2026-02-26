// src/Pages/Careers.jsx
import React, { useState } from 'react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const Careers = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    nic: '',
    phone: '',
    whatsapp: '',
    email: '',
    currentlyWorking: 'no',
    employmentType: 'full-time',
    yearsExperience: '',
    preferredRole: '',
    availableFrom: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // Ensure your backend endpoint is correct
      const res = await fetch('http://localhost:5000/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to submit application');
      }
      await res.json();
      alert('Application submitted successfully!');
      setFormData({
        name: '',
        address: '',
        nic: '',
        phone: '',
        whatsapp: '',
        email: '',
        currentlyWorking: 'no',
        employmentType: 'full-time',
        yearsExperience: '',
        preferredRole: '',
        availableFrom: '',
        notes: '',
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Join Asset <span className="text-amber-500">Farm</span>
          </h1>
          <div className="h-1 w-20 bg-amber-500 mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-400 max-w-md mx-auto">
            Ready to elevate your career in trading? Fill in the details below and join our elite team.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/50 border border-white/5 shadow-2xl rounded-2xl p-8 space-y-6 backdrop-blur-sm"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              placeholder="John Doe"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
              Address
            </label>
            <textarea
              name="address"
              required
              rows={2}
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              placeholder="Your current residential address"
            />
          </div>

          {/* NIC + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
                NIC Number
              </label>
              <input
                type="text"
                name="nic"
                required
                value={formData.nic}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                placeholder="National ID"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                placeholder="07X XXX XXXX"
              />
            </div>
          </div>

          {/* WhatsApp + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                placeholder="WhatsApp contact"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Working status + employment type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
                Currently working?
              </label>
              <select
                name="currentlyWorking"
                value={formData.currentlyWorking}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all appearance-none cursor-pointer"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
                Prefer to join
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all appearance-none cursor-pointer"
              >
                <option value="full-time">Full time</option>
                <option value="part-time">Part time</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
          </div>

          {/* Experience + role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
                Years of experience
              </label>
              <input
                type="number"
                min="0"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                placeholder="e.g. 2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
                Preferred role
              </label>
              <input
                type="text"
                name="preferredRole"
                value={formData.preferredRole}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                placeholder="e.g. Sales, Trading"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
              Available from
            </label>
            <input
              type="date"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-amber-500/90 mb-2 uppercase tracking-wider">
              Additional Information
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              placeholder="Tell us briefly about your goals..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center px-8 py-4 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-widest hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
            >
              {submitting ? 'Processing...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
// src/Admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Logic to determine if user has admin privileges
      const isAdmin =
        user.email &&
        (user.email.endsWith('@admin.com') || user.email.toLowerCase().includes('admin'));

      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Access Denied: Administrative privileges required.');
        // Optional: sign them out if they aren't admin but logged in
        // await auth.signOut();
      }
    } catch (err) {
      setError('Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Aesthetic Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-md z-10">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl mb-6 group transition-all duration-500 hover:border-amber-500/50">
            <ShieldCheck className="w-12 h-12 text-amber-500 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
            Admin <span className="text-amber-500">Console</span>
          </h1>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mt-2">
            Secure Infrastructure Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-950/50 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-3xl relative">
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Admin Identifier
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black border border-white/10 rounded-2xl focus:border-amber-500/50 focus:outline-none transition-all duration-300 text-white placeholder-zinc-700 font-bold text-sm"
                  placeholder="name@admin.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Security Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-black border border-white/10 rounded-2xl focus:border-amber-500/50 focus:outline-none transition-all duration-300 text-white placeholder-zinc-700 font-bold text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative overflow-hidden bg-amber-500 disabled:bg-zinc-800 text-black font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Authorize Entry
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-10 text-center border-t border-white/5 pt-6">
            <Link
              to="/login"
              className="text-[10px] font-black text-zinc-500 hover:text-amber-500 transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            >
              Exit to Terminal login
            </Link>
          </div>
        </div>
        
        {/* Bottom Security Note */}
        <p className="text-center mt-8 text-[9px] text-zinc-700 font-bold uppercase tracking-[0.4em]">
          Encrypted Session &bull; Managed Access Only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
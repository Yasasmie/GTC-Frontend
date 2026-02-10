// src/Pages/Login.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Chrome, Loader2 } from 'lucide-react';
import { auth, googleProvider } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Could not sign in with Google.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-green-100 rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-1 bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20"
      >
        <div className="bg-white p-10 rounded-[2.3rem] shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            {error && (
              <p className="text-red-500 text-sm mt-4 bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-green-600" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:bg-white outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-green-600" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:bg-white outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            <div className="relative my-8 text-center border-t border-gray-100">
              <span className="relative -top-3 bg-white px-4 text-xs text-gray-400 uppercase">
                Or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50"
            >
              <Chrome size={20} className="text-red-500" /> Google
            </button>
          </form>

          <div className="mt-10 text-center text-gray-500 font-medium">
            New here?{' '}
            <Link
              to="/register"
              className="text-green-600 font-extrabold hover:underline"
            >
              Create account
            </Link>
            <div className="mt-3">
              <Link
                to="/admin-login"
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

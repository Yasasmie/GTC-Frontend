import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Chrome, Loader2 } from 'lucide-react';
import { auth, googleProvider } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
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
    <div className="min-h-screen bg-black font-sans flex flex-col">
      <NavBar />

      <div className="flex-grow flex items-center justify-center relative overflow-hidden py-20 px-4">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-amber-900/10 rounded-full blur-[100px] opacity-30" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md p-[1px] bg-gradient-to-b from-amber-500/30 to-transparent rounded-[2.5rem] shadow-2xl"
        >
          <div className="bg-zinc-950 p-8 md:p-10 rounded-[2.4rem] shadow-sm border border-white/5">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-white tracking-tight">
                Welcome <span className="text-amber-500">Back</span>
              </h2>
              <p className="text-gray-400 mt-2 text-sm">Access your trading dashboard</p>
              {error && (
                <p className="text-red-400 text-sm mt-4 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                  {error}
                </p>
              )}
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-zinc-900 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none text-white placeholder-gray-600 transition-all"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-300 ml-1">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" size={18} />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-zinc-900 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none text-white placeholder-gray-600 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-lg shadow-amber-500/20"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

              <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <span className="relative bg-zinc-950 px-4 text-xs text-gray-500 uppercase tracking-widest">
                  Or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-4 bg-zinc-900 border border-white/10 rounded-2xl font-bold text-white flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all"
              >
                <Chrome size={20} className="text-amber-500" /> Google
              </button>
            </form>

            <div className="mt-10 text-center flex flex-col gap-3">
              <p className="text-gray-400 font-medium">
                New here?{' '}
                <Link
                  to="/register"
                  className="text-amber-500 font-extrabold hover:text-amber-400 hover:underline transition-colors"
                >
                  Create account
                </Link>
              </p>
              <Link
                to="/admin-login"
                className="text-xs text-gray-600 hover:text-amber-500 underline transition-colors"
              >
                Admin Access
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { auth } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { createUserRecord } from '../api'; 
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      // Create backend record
      await createUserRecord({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: `${formData.firstName} ${formData.lastName}`,
      });

      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      });

      alert('Account created! Please check your email for verification.');
      navigate('/login', { replace: true });
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered.');
      } else {
        setError('Failed to create account. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans flex flex-col">
      <NavBar />

      <div className="flex-grow flex items-center justify-center relative overflow-hidden py-20 px-4">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] opacity-40" />
          <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-amber-900/10 rounded-full blur-[100px] opacity-30" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-xl p-[1px] bg-gradient-to-b from-amber-500/30 to-transparent rounded-[2.5rem] shadow-2xl mx-4"
        >
          <div className="bg-zinc-950 p-8 md:p-12 rounded-[2.4rem] border border-white/5">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-white tracking-tight">
                Start Your <span className="text-amber-500">Journey</span>
              </h2>
              <p className="text-gray-400 mt-2 text-sm">Join the elite trading community at Asset Farm</p>
              {error && (
                <p className="text-red-400 text-sm mt-4 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                  {error}
                </p>
              )}
            </div>

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              onSubmit={handleRegister}
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1">
                  First Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-4 text-gray-500 group-focus-within:text-amber-500 transition-colors"
                    size={18}
                  />
                  <input
                    required
                    type="text"
                    placeholder="John"
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-4 bg-zinc-900 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none text-white placeholder-gray-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1">
                  Last Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Doe"
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-4 bg-zinc-900 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none text-white placeholder-gray-600 transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-4 text-gray-500 group-focus-within:text-amber-500 transition-colors"
                    size={18}
                  />
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-4 bg-zinc-900 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none text-white placeholder-gray-600 transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-4 text-gray-500 group-focus-within:text-amber-500 transition-colors"
                    size={18}
                  />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    minLength={8}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-4 bg-zinc-900 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none text-white placeholder-gray-600 transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
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
                      Create My Account <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="mt-10 text-center text-gray-400 font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-amber-500 font-extrabold hover:text-amber-400 hover:underline transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
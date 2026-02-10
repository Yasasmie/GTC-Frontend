// src/Pages/Register.jsx
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
import { createUserRecord } from '../api'; // <-- adjust path if needed

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

  const handleRegister = async e => {
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

      // Create backend record with pending status
      await createUserRecord({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: `${formData.firstName} ${formData.lastName}`,
      });

      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      });

      alert(
        'Account created!'
      );

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
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans relative py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-xl p-1 bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 mx-4"
      >
        <div className="bg-white p-8 md:p-12 rounded-[2.3rem]">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              Start Your Journey
            </h2>
            {error && (
              <p className="text-red-500 text-sm mt-4 bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}
          </div>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleRegister}
          >
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                First Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600"
                  size={18}
                />
                <input
                  required
                  type="text"
                  placeholder="John"
                  onChange={e =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Last Name
              </label>
              <input
                required
                type="text"
                placeholder="Doe"
                onChange={e =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600"
                  size={18}
                />
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600"
                  size={18}
                />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  minLength={8}
                  onChange={e =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
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
                    Create My Account <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-10 text-center text-gray-500 font-medium">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-green-600 font-extrabold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

// src/Pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { getUserProfile } from '../api';
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

const Profile = () => {
  const firebaseUser = auth.currentUser;

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [changePwError, setChangePwError] = useState('');
  const [changePwSuccess, setChangePwSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!firebaseUser) {
        setLoadingProfile(false);
        setErrorProfile('Not logged in.');
        return;
      }
      try {
        const data = await getUserProfile(firebaseUser.uid);
        setProfile(data);
      } catch (err) {
        setErrorProfile('Failed to load profile.');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [firebaseUser]);

  const handleChangePassword = async e => {
    e.preventDefault();
    setChangePwError('');
    setChangePwSuccess('');
    setChangePwLoading(true);

    try {
      if (!firebaseUser || !firebaseUser.email) {
        setChangePwError('No authenticated user found.');
        setChangePwLoading(false);
        return;
      }

      // Re-authenticate with old password
      const cred = EmailAuthProvider.credential(
        firebaseUser.email,
        oldPassword
      );
      await reauthenticateWithCredential(firebaseUser, cred);

      // Update password
      await updatePassword(firebaseUser, newPassword);

      setChangePwSuccess('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setChangePwError(
        err.code === 'auth/wrong-password'
          ? 'Current password is incorrect.'
          : 'Failed to change password. Please try again.'
      );
    } finally {
      setChangePwLoading(false);
    }
  };

  const kyc = profile?.kyc || null;

  return (
    <div className="min-h-screen bg-slate-50">
      

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
          Profile
        </h1>

        {loadingProfile ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : errorProfile ? (
          <p className="text-red-500">{errorProfile}</p>
        ) : (
          <>
            {/* Basic info */}
            <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 mb-8 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Full Name (from registration)
                  </p>
                  <p className="text-base font-medium text-slate-900">
                    {profile?.name || firebaseUser?.displayName || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Email
                  </p>
                  <p className="text-base font-medium text-slate-900">
                    {profile?.email || firebaseUser?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      profile?.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {profile?.status || 'unknown'}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    KYC
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      profile?.kycCompleted
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {profile?.kycCompleted ? 'Completed' : 'Not completed'}
                  </span>
                </div>
              </div>
            </div>

            {/* KYC details */}
            <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 mb-8 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                KYC Details
              </h2>
              {kyc ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Full Name
                    </p>
                    <p className="text-base font-medium text-slate-900">
                      {kyc.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      ID Number
                    </p>
                    <p className="text-base font-medium text-slate-900">
                      {kyc.idNumber}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Address
                    </p>
                    <p className="text-base font-medium text-slate-900">
                      {kyc.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      City
                    </p>
                    <p className="text-base font-medium text-slate-900">
                      {kyc.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Country
                    </p>
                    <p className="text-base font-medium text-slate-900">
                      {kyc.country}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">
                  No KYC information is available yet.
                </p>
              )}
            </div>

            {/* Change password */}
            <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Change Password
              </h2>
              {changePwError && (
                <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-lg">
                  {changePwError}
                </p>
              )}
              {changePwSuccess && (
                <p className="text-green-600 text-sm mb-3 bg-green-50 p-2 rounded-lg">
                  {changePwSuccess}
                </p>
              )}

              <form
                onSubmit={handleChangePassword}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div className="md:col-span-2 mt-2">
                  <button
                    type="submit"
                    disabled={changePwLoading}
                    className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl disabled:opacity-60"
                  >
                    {changePwLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

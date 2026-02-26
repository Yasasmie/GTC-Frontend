import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { getUserProfile } from '../api';
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { User, ShieldCheck, Key, MapPin, Mail, Loader2 } from 'lucide-react';

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

      const cred = EmailAuthProvider.credential(
        firebaseUser.email,
        oldPassword
      );
      await reauthenticateWithCredential(firebaseUser, cred);
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
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
            Trader <span className="text-amber-500">Profile</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Manage your Gold FX account security and identity</p>
        </div>

        {loadingProfile ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Encrypted Data...</p>
          </div>
        ) : errorProfile ? (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-sm">
            {errorProfile}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Account Information Card */}
            <ProfileCard title="Account Information" icon={<User className="text-amber-500" size={20} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoBox label="Full Name" value={profile?.name || firebaseUser?.displayName || 'N/A'} />
                <InfoBox label="Linked Email" value={profile?.email || firebaseUser?.email || 'N/A'} icon={<Mail size={14}/>} />
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Account Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    profile?.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {profile?.status || 'Pending Verification'}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">KYC Verification</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    profile?.kycCompleted ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {profile?.kycCompleted ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </ProfileCard>

            {/* KYC Details Card */}
            <ProfileCard title="Identity Details (KYC)" icon={<ShieldCheck className="text-amber-500" size={20} />}>
              {kyc ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InfoBox label="Legal Name" value={kyc.fullName} />
                  <InfoBox label="Document Number" value={kyc.idNumber} />
                  <div className="md:col-span-2">
                    <InfoBox label="Residential Address" value={kyc.address} icon={<MapPin size={14}/>} />
                  </div>
                  <InfoBox label="City" value={kyc.city} />
                  <InfoBox label="Country" value={kyc.country} />
                </div>
              ) : (
                <div className="py-6 text-center border border-dashed border-white/10 rounded-2xl">
                  <p className="text-gray-500 text-sm font-medium italic">No KYC data submitted yet.</p>
                </div>
              )}
            </ProfileCard>

            {/* Security Card */}
            <ProfileCard title="Security & Password" icon={<Key className="text-amber-500" size={20} />}>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-white placeholder-gray-700"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Secure Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-white placeholder-gray-700"
                      placeholder="Min. 8 characters"
                    />
                  </div>
                </div>

                {changePwError && <p className="text-red-500 text-xs font-bold uppercase tracking-tighter bg-red-500/5 p-3 rounded-lg border border-red-500/10">{changePwError}</p>}
                {changePwSuccess && <p className="text-emerald-500 text-xs font-bold uppercase tracking-tighter bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">{changePwSuccess}</p>}

                <button
                  type="submit"
                  disabled={changePwLoading}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-amber-500/10 flex items-center gap-2"
                >
                  {changePwLoading && <Loader2 size={16} className="animate-spin" />}
                  {changePwLoading ? 'UPDATING SECURE KEY...' : 'UPDATE PASSWORD'}
                </button>
              </form>
            </ProfileCard>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal Helper Components
const ProfileCard = ({ title, icon, children }) => (
  <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-amber-500/10 transition-colors" />
    <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
      {icon}
      <h2 className="text-lg font-black text-white uppercase tracking-widest">{title}</h2>
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

const InfoBox = ({ label, value, icon }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
      {label}
    </p>
    <div className="flex items-center gap-2">
      {icon && <span className="text-amber-500/50">{icon}</span>}
      <p className="text-base font-bold text-gray-200 tracking-tight">{value}</p>
    </div>
  </div>
);

export default Profile;
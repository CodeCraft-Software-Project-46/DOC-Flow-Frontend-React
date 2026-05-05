import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axiosInstance from '../../api/axiosInstance';
import { Lock } from 'lucide-react';

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams(); // Grabs params from URL link sent in email
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      await axiosInstance.post('/auth/password-reset-confirm/', {
        uid,
        token,
        new_password: newPassword
      });
      alert("Password reset successfully! Please login.");
      navigate('/'); // Redirect to login page
    } catch (err) {
      setError("Token expired or invalid link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1E2E] p-6">
      <form onSubmit={handleReset} className="max-w-md w-full bg-[#1a2c3e] border border-white/10 p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Password</h2>
        
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm mb-4">{error}</div>}

        <div className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-white/40" size={18} />
            <input
              type="password"
              placeholder="New Password"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-white/40" size={18} />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordConfirm;
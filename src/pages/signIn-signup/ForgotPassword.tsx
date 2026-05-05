import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Using your existing instance[cite: 2]
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hits the backend view we just built
      await axiosInstance.post('/auth/password-reset/', { email });
      setMessage("If an account exists, a reset link has been sent to your email.");
    } catch (err) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1E2E] p-6">
      <div className="max-w-md w-full bg-[#1a2c3e] border border-white/10 p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
        <p className="text-white/60 mb-6 text-sm">Enter your email and we'll send you a link to reset your password.</p>
        
        {message ? (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm mb-4">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-white/40" size={18} />
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                placeholder="email@docflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
        
        <Link to="/" className="mt-6 flex items-center justify-center text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
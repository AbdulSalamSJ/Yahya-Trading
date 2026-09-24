import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../image/logo.jpg';

export function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@yahiyatraders.com');
      setPassword('Admin@123');
      setIsRegistering(false);
    } else {
      setEmail('customer@example.com');
      setPassword('Customer@123');
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FFFFFF] dark:bg-[#271E1B] border border-[#EBE0D8] dark:border-[#3E2F29] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#6D4C41] dark:text-[#C8B8B0] hover:text-[#3E2723] dark:hover:text-[#F5EFEA] rounded-lg transition"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#fee000] mx-auto mb-3 shadow-md bg-white">
            <img src={logoImg} alt="Yahiya Traders" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-black text-[#1d1d1d] dark:text-white">
            {isRegistering ? 'Join Yahiya Traders Club' : 'Welcome to Yahiya Traders'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isRegistering
              ? 'Receive fresh harvest previews, royal dates announcements, and member discounts.'
              : 'Sign in to access your orders, delivery tracking, and store administration.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#D32F2F]/10 text-[#D32F2F] text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Quick Demo Fill Buttons */}
        <div className="mb-5 p-3 rounded-xl bg-[#FDF8F5] dark:bg-[#1C1412] border border-[#EBE0D8] dark:border-[#3E2F29]">
          <span className="text-[11px] font-semibold text-[#6D4C41] dark:text-[#C8B8B0] block mb-2">
            Instant Demo Logins (Click to auto-fill):
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="flex-1 py-1.5 px-2 bg-white dark:bg-[#271E1B] border border-[#D7C4BC] dark:border-[#3E2F29] rounded-lg text-xs font-bold text-[#795548] dark:text-[#A1887F] hover:bg-[#EFEBE9] transition cursor-pointer"
            >
              👑 Admin Account
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className="flex-1 py-1.5 px-2 bg-white dark:bg-[#271E1B] border border-[#D7C4BC] dark:border-[#3E2F29] rounded-lg text-xs font-bold text-[#6D4C41] dark:text-[#C8B8B0] hover:bg-[#EFEBE9] transition cursor-pointer"
            >
              🌴 Customer Account
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-[#A1887F]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Claire Delacroix"
                  className="w-full h-11 pl-10 pr-3.5 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-[#A1887F]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="claire@domain.com"
                className="w-full h-11 pl-10 pr-3.5 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3E2723] dark:text-[#F5EFEA] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-[#A1887F]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-3.5 rounded-input border border-[#D7C4BC] dark:border-[#3E2F29] bg-white dark:bg-[#271E1B] text-[#3E2723] dark:text-[#F5EFEA] text-sm focus:outline-none focus:ring-2 focus:ring-[#795548]/30 focus:border-[#795548]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-full bg-[#fee000] hover:bg-[#f5d600] text-[#1d1d1d] text-sm font-black shadow-md transition-all mt-2 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : isRegistering ? 'Join Yahiya Traders' : 'Sign In'}</span>
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-[#6D4C41] dark:text-[#C8B8B0]">
          {isRegistering ? (
            <span>
              Already a member?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="font-semibold text-[#795548] dark:text-[#A1887F] hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to Yahiya Traders?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="font-bold text-[#1d1d1d] dark:text-[#fee000] hover:underline"
              >
                Create an Account
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

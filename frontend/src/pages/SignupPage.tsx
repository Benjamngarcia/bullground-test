import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IconLoader2 } from '@tabler/icons-react';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export default function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await signup(email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-800 rounded-md flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <rect x="7" y="4" width="10" height="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="7" y="9.5" width="10" height="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="7" y="15" width="10" height="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-white">BULLGROUND</h1>
              <p className="text-xs text-zinc-500">Advisors</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Create your account</h2>
          <p className="text-zinc-500 text-sm">
            Join Bullground and start managing your portfolio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-zinc-600">Must be at least 6 characters</p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <IconLoader2 size={18} stroke={2} className="animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors focus:outline-none"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

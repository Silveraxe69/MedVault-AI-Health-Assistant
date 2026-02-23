import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submit
    if (loading) return;

    setError('');

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);

      console.log('Attempting login...');

      const result = await signIn(email.trim(), password);

      console.log('Login result:', result);

      if (!result || result.error) {
        throw result?.error || new Error('Login failed.');
      }

      // Reset loading before navigation
      setLoading(false);

      onNavigate('dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Welcome Back
        </h1>
        <p className="text-xl text-gray-600 mb-6 text-center">
          Login to access your health records
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-2xl font-medium text-gray-900 mb-3">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-5 text-2xl border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-2xl font-medium text-gray-900 mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-5 text-2xl border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border-4 border-red-400 text-red-700 px-6 py-4 rounded-xl text-xl">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() => onNavigate('forgot-password')}
            className="text-blue-600 text-xl font-medium"
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-6 px-6 rounded-xl text-2xl font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="w-full text-blue-600 py-4 text-xl font-medium"
          >
            Don't have an account? Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

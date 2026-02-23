import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';

interface SignUpProps {
  onNavigate: (page: string) => void;
}

export default function SignUp({ onNavigate }: SignUpProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signUp(email, password, fullName, phone);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
          <div>
            <label className="block text-2xl font-medium text-gray-900 mb-3">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-6 py-5 text-2xl border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-2xl font-medium text-gray-900 mb-3">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-6 py-5 text-2xl border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-100 border-4 border-red-400 text-red-700 px-6 py-4 rounded-xl text-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-6 px-6 rounded-xl text-2xl font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mt-auto"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full text-blue-600 py-4 text-xl font-medium"
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
}

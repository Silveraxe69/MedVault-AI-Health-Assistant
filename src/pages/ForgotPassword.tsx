import { useState } from 'react';

interface ForgotPasswordProps {
  onNavigate: (page: string) => void;
}

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Forgot Password</h1>
        <p className="text-xl text-gray-600 mb-8 text-center">
          {submitted
            ? 'Password reset link sent to your email (Demo Mode)'
            : 'Enter your email to reset your password'}
        </p>

        {!submitted ? (
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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-6 px-6 rounded-xl text-2xl font-bold hover:bg-blue-700"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full text-blue-600 py-4 text-xl font-medium"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-100 border-4 border-green-400 text-green-700 px-6 py-4 rounded-xl text-xl text-center">
              Check your email for the password reset link
            </div>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full bg-blue-600 text-white py-6 px-6 rounded-xl text-2xl font-bold hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

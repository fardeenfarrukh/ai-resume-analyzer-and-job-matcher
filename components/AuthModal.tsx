import React, { useState, useEffect } from 'react';
import { login, signup } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'login' | 'signup';
  onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialType = 'login', onAuthSuccess }) => {
  const [authType, setAuthType] = useState(initialType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAuthType(initialType);
    setError(null); // Reset error when type changes
  }, [initialType]);
  
  // Reset fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const isLogin = authType === 'login';
  const title = isLogin ? 'Log In' : 'Sign Up';
  const buttonText = isLogin ? 'Log In' : 'Create Account';
  const switchText = isLogin ? "Don't have an account?" : 'Already have an account?';
  const switchActionText = isLogin ? 'Sign Up' : 'Log In';

  const handleSwitchType = () => {
    setAuthType(isLogin ? 'signup' : 'login');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onAuthSuccess();
    } catch (err) {
      // Map Firebase error codes to user-friendly messages
      let message = 'An unknown error occurred.';
      if (err instanceof Error && 'code' in err) {
        switch ((err as any).code) {
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                message = 'Invalid email or password.';
                break;
            case 'auth/email-already-in-use':
                message = 'An account with this email already exists.';
                break;
            case 'auth/weak-password':
                message = 'Password should be at least 6 characters.';
                break;
            default:
                message = 'Failed to authenticate. Please try again.';
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="relative bg-celeste-light-card dark:bg-celeste-deep-blue/90 border border-gray-200 dark:border-celeste-pink/20 rounded-lg shadow-xl w-full max-w-md m-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-celeste-light-muted dark:text-celeste-muted hover:text-celeste-light-text dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 id="auth-modal-title" className="text-2xl font-bold text-center text-celeste-light-text dark:text-white mb-6">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-celeste-light-muted dark:text-celeste-muted mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full bg-celeste-light-bg dark:bg-celeste-dark border border-gray-300 dark:border-celeste-pink/30 rounded-md p-3 text-sm text-celeste-light-text dark:text-celeste-text placeholder-gray-400 dark:placeholder-celeste-muted/70 focus:ring-2 focus:ring-celeste-pink focus:border-celeste-pink transition duration-300 disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-celeste-light-muted dark:text-celeste-muted mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full bg-celeste-light-bg dark:bg-celeste-dark border border-gray-300 dark:border-celeste-pink/30 rounded-md p-3 text-sm text-celeste-light-text dark:text-celeste-text placeholder-gray-400 dark:placeholder-celeste-muted/70 focus:ring-2 focus:ring-celeste-pink focus:border-celeste-pink transition duration-300 disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-celeste-light-muted dark:text-celeste-muted mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-celeste-light-bg dark:bg-celeste-dark border border-gray-300 dark:border-celeste-pink/30 rounded-md p-3 text-sm text-celeste-light-text dark:text-celeste-text placeholder-gray-400 dark:placeholder-celeste-muted/70 focus:ring-2 focus:ring-celeste-pink focus:border-celeste-pink transition duration-300 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-celeste-pink text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-80 transition-all duration-300 ease-in-out transform hover:scale-105 button-glow disabled:bg-celeste-muted/50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : buttonText}
          </button>
        </form>
        
        <p className="text-center text-sm text-celeste-light-muted dark:text-celeste-muted mt-6">
          {switchText}{' '}
          <button onClick={handleSwitchType} disabled={isLoading} className="font-medium text-celeste-pink hover:underline disabled:opacity-50">
            {switchActionText}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
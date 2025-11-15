import React from 'react';
import ThemeToggle from './ThemeToggle';
import type { User } from '../types';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onAuthClick: (type: 'login' | 'signup') => void;
  user: User | null;
  onLogout: () => void;
  onHistoryClick: () => void;
  onAdminClick: () => void; // New prop for admin panel
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onAuthClick, user, onLogout, onHistoryClick, onAdminClick }) => {
  return (
    <header className="bg-celeste-light-card/80 dark:bg-celeste-deep-blue/80 backdrop-blur-sm border-b border-gray-200 dark:border-celeste-pink/20 sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-celeste-pink mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h1 className="text-xl md:text-2xl font-bold text-celeste-light-text dark:text-white tracking-wide">
            AI Resume Analyzer & Job Matcher
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.isAdmin && (
                <button
                  onClick={onAdminClick}
                  className="hidden sm:block text-sm font-medium text-celeste-cyan hover:text-white transition-colors duration-200"
                >
                  Admin Panel
                </button>
              )}
               <button
                onClick={onHistoryClick}
                className="hidden sm:block text-sm font-medium text-celeste-light-muted dark:text-celeste-muted hover:text-celeste-light-text dark:hover:text-white transition-colors duration-200"
              >
                My History
              </button>
              <span className="hidden sm:block text-sm text-celeste-light-muted dark:text-celeste-muted border-l border-gray-300 dark:border-celeste-muted/30 pl-4">
                {user.email}
              </span>
              <button
                onClick={onLogout}
                className="text-sm font-medium text-celeste-light-muted dark:text-celeste-muted hover:text-celeste-light-text dark:hover:text-white transition-colors duration-200"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onAuthClick('login')}
                className="hidden sm:block text-sm font-medium text-celeste-light-muted dark:text-celeste-muted hover:text-celeste-light-text dark:hover:text-white transition-colors duration-200"
              >
                Log In
              </button>
              <button 
                onClick={() => onAuthClick('signup')}
                className="hidden sm:block text-sm font-medium bg-celeste-pink text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-all duration-300 ease-in-out transform hover:scale-105 button-glow"
              >
                Sign Up
              </button>
            </>
          )}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
};

export default Header;
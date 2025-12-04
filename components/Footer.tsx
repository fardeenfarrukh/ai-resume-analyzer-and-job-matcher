import React from 'react';

const Footer: React.FC = () => {
  return (
    // Footer sticks to the bottom of the page and adapts to light/dark themes
    <footer className="bg-celeste-light-card dark:bg-celeste-deep-blue/50 mt-8 border-t border-gray-200 dark:border-transparent">
      <div className="container mx-auto px-4 md:px-8 py-4 text-center text-sm text-celeste-light-muted dark:text-celeste-muted">
        {/* Using new Date().getFullYear() ensures the year updates automatically without manual edits */}
        <p>&copy; {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';

interface KeywordAnalysisProps {
  matchingKeywords: string[];
  missingKeywords: string[];
}

// Small pill component for displaying keywords.
// The styling changes depending on whether it's a match or a missing keyword.
const KeywordPill: React.FC<{ text: string, type: 'match' | 'miss' }> = ({ text, type }) => {
  const baseClasses = 'px-3 py-1 text-sm font-medium rounded-full transition-transform hover:scale-110';
  const typeClasses = type === 'match'
    ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-celeste-cyan border border-cyan-300 dark:border-celeste-cyan/50'
    : 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-celeste-pink border border-pink-300 dark:border-celeste-pink/50';
  return <span className={`${baseClasses} ${typeClasses}`}>{text}</span>;
};

const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({ matchingKeywords, missingKeywords }) => {
  return (
    <div className="bg-celeste-light-bg dark:bg-celeste-dark p-6 rounded-lg space-y-6">
      <div>
        <h4 className="text-md font-semibold text-celeste-light-text dark:text-white mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-500 dark:text-celeste-cyan" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Matching Keywords
        </h4>
        <div className="flex flex-wrap gap-2">
          {matchingKeywords.length > 0 ? (
            matchingKeywords.map((keyword, index) => <KeywordPill key={`match-${index}`} text={keyword} type="match" />)
          ) : (
            // Helpful fallback when no strong matches are found
            <p className="text-sm text-celeste-light-muted dark:text-celeste-muted">No strong keyword matches found.</p>
          )}
        </div>
      </div>
      <div>
        <h4 className="text-md font-semibold text-celeste-light-text dark:text-white mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500 dark:text-celeste-pink" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.001-1.742 3.001H4.42c-1.532 0-2.492-1.667-1.742-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Missing Keywords
        </h4>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.length > 0 ? (
            missingKeywords.map((keyword, index) => <KeywordPill key={`miss-${index}`} text={keyword} type="miss" />)
          ) : (
            // Positive fallback when nothing is missing
            <p className="text-sm text-celeste-light-muted dark:text-celeste-muted">Great job! No major keywords seem to be missing.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeywordAnalysis;

import React from 'react';
import type { Suggestion } from '../types';

interface SuggestionsProps {
  suggestions: Suggestion[];
}

// Each suggestion is displayed in its own card.
// The hover effects (border + shadow) are there to make the UI feel more interactive.
const SuggestionCard: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => (
  <div className="bg-celeste-light-bg dark:bg-celeste-dark p-4 rounded-lg border border-gray-200 dark:border-celeste-pink/20 transition-all duration-300 hover:border-celeste-pink/50 hover:shadow-lg hover:shadow-celeste-pink/10">
    <h5 className="font-bold text-celeste-light-text dark:text-white flex items-center mb-2">
      {/* Icon chosen to suggest "improvement" or "action" */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-celeste-pink" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
      </svg>
      {suggestion.title}
    </h5>
    <p className="text-sm text-celeste-light-muted dark:text-celeste-muted">{suggestion.description}</p>
  </div>
);

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-celeste-light-text dark:text-white mb-4">Improvement Suggestions</h3>
      <div className="space-y-4">
        {/* Mapping suggestions into cards keeps the component flexible
            — new suggestions can be added without changing layout logic */}
        {suggestions.map((suggestion, index) => (
          <SuggestionCard key={index} suggestion={suggestion} />
        ))}
      </div>
    </div>
  );
};

export default Suggestions;

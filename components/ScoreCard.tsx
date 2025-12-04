import React from 'react';

interface ScoreCardProps {
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Decide text color based on score range
  const getScoreColor = (s: number) => {
    if (s < 50) return 'text-red-500 dark:text-red-400';
    if (s < 75) return 'text-pink-500 dark:text-celeste-pink';
    return 'text-cyan-500 dark:text-celeste-cyan';
  };
  
  // Stroke color for the circular progress bar
  const getStrokeColor = (s: number) => {
    if (s < 50) return 'stroke-red-500';
    if (s < 75) return 'stroke-celeste-pink';
    return 'stroke-celeste-cyan';
  };

  return (
    <div className="bg-celeste-light-bg dark:bg-celeste-dark p-6 rounded-lg flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-celeste-light-text dark:text-white mb-4">Match Score</h3>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <defs>
              {/* Glow filter makes the progress ring stand out visually */}
              <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                  </feMerge>
              </filter>
          </defs>
          {/* Background circle (gray track) */}
          <circle
            className="stroke-current text-gray-200 dark:text-celeste-deep-blue"
            strokeWidth="10"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          {/* Foreground circle (progress ring).
              Rotated -90deg so progress starts at the top instead of the right. */}
          <circle
            className={`transform -rotate-90 origin-center transition-all duration-1000 ease-out ${getStrokeColor(score)}`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            style={{ filter: 'url(#glow)' }}
          />
        </svg>
        {/* Numeric score displayed in the center */}
        <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${getScoreColor(score)}`}>
          {score}%
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;

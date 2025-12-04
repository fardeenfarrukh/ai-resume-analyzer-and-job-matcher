import React from 'react';

interface ResumeViewProps {
  title: string;
  text: string;
}

const ResumeView: React.FC<ResumeViewProps> = ({ title, text }) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-celeste-light-text dark:text-white mb-4">{title}</h3>
      {/* Using <pre> with whitespace-pre-wrap keeps formatting from the resume intact
          (line breaks, spacing) while still wrapping long lines nicely. */}
      <div className="bg-celeste-light-bg dark:bg-celeste-dark p-4 rounded-lg border border-gray-200 dark:border-celeste-pink/20 max-h-[60vh] overflow-y-auto">
        <pre className="text-sm text-celeste-light-text dark:text-celeste-text whitespace-pre-wrap font-sans">
          {text}
        </pre>
      </div>
    </div>
  );
};

export default ResumeView;

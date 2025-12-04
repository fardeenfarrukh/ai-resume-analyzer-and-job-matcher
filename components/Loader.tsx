import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      {/* Simple spinner + text combo.
          Spinner uses Tailwind's animate-spin with a border trick to look like a loading circle. */}
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      {/* Text shown alongside spinner so users know what’s happening */}
      <span className="font-semibold text-white">Analyzing...</span>
    </div>
  );
};

export default Loader;

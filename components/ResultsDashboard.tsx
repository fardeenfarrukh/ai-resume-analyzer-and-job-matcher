import React, { useState, useEffect } from 'react';
import type { AnalysisResult, User } from '../types';
import ScoreCard from './ScoreCard';
import KeywordAnalysis from './KeywordAnalysis';
import Suggestions from './Suggestions';
import ResumeView from './ResumeView';

interface ResultsDashboardProps {
  result: AnalysisResult;
  currentUser: User | null;
  onSaveReport: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, currentUser, onSaveReport }) => {
  const [view, setView] = useState<'analysis' | 'original' | 'improved'>('analysis');
  const [isShareCopied, setIsShareCopied] = useState(false);
  const [isReportSaved, setIsReportSaved] = useState(false);

  // Reset view when result changes
  useEffect(() => {
    setView('analysis');
    setIsReportSaved(false); // Reset saved state for new reports
  }, [result]);

  const handleExport = () => {
    try {
      window.print();
    } catch (error) {
      console.error("Failed to open print dialog:", error);
      alert("Could not open the print dialog. Please check your browser settings or permissions.");
    }
  };

  const handleShare = () => {
    try {
      const jsonString = JSON.stringify(result);
      // Use a robust encoding method that handles all Unicode characters
      const encodedData = btoa(unescape(encodeURIComponent(jsonString)));
      const url = `${window.location.origin}${window.location.pathname}#report=${encodedData}`;
      
      navigator.clipboard.writeText(url).then(() => {
        setIsShareCopied(true);
        setTimeout(() => setIsShareCopied(false), 2500); // Reset after 2.5 seconds
      }).catch(err => {
        console.error("Failed to copy URL:", err);
        alert("Could not copy link to clipboard. Please copy it manually.");
      });
    } catch (error) {
      console.error("Failed to create shareable link:", error);
      alert("An error occurred while creating the shareable link.");
    }
  };

  const handleSave = () => {
    onSaveReport();
    setIsReportSaved(true);
  };

  const getButtonClass = (buttonView: typeof view) => {
    const base = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ease-in-out";
    if (view === buttonView) {
      return `${base} bg-celeste-pink text-white button-glow`;
    }
    return `${base} bg-transparent hover:bg-celeste-pink/20 text-celeste-pink border border-celeste-pink`;
  };

  return (
    <div className="bg-celeste-light-card dark:bg-celeste-deep-blue/80 border border-gray-200 dark:border-celeste-pink/20 p-6 rounded-lg space-y-8 animate-fade-in">
      
      <div className="flex justify-center gap-2 md:gap-4 no-print">
        <button onClick={() => setView('analysis')} className={getButtonClass('analysis')}>
          Analysis Report
        </button>
        <button onClick={() => setView('original')} className={getButtonClass('original')}>
          Original Resume
        </button>
        <button onClick={() => setView('improved')} className={getButtonClass('improved')}>
          Improved Resume
        </button>
      </div>

      {view === 'analysis' && (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-celeste-light-text dark:text-white mb-2">{result.jobTitle || 'Analysis Complete'}</h2>
            <p className="text-celeste-light-muted dark:text-celeste-muted">{result.summary}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <ScoreCard score={result.matchScore} />
            <KeywordAnalysis
              matchingKeywords={result.matchingKeywords}
              missingKeywords={result.missingKeywords}
            />
          </div>

          <Suggestions suggestions={result.suggestions} />
        </div>
      )}

      {view === 'original' && (
        <ResumeView title="Original Resume" text={result.originalResumeText} />
      )}

      {view === 'improved' && (
        <ResumeView title="Improved Resume" text={result.improvedResumeText} />
      )}

      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 no-print">
        {currentUser && (
           <button
            onClick={handleSave}
            disabled={isReportSaved}
            className="w-full sm:w-auto flex justify-center items-center bg-celeste-cyan text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-celeste-muted/70 disabled:scale-100 disabled:cursor-wait"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12l-5-3-5 3V4z" /></svg>
            {isReportSaved ? 'Report Saved' : 'Save Report'}
          </button>
        )}
        <button
          onClick={handleShare}
          disabled={isShareCopied}
          className="w-full sm:w-auto flex justify-center items-center bg-celeste-pink text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-all duration-300 ease-in-out transform hover:scale-105 button-glow disabled:bg-celeste-muted/70 disabled:scale-100 disabled:cursor-wait"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block -mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          {isShareCopied ? 'Link Copied!' : 'Share Report'}
        </button>
        <button
          onClick={handleExport}
          className="w-full sm:w-auto bg-transparent hover:bg-celeste-pink/20 text-celeste-pink font-semibold py-2 px-6 border border-celeste-pink rounded-md transition-colors duration-300 ease-in-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block -mt-1 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
import React from 'react';
import type { SavedReport } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: SavedReport[];
  onLoadReport: (report: SavedReport) => void;
  onDeleteReport: (reportId: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, reports, onLoadReport, onDeleteReport }) => {
  if (!isOpen) {
    return null; // don’t render anything if modal is closed
  }

  // Format savedAt timestamps into something readable for users
  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div 
        className="relative bg-celeste-light-card dark:bg-celeste-deep-blue/90 border border-gray-200 dark:border-celeste-pink/20 rounded-lg shadow-xl w-full max-w-2xl m-4"
        onClick={(e) => e.stopPropagation()} // prevent accidental close when clicking inside
      >
        <div className="p-6 border-b border-gray-200 dark:border-celeste-pink/20">
            <h2 id="history-modal-title" className="text-xl font-bold text-celeste-light-text dark:text-white">
              My Analysis History
            </h2>
            {/* Close button in top-right corner */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-celeste-light-muted dark:text-celeste-muted hover:text-celeste-light-text dark:hover:text-white transition-colors"
                aria-label="Close modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {reports.length === 0 ? (
            // Empty state message when user hasn’t saved anything yet
            <p className="text-center text-celeste-light-muted dark:text-celeste-muted">
              You haven't saved any reports yet. After an analysis, click "Save Report" to add it to your history.
            </p>
          ) : (
            <ul className="space-y-4">
              {reports.map((report) => (
                <li 
                  key={report.id} 
                  className="bg-celeste-light-bg dark:bg-celeste-dark p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex-grow">
                    <p className="font-semibold text-celeste-light-text dark:text-white">{report.jobTitle}</p>
                    <p className="text-sm text-celeste-light-muted dark:text-celeste-muted">
                      Score: {report.matchScore}% | Saved: {formatDateTime(report.savedAt)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2 self-end sm:self-center">
                    {/* Load button restores a saved report into the dashboard */}
                    <button
                      onClick={() => onLoadReport(report)}
                      className="text-sm font-medium bg-celeste-pink text-white px-3 py-1 rounded-md hover:bg-opacity-80 transition-colors"
                    >
                      Load
                    </button>
                    {/* Delete button removes report from history */}
                    <button
                      onClick={() => onDeleteReport(report.id)}
                      className="text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 p-2 rounded-full transition-colors"
                      aria-label={`Delete report for ${report.jobTitle}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;

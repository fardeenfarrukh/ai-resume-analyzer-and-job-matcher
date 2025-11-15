import React from 'react';
import Loader from './Loader';

interface InputSectionProps {
  resume: string;
  jobDescription: string;
  onResumeChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onResumeFileChange: (file: File) => void;
  resumeFileName: string | null;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  resume,
  jobDescription,
  onResumeChange,
  onJobDescriptionChange,
  onResumeFileChange,
  resumeFileName,
  onSubmit,
  isLoading,
}) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onResumeFileChange(file);
    }
    // Reset file input value to allow re-uploading the same file
    event.target.value = '';
  };

  return (
    <div className="bg-celeste-light-card dark:bg-celeste-deep-blue/80 border border-gray-200 dark:border-celeste-pink/20 p-6 rounded-lg space-y-6">
      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-celeste-light-muted dark:text-celeste-muted mb-2">
          Your Resume
        </label>
        
        <div className="mb-4">
          <label 
            htmlFor="resume-upload" 
            className="w-full flex flex-col items-center px-4 py-6 bg-celeste-light-bg dark:bg-celeste-dark border-2 border-dashed border-gray-300 dark:border-celeste-pink/30 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-celeste-deep-blue transition-colors duration-300"
          >
            <svg className="w-8 h-8 text-celeste-light-muted dark:text-celeste-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <span className="mt-2 text-sm leading-normal text-celeste-light-muted dark:text-celeste-muted text-center">
              {resumeFileName ? resumeFileName : "Select a file (PDF, DOCX, TXT)"}
            </span>
            <span className="text-xs text-celeste-light-muted/80 dark:text-celeste-muted/70">or paste content below</span>
          </label>
          <input id="resume-upload" type="file" className="hidden" onChange={handleFileSelect} disabled={isLoading} />
        </div>

        <textarea
          id="resume"
          rows={8}
          className="w-full bg-celeste-light-bg dark:bg-celeste-dark border border-gray-300 dark:border-celeste-pink/30 rounded-md p-3 text-sm text-celeste-light-text dark:text-celeste-text placeholder-gray-400 dark:placeholder-celeste-muted/70 focus:ring-2 focus:ring-celeste-pink focus:border-celeste-pink transition duration-300"
          placeholder="Paste your resume text here..."
          value={resume}
          onChange={(e) => onResumeChange(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="job-description" className="block text-sm font-medium text-celeste-light-muted dark:text-celeste-muted mb-2">
          Job Description
        </label>
        <textarea
          id="job-description"
          rows={12}
          className="w-full bg-celeste-light-bg dark:bg-celeste-dark border border-gray-300 dark:border-celeste-pink/30 rounded-md p-3 text-sm text-celeste-light-text dark:text-celeste-text placeholder-gray-400 dark:placeholder-celeste-muted/70 focus:ring-2 focus:ring-celeste-pink focus:border-celeste-pink transition duration-300"
          placeholder="Paste the job description text here..."
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || (!resume && !resumeFileName) || !jobDescription}
        className="w-full flex justify-center items-center bg-celeste-pink hover:bg-opacity-80 disabled:bg-celeste-muted/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 button-glow"
      >
        {isLoading ? <Loader /> : 'Analyze Now'}
      </button>
    </div>
  );
};

export default InputSection;
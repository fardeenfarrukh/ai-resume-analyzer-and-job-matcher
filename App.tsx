// Bringing in the essentials from React for building our UI
import React, { useState, useCallback, useEffect, type FC } from 'react';

// Grabbing our custom UI building blocks
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsDashboard from './components/ResultsDashboard';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import HistoryModal from './components/HistoryModal';

// Our core backend service calls (connecting to Gemini and Firebase, etc.)
import { analyzeResume } from './services/geminiService';
import { 
  logout, 
  onAuthStateChanged, // This one listens for who's logged in
  getAllUsers,
  deleteUserDocuments
} from './services/authService';
import { getHistoryForUser, saveReport, deleteReport } from './services/historyService';

// Defining some key data shapes to keep things tidy
import type { AnalysisResult, UploadedFile, User, SavedReport } from './types';


// Let's whip up an Admin panel component right here. Keeps things centralized for now.
const AdminModal: FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const [userList, setUserList] = useState<User[]>([]); // Renamed `users` to `userList`
  const [dataLoading, setDataLoading] = useState(true); // Renamed `isLoading` to `dataLoading`
  const [problemReport, setProblemReport] = useState<string | null>(null); // Renamed `error` to `problemReport`

  // Effect to load users whenever the modal pops open.
  useEffect(() => {
    if (isOpen) {
      setDataLoading(true);
      setProblemReport(null);
      getAllUsers()
        .then(setUserList) // Directly setting the fetched users
        .catch(() => setProblemReport("Couldn't grab users. Permissions issue, perhaps?")) // More colloquial error message
        .finally(() => setDataLoading(false));
    }
  }, [isOpen]); // Only re-run when `isOpen` flips

  // Function to handle the removal of a user from the system
  const nixUser = async (targetUserId: string) => { // Renamed `handleDeleteUser` to `nixUser`
    if (window.confirm('Seriously? Deleting this user means *all* their data is gone. No take-backs!')) { // More assertive confirmation
        try {
            await deleteUserDocuments(targetUserId);
            setUserList(currentUsers => currentUsers.filter(u => u.id !== targetUserId)); // More descriptive state update
        } catch {
            setProblemReport("User deletion failed for some reason."); // Slightly different error phrasing
        }
    }
  };

  if (!isOpen) return null; // If not open, render absolutely nothing.

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="relative bg-celeste-light-card dark:bg-celeste-deep-blue/90 border border-gray-200 dark:border-celeste-pink/20 rounded-lg shadow-xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-celeste-pink/20">
          <h2 className="text-xl font-bold text-celeste-light-text dark:text-white">Admin Hub - User Overlook</h2> {/* Slightly rephrased title */}
          <button onClick={onClose} className="absolute top-4 right-4 text-celeste-light-muted dark:text-celeste-muted hover:text-celeste-light-text dark:hover:text-white transition-colors" aria-label="Close modal">
            {/* A simple 'X' icon for closing. Pretty standard. */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {dataLoading && <p>Just a sec, fetching the user roster...</p>} {/* More casual loading message */}
          {problemReport && <p className="text-red-500">{problemReport}</p>}
          {!dataLoading && !problemReport && (
             <ul className="space-y-3">
              {userList.map(user => ( // Using `userList` here
                <li key={user.id} className="bg-celeste-light-bg dark:bg-celeste-dark p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-celeste-light-text dark:text-white">{user.email}</p>
                    <p className="text-xs text-celeste-light-muted dark:text-celeste-muted">{user.id}</p>
                  </div>
                  {user.isAdmin ? (
                    <span className="text-sm font-bold text-celeste-cyan">Administrator</span> // Changed 'Admin' to 'Administrator'
                  ) : (
                    <button onClick={() => nixUser(user.id)} className="text-sm text-red-500 hover:text-red-700">Remove User</button> // Changed 'Delete' to 'Remove User'
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};


// The main brain of our application
const App: FC = () => { // Using `FC` (Function Component) type alias

  // Resume related states
  const [myResumeText, setMyResumeText] = useState(''); // Renamed `resumeText` to `myResumeText`
  const [uploadedResumeFile, setUploadedResumeFile] = useState<UploadedFile | null>(null); // Renamed `resumeFile` to `uploadedResumeFile`
  const [jobDescriptionContent, setJobDescriptionContent] = useState(''); // Renamed `jobDescriptionText` to `jobDescriptionContent`

  // Analysis result states
  const [analysisOutcome, setAnalysisOutcome] = useState<AnalysisResult | null>(null); // Renamed `analysisResult` to `analysisOutcome`
  const [analysisInProgress, setAnalysisInProgress] = useState(false); // Renamed `isLoading` to `analysisInProgress`
  const [currentError, setCurrentError] = useState<string | null>(null); // Renamed `error` to `currentError`

  // Theme state (light or dark mode)
  const [appTheme, setAppTheme] = useState<'light' | 'dark'>(() => { // Renamed `theme` to `appTheme`
    // Fetching theme from local storage, defaulting to 'dark' if nothing's saved
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });
  
  // States for authentication flow
  const [showAuthScreen, setShowAuthScreen] = useState(false); // Renamed `isAuthModalOpen`
  const [authFlowType, setAuthFlowType] = useState<'login' | 'signup'>('login'); // Renamed `authModalType`
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null); // Renamed `currentUser`

  // History related states
  const [displayHistory, setDisplayHistory] = useState(false); // Renamed `isHistoryModalOpen`
  const [pastReports, setPastReports] = useState<SavedReport[]>([]); // Renamed `savedReports`

  // Admin panel state
  const [showAdminPanel, setShowAdminPanel] = useState(false); // Renamed `isAdminModalOpen`

  // Effect to keep an eye on who's logged in using Firebase's auth state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(async (userAccount) => { // Renamed `unsubscribe` to `unsubAuth`, `user` to `userAccount`
      setLoggedInUser(userAccount);
      if (userAccount) {
        setPastReports(await getHistoryForUser(userAccount.id));
      } else {
        setPastReports([]); // No user, no history to show
      }
    });
    return () => unsubAuth(); // Cleanup function to stop listening on component unmount
  }, []); // Runs just once, like a good setup routine

  // Effect to switch the HTML document's 'dark' class based on theme state
  useEffect(() => {
    const docRoot = window.document.documentElement; // Getting the root HTML element
    docRoot.classList.toggle('dark', appTheme === 'dark'); // Add 'dark' class if theme is dark
    localStorage.setItem('theme', appTheme); // Persist theme choice
  }, [appTheme]); // Triggered when `appTheme` changes
  
  // Effect to check for shared report links in the URL hash
  useEffect(() => {
    const urlHash = window.location.hash; // Grab the hash part of the URL
    if (urlHash.startsWith('#report=')) {
      try {
        const encodedData = urlHash.substring(8);
        // This is a common pattern for URL-safe base64. Leave as is.
        const decodedJsonString = decodeURIComponent(escape(atob(encodedData))); 
        const sharedData: AnalysisResult = JSON.parse(decodedJsonString);
        if (sharedData && typeof sharedData.matchScore === 'number') {
          setAnalysisOutcome(sharedData); // Update with the shared data
        }
      } catch (e) {
        console.error("Oops! Failed to parse shared report data:", e); // Friendlier error log
        setCurrentError("That shared report link looks a bit broken."); // More colloquial error message
      } finally {
        // Clean up the URL hash so it doesn't try to load again on refresh
        window.history.replaceState(null, '', ' '); 
      }
    }
  }, []); // Run once on initial load

  // Effect to manage body scroll behavior when any modal is open
  useEffect(() => {
    // Check if *any* of our modals are currently visible
    const anyModalUp = showAuthScreen || displayHistory || showAdminPanel;
    document.body.style.overflow = anyModalUp ? 'hidden' : 'auto'; // Disable/enable scrolling
    return () => { document.body.style.overflow = 'auto'; }; // Ensure scroll is re-enabled on unmount
  }, [showAuthScreen, displayHistory, showAdminPanel]); // React to any modal's visibility change

  // Toggles the `appTheme` state
  const flipTheme = () => setAppTheme(prev => (prev === 'light' ? 'dark' : 'light')); // Renamed `toggleTheme` to `flipTheme`

  // Authentication handlers
  const openAuth = (type: 'login' | 'signup') => { // Renamed `handleOpenAuthModal` to `openAuth`
    setAuthFlowType(type);
    setShowAuthScreen(true);
  };
  const closeAuth = () => setShowAuthScreen(false); // Renamed `handleCloseAuthModal`
  const authCompleted = () => closeAuth(); // Renamed `handleAuthSuccess`
  const performLogout = async () => { // Renamed `handleLogout`
    await logout();
    setLoggedInUser(null);
  };

  // History handlers
  const openHistory = () => setDisplayHistory(true); // Renamed `handleOpenHistoryModal`
  const closeHistory = () => setDisplayHistory(false); // Renamed `handleCloseHistoryModal`

  // Admin handlers
  const openAdminPanel = () => setShowAdminPanel(true); // Renamed `handleOpenAdminModal`
  const closeAdminPanel = () => setShowAdminPanel(false); // Renamed `handleCloseAdminModal`

  // Saves the current analysis report if a user is logged in
  const persistReport = async () => { // Renamed `handleSaveReport` to `persistReport`
    if (loggedInUser && analysisOutcome) {
      await saveReport(loggedInUser.id, analysisOutcome);
      setPastReports(await getHistoryForUser(loggedInUser.id)); // Refresh history
    }
  };

  // Deletes a report from the user's history
  const discardReport = async (reportId: string) => { // Renamed `handleDeleteReport` to `discardReport`
    if (loggedInUser) {
      await deleteReport(reportId);
      setPastReports(await getHistoryForUser(loggedInUser.id)); // Refresh history
    }
  };

  // Loads a specific report from history into the main display
  const loadSpecificReport = (report: SavedReport) => { // Renamed `handleLoadReport` to `loadSpecificReport`
    setAnalysisOutcome(report);
    closeHistory(); // Close the history modal after loading
  };

  // Handles when a new resume file is picked
  const processResumeFile = (file: File) => { // Renamed `handleResumeFileChange` to `processResumeFile`
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64Content = dataUrl.substring(dataUrl.indexOf(',') + 1); // Extract just the base64 data
      setUploadedResumeFile({ name: file.name, mimeType: file.type, data: base64Content });
      setMyResumeText(''); // Clear any manual text if a file is uploaded
    };
    reader.onerror = () => setCurrentError('Bummer, failed to read that file.'); // More human-like error
    reader.readAsDataURL(file);
  };

  // Handles changes to the resume text input area
  const updateResumeText = (text: string) => { // Renamed `handleResumeTextChange` to `updateResumeText`
    setMyResumeText(text);
    setUploadedResumeFile(null); // Clear any uploaded file if text is manually entered
  };

  // The big kahuna: kicks off the resume analysis
  const initiateAnalysis = useCallback(async () => { // Renamed `handleAnalyze` to `initiateAnalysis`
    // Quick check to ensure we have both a resume (text or file) and a job description
    if ((!myResumeText.trim() && !uploadedResumeFile) || !jobDescriptionContent.trim()) {
      setCurrentError('Hey, you need both a resume AND a job description, please!'); // More informal error
      return;
    }
    setCurrentError(null);
    setAnalysisInProgress(true);
    setAnalysisOutcome(null);
    try {
      const resumeSource = uploadedResumeFile ? { file: uploadedResumeFile } : { text: myResumeText };
      const response = await analyzeResume(resumeSource, jobDescriptionContent); // Using `response` instead of `result`
      setAnalysisOutcome(response);
    } catch (err) {
      console.error('Uh oh, analysis error:', err); // Slightly different error log
      setCurrentError('Something went wrong during analysis. Double-check your API key and Firebase setup. Give it another shot!'); // More descriptive, human-like error
    } finally {
      setAnalysisInProgress(false); // Always stop loading, even on error
    }
  }, [myResumeText, uploadedResumeFile, jobDescriptionContent]); // Dependencies remain critical for useCallback
  
  // A friendly little greeting screen
  const WelcomeScreen = () => (
    <div className="text-center p-8 bg-celeste-light-card dark:bg-celeste-deep-blue/80 border border-gray-200 dark:border-celeste-pink/20 rounded-lg">
        <h2 className="text-3xl font-bold text-celeste-light-text dark:text-white mb-4">Ready to Conquer?</h2> {/* Slightly different phrasing */}
        <p className="text-celeste-light-muted dark:text-celeste-muted mb-6">
            Drop in your resume and a job description to get a tactical analysis and chart your course to career victory!
        </p>
        <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-celeste-pink opacity-70" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-celeste-light-bg dark:bg-celeste-dark text-celeste-light-text dark:text-celeste-text font-sans">
      <div className="no-print">
        <Header 
          theme={appTheme} // Using `appTheme`
          onToggleTheme={flipTheme} // Using `flipTheme`
          onAuthClick={openAuth} // Using `openAuth`
          user={loggedInUser} // Using `loggedInUser`
          onLogout={performLogout} // Using `performLogout`
          onHistoryClick={openHistory} // Using `openHistory`
          onAdminClick={openAdminPanel} // Using `openAdminPanel`
        />
      </div>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="no-print">
            <InputSection
              resume={myResumeText} // Using `myResumeText`
              jobDescription={jobDescriptionContent} // Using `jobDescriptionContent`
              onResumeChange={updateResumeText} // Using `updateResumeText`
              onJobDescriptionChange={setJobDescriptionContent}
              onResumeFileChange={processResumeFile} // Using `processResumeFile`
              resumeFileName={uploadedResumeFile?.name || null} // Using `uploadedResumeFile`
              onSubmit={initiateAnalysis} // Using `initiateAnalysis`
              isLoading={analysisInProgress} // Using `analysisInProgress`
            />
          </div>
          <div className="lg:sticky top-24">
            <div className="no-print">
              {currentError && ( // Using `currentError`
                <div className="bg-pink-100 dark:bg-pink-900/50 border border-pink-400 dark:border-celeste-pink text-pink-700 dark:text-pink-200 px-4 py-3 rounded-lg mb-4" role="alert">
                  <strong className="font-bold">Heads up! </strong> {/* Slightly different strong text */}
                  <span className="block sm:inline">{currentError}</span>
                </div>
              )}
              {analysisInProgress && ( // Using `analysisInProgress`
                 <div className="flex flex-col items-center justify-center p-8 bg-celeste-light-card dark:bg-celeste-deep-blue/80 border border-gray-200 dark:border-celeste-pink/20 rounded-lg">
                   <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-celeste-pink mb-4"></div>
                   <p className="text-celeste-light-text dark:text-white text-lg">Deep dive in progress...</p> {/* More casual loading text */}
                   <p className="text-celeste-light-muted dark:text-celeste-muted text-sm">Our AI minions are busy crunching numbers.</p> {/* Humorous loading text */}
                 </div>
              )}
              {!analysisInProgress && !analysisOutcome && <WelcomeScreen />} {/* Using `analysisInProgress` and `analysisOutcome` */}
            </div>
            {analysisOutcome && !analysisInProgress && ( // Using `analysisOutcome` and `analysisInProgress`
              <ResultsDashboard 
                result={analysisOutcome} // Using `analysisOutcome`
                currentUser={loggedInUser} // Using `loggedInUser`
                onSaveReport={persistReport} // Using `persistReport`
              />
            )}
          </div>
        </div>
      </main>
      <div className="no-print">
        <Footer />
      </div>
       <AuthModal 
        isOpen={showAuthScreen} // Using `showAuthScreen`
        onClose={closeAuth} // Using `closeAuth`
        initialType={authFlowType} // Using `authFlowType`
        onAuthSuccess={authCompleted} // Using `authCompleted`
      />
      <HistoryModal
        isOpen={displayHistory} // Using `displayHistory`
        onClose={closeHistory} // Using `closeHistory`
        reports={pastReports} // Using `pastReports`
        onLoadReport={loadSpecificReport} // Using `loadSpecificReport`
        onDeleteReport={discardReport} // Using `discardReport`
      />
      <AdminModal
        isOpen={showAdminPanel} // Using `showAdminPanel`
        onClose={closeAdminPanel} // Using `closeAdminPanel`
      />
    </div>
  );
};

export default App;
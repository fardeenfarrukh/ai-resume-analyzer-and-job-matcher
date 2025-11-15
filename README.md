# AI Resume Analyzer & Job Matcher

A sophisticated web application designed to help job seekers optimize their resumes for specific job descriptions. This tool leverages the power of Google's Gemini AI to provide a detailed analysis, a match score, and actionable suggestions for improvement, transforming a generic resume into a highly targeted application.

![Application Screenshot](https://storage.googleapis.com/aistudio-project-images/6113b28f-9a99-45d6-a249-14a51e6b01b6.png)
*(**Note:** You can replace the link above with a new screenshot of your running application.)*

---

## ✨ Key Features

*   **AI-Powered Analysis**: Utilizes the Google Gemini API (`gemini-2.5-flash`) to perform a deep semantic analysis of a resume against a job description.
*   **Comprehensive Feedback**: Generates a **Match Score (0-100%)**, a concise summary, and a detailed breakdown of **Matching & Missing Keywords**.
*   **Actionable Suggestions**: Provides concrete, expert-level suggestions to improve phrasing, add missing skills, and better align the resume with the job requirements.
*   **Improved Resume Generation**: Automatically generates a completely rewritten, improved version of the resume that incorporates all the AI's suggestions.
*   **Flexible Input**: Supports resume submission via file upload (PDF, DOCX, TXT) or by directly pasting text.
*   **User Authentication**: Full user system with email/password signup and login, built on Firebase Authentication.
*   **Persistent Match History**: Registered users can save their analysis reports to a personal dashboard to track their progress over time.
*   **Shareable Reports**: Generate a unique, shareable link for any analysis report to get feedback from mentors or peers.
*   **Export to PDF**: Easily print or save a clean, formatted analysis report for offline use.
*   **Administrator Panel**: A secure admin view to manage all registered users in the application.
*   **Modern UI/UX**: Features a sleek, responsive design with a beautiful dark/light mode toggle.

---

## 🚀 Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS
*   **AI Model**: Google Gemini API (`gemini-2.5-flash`)
*   **Backend & Database**: Firebase (Authentication & Firestore)
*   **Local Development**: Node.js, npm

---

## 🛠️ Local Setup & Installation

Follow these instructions to get the project running on your local machine.

### Prerequisites

You must have [Node.js](https://nodejs.org/) (which includes npm) installed on your system. The LTS version is recommended.

### 1. Clone the Repository

First, clone this project to your local machine:
```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 2. Install Dependencies

Install all the necessary project libraries using npm:
```bash
npm install
```

### 3. Firebase Setup (Crucial Step)

This project uses Firebase for its backend (authentication and database). You must create your own free Firebase project to run it.

**a. Create a Firebase Project:**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Click **"Add project"** and follow the on-screen instructions.

**b. Register a Web App:**
   - In your new project's dashboard, click the web icon (`</>`) to add a web app.
   - Give it a nickname (e.g., "Resume Analyzer Web") and register the app.
   - Firebase will provide a `firebaseConfig` object. **Copy this entire object.**

**c. Update the Firebase Configuration:**
   - In the project code, open the file `services/authService.ts`.
   - Find the placeholder `firebaseConfig` object at the top of the file.
   - **Replace the entire placeholder object** with the one you copied from your Firebase project.

**d. Enable Authentication:**
   - In the Firebase Console, go to the **Authentication** section.
   - Click "Get started", select **"Email/Password"** from the list of providers, and **enable** it.

**e. Create Firestore Database:**
   - In the Firebase Console, go to the **Firestore Database** section.
   - Click "Create database" and choose to **start in test mode** for development.

### 4. Set Up Environment Variables

Your secret Google Gemini API key must be stored in an environment file.

**a. Create the `.env.local` file:**
   - In the root directory of the project, create a new file and name it exactly `.env.local`.

**b. Add Your API Key:**
   - Inside `.env.local`, add the following line, replacing `YOUR_API_KEY_HERE` with your actual Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   ```
   VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```

### 5. Run the Application

You are now ready to start the local development server.
```bash
npm run dev
```
The terminal will provide you with a local URL (usually `http://localhost:5173`). Open this link in your web browser to use the application.

---

## Usage

1.  **Sign Up/Log In**: Create an account to save and view your analysis history.
2.  **Input Data**: Upload or paste your resume and the target job description into the input fields.
3.  **Analyze**: Click the "Analyze Now" button to submit your documents to the AI.
4.  **Review Results**: View your match score, keyword analysis, and suggestions on the dashboard.
5.  **View & Toggle**: Switch between the analysis report, your original resume, and the AI-improved version.
6.  **Save & Share**: Save the report to your history, share it with a unique link, or export it as a PDF.

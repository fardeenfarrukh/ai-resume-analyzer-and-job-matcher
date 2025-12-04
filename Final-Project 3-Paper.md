# Final Project Report: AI Resume Analyzer & Job Matcher

**Syed Fardeen**  
**McMaster University**

---

## 1. Introduction

### 1.1 Project Overview
In today’s job market, tailoring a resume for each application is something almost everyone struggles with. It takes time, effort, and often feels like guesswork. The **AI Resume Analyzer & Job Matcher** is a web-based platform built to make this process easier. Users can upload or paste their resume along with a job description, and the system gives back a match score, highlights overlaps and gaps, and suggests improvements. It even generates a rewritten version of the resume that better fits the job. The goal is simple: help job seekers present themselves in the best way possible.

### 1.2 Problem Statement
This project was assigned by the university, but I quickly realized how useful it could be in real life. I’ve often thought about how hard it is to figure out what recruiters or ATS systems are looking for. Even strong candidates can get overlooked if their resume doesn’t match the right keywords. Having a tool that can analyze and edit a resume against a job description is something I would personally use whenever I apply for jobs. That made the project more engaging because I wasn’t just building something for marks—I was building something I could see myself using.

### 1.3 Goals and Objectives
The main goal was to build a complete and functional platform based on the scope document. The objectives included:

- A web interface for resume and job description input  
- Integration of Google Gemini for NLP-based analysis  
- A dashboard showing match score, keyword analysis, and suggestions  
- User authentication with saved reports  
- A responsive, secure, and user-friendly design  

On top of that, I wanted to use this project to get more comfortable with modern tools like React, Vite, Firebase, and Gemini. Each part of the build was a chance to learn something new.

---

## 2. Design and Architecture

### 2.1 UI/UX Design
I designed the interface with simplicity and usability in mind. I’ve always liked dark mode, so I made it a default option here too. It’s not just about looks—it makes long usage easier on the eyes.

- **Layout:** A two-column layout, with inputs on the left and results on the right. This way, users can see their resume and the analysis side by side.  
- **Components:** Built in React with modular components like `Header`, `InputSection`, `ResultsDashboard`, and modals for authentication, history, and admin. This keeps the code organized and reusable.  
- **Feedback:** The app gives clear feedback—loading spinners, success messages like “Report Saved,” and error notifications. These small details make the app feel polished.  

### 2.2 System Architecture
The app uses a client-server model with cloud services:

- **Frontend:** React + TypeScript with Vite and Tailwind CSS. This stack made development fast and flexible.  
- **Backend:** Firebase Authentication and Firestore for user accounts and saved reports. I had used Firebase before, so this was a chance to refine my setup.  
- **AI Service:** Google Gemini (`gemini-2.5-flash`) for resume analysis. This was my first time working with Gemini, and it was surprisingly smooth once I figured out the prompts and JSON outputs.  

---

## 3. Implementation

### 3.1 AI Analysis Core
The Gemini API was the heart of the project. I used prompt engineering to make sure the AI acted like an “expert career coach.” It was instructed to extract text, compare resumes, generate analysis, and rewrite resumes. I also forced the output into JSON format so it was easy to parse and display.

### 3.2 Technical Challenges and Growth
One of the biggest challenges was switching from **JavaScript to TypeScript**. At first, I struggled to understand why TypeScript was necessary since it felt so similar to JavaScript. But once I got used to the stricter typing, I realized it made the code more reliable.  

Firebase integration was another hurdle. I had only used it once before in Project 2, and it took time to get authentication and Firestore working properly. Deployment was also new to me—I had never deployed a project before these assignments. I ended up referencing my earlier Firebase setup a lot, and eventually got it working. These challenges taught me patience and showed me how to adapt when facing unfamiliar tools.

### 3.3 State Management and UI
React hooks (`useState`, `useEffect`, `useCallback`) handled state for inputs, loading, errors, and user sessions. Managing asynchronous operations like Gemini API calls and Firestore queries was tricky, but I made sure to include loading states and error messages so the user experience stayed smooth.  

---

## 4. Testing

Testing was mostly manual, but I made sure to cover all the main flows:

- **Authentication:** Signing up, logging in, logging out, and handling errors like wrong passwords.  
- **Analysis Flow:** Uploading different resumes and job descriptions to check if the AI gave relevant results.  
- **Features:** Saving reports, sharing links, exporting to PDF, and toggling between original and improved resumes.  
- **Admin Panel:** Setting a user’s `isAdmin` flag in Firestore and testing account deletion.  

### Personal Testing Experience
Since this was my first time using Gemini, I ran into issues with environment variables. The `.env` setup didn’t work at first, so I looked up tutorials and eventually settled on `.env.local`, which worked better. I also spent a lot of time testing the upload feature to make sure it accepted different file types.  

Another part I cared about was **dark mode**. I’ve added it in previous projects because I think every app should have it. Testing it here meant making sure it didn’t break anything else in the UI. Funny enough, the AI analysis itself was easier than these setup and UI details.

---

## 5. Future Work

If I had more time, I’d add:

- **Themes:** Not just dark mode, but multiple themes like I tried in Project 1.  
- **Resume Refinement:** A way to edit resumes directly in the app and instantly see updated match scores.  
- **Automatic Optimization:** A button that keeps refining the resume until it hits a 90–100% match score.  
- **Job Board Integration:** Pulling job descriptions directly from LinkedIn or Indeed.  
- **Analytics:** A dashboard showing progress over time, like how match scores improve or which keywords get added.  
- **Security:** Two-factor authentication with Firebase. I know it exists, but I haven’t learned how to set it up yet.  
- **CI/CD Pipeline:** Using GitHub Actions to automate testing and deployment.  

---

## 6. Conclusion

The AI Resume Analyzer & Job Matcher started as a scope document and ended as a working web app. It uses React, Vite, TypeScript, Firebase, and Gemini, and it meets all the requirements.  

On a personal level, I learned a lot. I got more comfortable with React and Vite, became faster at setting up Firebase, and had fun integrating Gemini for the first time. These projects showed me that I’m no longer just a “Python main”—I can build full-stack apps with modern tools.  

More importantly, I realized how exciting it is to build something I would actually use myself. This project wasn’t just coursework—it was a step toward creating real-world applications. I plan to take what I learned here and apply it to future projects, whether they’re academic tools, job-hunting apps, or even fun side projects.  

---

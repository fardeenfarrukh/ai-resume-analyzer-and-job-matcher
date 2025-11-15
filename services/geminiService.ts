
import { GoogleGenAI, Type, Part } from "@google/genai";
import type { AnalysisResult, UploadedFile } from '../types';

// Read the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    jobTitle: {
      type: Type.STRING,
      description: "The job title extracted from the job description (e.g., 'Senior Software Engineer')."
    },
    matchScore: { 
      type: Type.INTEGER, 
      description: "A match score from 0-100 representing how well the resume matches the job description." 
    },
    summary: { 
      type: Type.STRING, 
      description: "A concise, one-paragraph summary of the match, highlighting strengths and key areas for improvement." 
    },
    matchingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of important keywords and skills from the job description that are present in the resume."
    },
    missingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of crucial keywords and skills from the job description that are missing from the resume."
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A short, clear heading for the suggestion." },
          description: { type: Type.STRING, description: "A detailed explanation of what to change and why." }
        },
        required: ["title", "description"]
      },
      description: "An array of actionable suggestions to improve the resume."
    },
    originalResumeText: {
      type: Type.STRING,
      description: "The full text of the original resume provided by the user. If a file was uploaded, this is the extracted text from that file. If text was provided, this is the original text."
    },
    improvedResumeText: {
      type: Type.STRING,
      description: "The full, rewritten text of an improved version of the resume, incorporating all suggestions for better alignment with the job description."
    }
  },
  required: ["jobTitle", "matchScore", "summary", "matchingKeywords", "missingKeywords", "suggestions", "originalResumeText", "improvedResumeText"]
};

type ResumeInput = { text: string } | { file: UploadedFile };

export const analyzeResume = async (resumeInput: ResumeInput, jobDescriptionText: string): Promise<AnalysisResult> => {
  const promptText = `
    You are an expert AI-powered career coach specializing in resume optimization. Your task is to analyze the provided resume and job description. The resume is provided first, followed by the job description. The resume may be a text block or a file (like a PDF or DOCX).

    Your process should be as follows:
    1.  Extract the full text from the original resume. If the user provided a file, extract all its text content. If they provided text, use that. Return this as 'originalResumeText'.
    2.  Compare the extracted resume text against the job description to identify strengths, weaknesses, and areas for improvement.
    3.  Generate an analysis including a match score, summary, keyword analysis, and actionable suggestions.
    4.  Based on your analysis, rewrite the entire resume to be more effective and better aligned with the job description. This rewritten version should be returned as 'improvedResumeText'.
    5.  Extract the job title from the job description and return it as 'jobTitle'.

    Provide your complete output strictly in the JSON format defined by the schema.
  `;
  
  const resumePart: Part = 'file' in resumeInput
    ? { inlineData: { mimeType: resumeInput.file.mimeType, data: resumeInput.file.data } }
    : { text: resumeInput.text };

  const jobDescriptionPart: Part = { text: jobDescriptionText };
  
  const parts: Part[] = [
    { text: promptText },
    resumePart,
    jobDescriptionPart,
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonText);
    return result;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};

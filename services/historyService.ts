import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './authService'; // Import the initialized Firestore instance
import type { AnalysisResult, SavedReport } from '../types';

const REPORTS_COLLECTION = 'reports';

/**
 * Retrieves all saved reports for a specific user from Firestore.
 */
export const getHistoryForUser = async (userId: string): Promise<SavedReport[]> => {
  const reportsCol = collection(db, REPORTS_COLLECTION);
  const q = query(reportsCol, where("userId", "==", userId), orderBy("savedAt", "desc"));
  
  const querySnapshot = await getDocs(q);
  const reports: SavedReport[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    reports.push({
      id: doc.id,
      userId: data.userId,
      savedAt: (data.savedAt as Timestamp).toDate().toISOString(),
      ...data as AnalysisResult
    });
  });
  
  return reports;
};

/**
 * Saves a new analysis report for a user to Firestore.
 */
export const saveReport = async (userId: string, result: AnalysisResult): Promise<SavedReport> => {
  const reportsCol = collection(db, REPORTS_COLLECTION);
  
  const newReportData = {
    ...result,
    userId: userId,
    savedAt: Timestamp.now(),
  };

  const docRef = await addDoc(reportsCol, newReportData);
  
  return {
    ...result,
    id: docRef.id,
    userId: userId,
    savedAt: newReportData.savedAt.toDate().toISOString(),
  };
};

/**
 * Deletes a specific report for a user from Firestore.
 */
export const deleteReport = async (reportId: string): Promise<void> => {
  const reportDocRef = doc(db, REPORTS_COLLECTION, reportId);
  await deleteDoc(reportDocRef);
};

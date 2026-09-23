import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, auth } from './config';
import { handleFirestoreError, OperationType } from './errors';
import { CaseFile } from '../types';

export async function saveCaseToFirestore(userId: string, caseFile: CaseFile): Promise<void> {
  const path = `users/${userId}/caseFiles/${caseFile.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'caseFiles', caseFile.id);
    const payload = {
      id: caseFile.id,
      userId: userId,
      title: caseFile.title || 'Untitled Case',
      category: caseFile.category || 'General',
      institution: caseFile.institution || 'Evaluating Body',
      dateReceived: caseFile.dateReceived || '',
      keyDeadline: caseFile.keyDeadline || '',
      referenceNumber: caseFile.referenceNumber || '',
      status: caseFile.status || 'Draft',
      notes: caseFile.notes || '',
      rawNotice: (caseFile.rawNotice || '').slice(0, 48000), // bounded
      report: caseFile.report || null,
      activityTimeline: caseFile.activityTimeline || [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, auth.currentUser);
  }
}

export async function deleteCaseFromFirestore(userId: string, caseId: string): Promise<void> {
  const path = `users/${userId}/caseFiles/${caseId}`;
  try {
    const docRef = doc(db, 'users', userId, 'caseFiles', caseId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, auth.currentUser);
  }
}

export async function loadUserCases(userId: string): Promise<CaseFile[]> {
  const path = `users/${userId}/caseFiles`;
  try {
    const colRef = collection(db, 'users', userId, 'caseFiles');
    const snapshot = await getDocs(colRef);
    const cases: CaseFile[] = [];
    snapshot.forEach(docSnap => {
      cases.push(docSnap.data() as CaseFile);
    });
    return cases;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path, auth.currentUser);
  }
}

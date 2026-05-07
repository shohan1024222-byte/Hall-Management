import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

const collectionRef = collection(db, 'complaints');

export const complaintService = {
  async getComplaints() {
    try {
      const snapshot = await getDocs(query(collectionRef));
      const complaints = [];
      snapshot.forEach((complaintDoc) => {
        complaints.push({
          id: complaintDoc.id,
          ...complaintDoc.data()
        });
      });
      return complaints.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } catch (error) {
      throw new Error(`Failed to load complaints: ${error.message}`);
    }
  },

  async getUserComplaints(userId) {
    try {
      const q = query(collectionRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const complaints = [];
      snapshot.forEach((complaintDoc) => {
        complaints.push({
          id: complaintDoc.id,
          ...complaintDoc.data()
        });
      });
      return complaints.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } catch (error) {
      throw new Error(`Failed to load user complaints: ${error.message}`);
    }
  },

  async createComplaint(complaintData) {
    try {
      const docRef = await addDoc(collectionRef, {
        ...complaintData,
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...complaintData };
    } catch (error) {
      throw new Error(`Failed to submit complaint: ${error.message}`);
    }
  },

  async updateComplaintStatus(complaintId, status, response = '') {
    try {
      const complaintRef = doc(db, 'complaints', complaintId);
      await updateDoc(complaintRef, {
        status,
        response: response || '',
        updatedAt: new Date()
      });
      return { id: complaintId, status, response };
    } catch (error) {
      throw new Error(`Failed to update complaint: ${error.message}`);
    }
  },

  async deleteComplaint(complaintId) {
    try {
      const complaintRef = doc(db, 'complaints', complaintId);
      await deleteDoc(complaintRef);
      return { id: complaintId };
    } catch (error) {
      throw new Error(`Failed to delete complaint: ${error.message}`);
    }
  }
};

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const paymentService = {
  // Get all payments for a student
  async getStudentPayments(studentId) {
    try {
      const q = query(
        collection(db, 'payments'),
        where('studentId', '==', studentId)
      );
      const querySnapshot = await getDocs(q);
      const payments = [];
      querySnapshot.forEach((doc) => {
        payments.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return payments;
    } catch (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }
  },

  // Get payment summary for a student
  async getPaymentSummary(studentId) {
    try {
      const payments = await this.getStudentPayments(studentId);
      const totalDue = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + (p.amount || 0), 0);
      
      const totalPaid = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      return {
        totalDue,
        totalPaid,
        pendingPayments: payments.filter(p => p.status === 'pending'),
        completedPayments: payments.filter(p => p.status === 'completed'),
        allPayments: payments
      };
    } catch (error) {
      throw new Error(`Failed to fetch payment summary: ${error.message}`);
    }
  },

  // Create a new payment record (admin only)
  async createPayment(paymentData) {
    try {
      const docRef = await addDoc(collection(db, 'payments'), {
        ...paymentData,
        createdAt: new Date(),
        status: 'pending'
      });
      return {
        id: docRef.id,
        ...paymentData
      };
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  },

  // Update payment status
  async updatePaymentStatus(paymentId, status, transactionId = null) {
    try {
      const paymentRef = doc(db, 'payments', paymentId);
      const updateData = {
        status,
        updatedAt: new Date()
      };
      if (transactionId) {
        updateData.transactionId = transactionId;
      }
      await updateDoc(paymentRef, updateData);
      return { id: paymentId, ...updateData };
    } catch (error) {
      throw new Error(`Failed to update payment: ${error.message}`);
    }
  }
};

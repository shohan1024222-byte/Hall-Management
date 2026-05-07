import admin from 'firebase-admin';
import * as fs from 'fs';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync('./google-services.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample payment data for different users
const samplePayments = [
  {
    studentId: "STUDENT_UID_1", // Replace with actual student UID
    description: "Hall Fee - January 2024",
    amount: 5000,
    status: "pending",
    dueDate: new Date("2024-01-31"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    studentId: "STUDENT_UID_1",
    description: "Hall Fee - December 2023",
    amount: 5000,
    status: "completed",
    dueDate: new Date("2023-12-31"),
    paidDate: new Date("2023-12-25"),
    transactionId: "TXN123456",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    studentId: "ADMIN_UID_HERE", // Replace with actual admin UID
    description: "Admin Account Balance",
    amount: 50000,
    status: "completed",
    dueDate: new Date("2024-01-31"),
    paidDate: new Date("2023-12-20"),
    transactionId: "ADM001",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    studentId: "ADMIN_UID_HERE",
    description: "Maintenance Fee - January 2024",
    amount: 2000,
    status: "pending",
    dueDate: new Date("2024-01-15"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Function to add payment data
async function addPaymentData() {
  try {
    console.log('Starting to add payment data...');
    
    for (let i = 0; i < samplePayments.length; i++) {
      const payment = samplePayments[i];
      
      // Skip if UID is placeholder
      if (payment.studentId.includes("UID_HERE")) {
        console.log(`⚠️  Skipping payment ${i + 1}: UID not set. Replace placeholder with actual UID.`);
        continue;
      }

      await db.collection('payments').add(payment);
      console.log(`✅ Payment ${i + 1} added successfully`);
    }
    
    console.log('\n✅ All payments added!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding payments:', error);
    process.exit(1);
  }
}

addPaymentData();

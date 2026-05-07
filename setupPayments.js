// This script adds payment data to Firestore using the REST API
// No authentication needed for test mode Firestore

const API_KEY = "AIzaSyA4awS9_k9SiaMtLzy7Cb67DQTSQ4kIsGo";
const PROJECT_ID = "hall-managment";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Payment data
const payments = [
  {
    studentId: "B210305010",
    description: "Hall Fee - January 2024",
    amount: 5000,
    status: "pending",
    dueDate: 1704067200000,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime()
  },
  {
    studentId: "B210305010",
    description: "Hall Fee - December 2023",
    amount: 5000,
    status: "completed",
    dueDate: 1701475200000,
    paidDate: 1701561600000,
    transactionId: "TXN123456",
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime()
  },
  {
    studentId: "B210305009",
    description: "Admin Account Balance",
    amount: 50000,
    status: "completed",
    dueDate: 1704067200000,
    paidDate: 1703500800000,
    transactionId: "ADM001",
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime()
  },
  {
    studentId: "B210305009",
    description: "Maintenance Fee - January 2024",
    amount: 2000,
    status: "pending",
    dueDate: 1705276800000,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime()
  }
];

// Convert value to Firestore format
function toFirestoreValue(value) {
  if (typeof value === 'string') {
    return { stringValue: value };
  } else if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return { integerValue: value.toString() };
    } else {
      return { doubleValue: value };
    }
  } else if (typeof value === 'boolean') {
    return { booleanValue: value };
  } else if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }
  return { nullValue: null };
}

// Convert object to Firestore document
function toFirestoreDocument(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
  }
  return { fields };
}

// Add a single document
async function addDocument(collectionPath, documentData) {
  try {
    const body = toFirestoreDocument(documentData);
    
    const response = await fetch(
      `${BASE_URL}/${collectionPath}?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

// Main function
async function setupPayments() {
  try {
    console.log('🚀 Starting to add payment data to Firebase Firestore...\n');
    
    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i];
      const result = await addDocument('payments', payment);
      
      console.log(`✅ Payment ${i + 1} added successfully`);
      console.log(`   💰 Amount: ৳${payment.amount}`);
      console.log(`   📝 Description: ${payment.description}`);
      console.log(`   👤 User ID: ${payment.studentId}`);
      console.log(`   📊 Status: ${payment.status}\n`);
    }
    
    console.log('✅ ✅ ✅ All payments added successfully! ✅ ✅ ✅\n');
    console.log('📱 Now you can test the app:');
    console.log('   npm start\n');
    console.log('🔐 Login credentials:');
    console.log('   Student - Email: student@example.com, Password: test123');
    console.log('   Admin - Email: admin@example.com, Password: Admin@123\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding payments:', error);
    process.exit(1);
  }
}

setupPayments();

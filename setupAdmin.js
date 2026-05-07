const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, 'serviceAccountKey.json');
const adminEmail = process.env.ADMIN_EMAIL || 'admin@hallmanagement.local';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
const adminName = process.env.ADMIN_NAME || 'Hall Admin';

function loadServiceAccount() {
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Service account file not found at ${serviceAccountPath}. Download a Firebase service account key and save it there, or set FIREBASE_SERVICE_ACCOUNT_PATH.`
    );
  }

  return JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
}

async function ensureAdminAccount() {
  const serviceAccount = loadServiceAccount();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  const auth = admin.auth();
  const db = admin.firestore();

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(adminEmail);
    await auth.updateUser(userRecord.uid, {
      password: adminPassword,
      displayName: adminName,
      disabled: false
    });
  } catch (error) {
    if (error.code !== 'auth/user-not-found') {
      throw error;
    }

    userRecord = await auth.createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: adminName,
      disabled: false,
      emailVerified: true
    });
  }

  await db.collection('users').doc(userRecord.uid).set(
    {
      uid: userRecord.uid,
      email: adminEmail,
      name: adminName,
      role: 'Admin',
      department: 'Administration',
      batch: 'N/A',
      phone: '',
      room: 'N/A',
      studentId: userRecord.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  await auth.setCustomUserClaims(userRecord.uid, { role: 'Admin' });

  console.log('Admin account is ready.');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`UID: ${userRecord.uid}`);
}

ensureAdminAccount().catch((error) => {
  console.error('Failed to create admin account:', error.message);
  process.exit(1);
});
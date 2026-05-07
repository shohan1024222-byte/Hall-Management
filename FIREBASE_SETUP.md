# Firebase Setup Guide for Hall Management System

## Overview
This guide walks you through setting up Firebase for the Hall Management System. You'll configure:
- **Firebase Authentication** (Email/Password login)
- **Firestore Database** (Payment data storage)

## Prerequisites
- Google Account
- Access to Firebase Console

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create a project**
3. Enter project name: `Hall-Management-System`
4. Click **Continue**
5. Disable Google Analytics (optional)
6. Click **Create project**
7. Wait for project creation to complete

## Step 2: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get started**
3. In Sign-in method, click **Email/Password**
4. Toggle **Enable** to turn it on
5. Click **Save**

## Step 3: Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Select your region (closest to your location)
4. For security rules, select **Start in test mode**
   - ⚠️ Note: Test mode allows anyone with the config to read/write. For production, implement proper security rules.
5. Click **Create**

## Step 4: Get Firebase Config

1. Go to **Project Settings** (⚙️ icon)
2. Under **Your apps**, click the web icon (</>)
3. If no app exists, click **Add app** → **Web**
4. Register the app with any name (e.g., "Hall Management Web")
5. Copy the Firebase config (you'll see something like):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxx",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

## Step 5: Update Firebase Config in App

1. Open `src/services/firebaseConfig.js`
2. Replace the placeholder config with your actual Firebase config from Step 4:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};
```

3. Save the file

## Step 6: Create Sample Student Account (for testing)

1. In Firebase Console, go to **Build** → **Authentication** → **Users**
2. Click **Add user**
3. Enter email: `student@example.com`
4. Enter password: `test123` (or any password ≥ 6 characters)
5. Click **Add user**

Repeat this process to create more test accounts.

## Step 7: Create Firestore Collection & Sample Data

### Create "payments" Collection

1. In Firestore Database, click **Create collection**
2. Collection name: `payments`
3. Click **Next**
4. Click **Auto ID** to auto-generate document ID
5. Add the following fields:

```json
{
  "studentId": "STUDENT_UID_FROM_FIREBASE_AUTH",
  "description": "Hall Fee - January 2024",
  "amount": 5000,
  "status": "pending",
  "dueDate": 1704067200000,
  "paidDate": null,
  "transactionId": null,
  "createdAt": 1703500800000,
  "updatedAt": 1703500800000
}
```

6. Click **Save**

### To find Student UID:

1. Go to **Authentication** → **Users**
2. Click on a user email
3. Copy the **User UID**
4. Use this UID in the `studentId` field

### Create more sample payments:

Repeat the collection creation process to add more payment records with different statuses:

Example 2 (Completed payment):
```json
{
  "studentId": "STUDENT_UID",
  "description": "Hall Fee - December 2023",
  "amount": 5000,
  "status": "completed",
  "dueDate": 1701475200000,
  "paidDate": 1701561600000,
  "transactionId": "TXN123456",
  "createdAt": 1701129600000,
  "updatedAt": 1701561600000
}
```

## Step 8: Update Firestore Security Rules (Production)

⚠️ **Important**: Test mode allows anyone to read/write. For production, implement proper rules.

Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read their own payments
    match /payments/{document=**} {
      allow read: if request.auth != null && 
                     request.resource.data.studentId == request.auth.uid;
      allow write: if false; // Only admin can write via backend
    }
  }
}
```

## Step 9: Test the App

1. Run the app: `npm start`
2. On login screen, enter:
   - Email: `student@example.com`
   - Password: `test123`
3. Click **Login**
4. On dashboard, click **Payment Status**
5. You should see the payment records you created in Firestore

## Troubleshooting

### "No permission to access" error
- Check your Firestore security rules
- Verify the student UID matches in the payment record
- Make sure you're logged in with the correct account

### No payments showing
- Verify payment records exist in Firestore
- Check that `studentId` matches the logged-in user's UID
- Ensure `status` field is either "pending" or "completed"

### Login fails with "User not found"
- Create test account in Authentication
- Double-check email and password
- Ensure Email/Password auth method is enabled

### "Firebase is not initialized"
- Verify `firebaseConfig.js` has correct credentials
- Check that all required config fields are filled
- Restart the development server

## Firebase Console Shortcuts

- **Authentication**: `console.firebase.google.com` → Project → Authentication
- **Firestore**: `console.firebase.google.com` → Project → Firestore Database
- **Settings**: Click ⚙️ icon → Project Settings

## Need Help?

- Firebase Docs: https://firebase.google.com/docs
- Firestore Guide: https://firebase.google.com/docs/firestore
- React Native Firebase: https://rnfirebase.io/

## Next Steps

1. Create more test user accounts
2. Add sample payment records to Firestore
3. Test the login and payment status viewing
4. Configure admin dashboard for payment management
5. Implement payment initiation/tracking UI

---

**Remember**: Keep your Firebase config private. Never commit API keys to public repositories!

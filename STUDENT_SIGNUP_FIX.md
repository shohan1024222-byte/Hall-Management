# Fix: Student Signup Data Not Being Added to Firestore

## Problem
When students sign up, their data is not being saved to the Firestore database.

## Root Cause
The Firestore database is in **test mode** without proper security rules, or the rules don't allow authenticated users to write their own user documents.

## Solution

### Step 1: Update Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Build** → **Firestore Database**
3. Click on the **Rules** tab
4. Replace the existing rules with the content from `firestore.rules` file in this project
5. Click **Publish**

The rules allow:
- ✅ Authenticated users to read/write their own user document
- ✅ Authenticated users to read/write payments, notices, complaints
- ❌ Unauthenticated access (blocked)

### Step 2: Verify Firebase Configuration

1. Check `src/services/firebaseConfig.js`
2. Ensure all Firebase config values match your Firebase project:
   - `projectId`: "hall-managment"
   - `authDomain`: "hall-managment.firebaseapp.com"
   - `apiKey`: Verify it's correct

### Step 3: Create Firestore Collections (if not existing)

In Firebase Console → Firestore Database, manually create these collections:
- `users` (will store student profile data)
- `payments`
- `notices`
- `complaints`

Or let them be created automatically when first data is written.

### Step 4: Test Registration

1. Run the app: `npm start` or `expo start`
2. Go to Register screen
3. Fill in: Name, Department, Batch, Phone, Email, Password
4. Click "Create Account"
5. Check Firebase Console → Firestore → `users` collection
6. You should see a new document with the student's UID containing all signup data

### Troubleshooting

**Issue: "Permission denied" error**
- Solution: Check Firestore Rules are published correctly

**Issue: Data not appearing in Firestore**
- Check browser console/terminal for error logs
- Look for messages like: "User registered in Firebase Auth: [UID]"
- Verify the `users` collection exists in Firestore

**Issue: Can't see user data in Firebase Console**
- Make sure you're looking in the correct database (default)
- User documents are stored at: `Firestore → users → [studentUID]`

## What Gets Saved on Signup

```json
{
  "uid": "user-id-from-firebase-auth",
  "email": "student@example.com",
  "name": "Student Name",
  "department": "CSE",
  "batch": "2021-22",
  "phone": "01700000000",
  "role": "Student",
  "room": "N/A",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## Implementation Changes

Enhanced error logging in:
- `src/services/authService.js` - Logs Firebase Auth registration
- `src/context/UserContext.js` - Logs Firestore profile save

These logs will help identify any issues during signup process.

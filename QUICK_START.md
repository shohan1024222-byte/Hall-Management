# Quick Start Guide - Firebase Integration

## 🚀 In 5 Steps

### Step 1: Get Firebase Config (5 mins)
1. Go to https://console.firebase.google.com/
2. Create new project: `Hall-Management-System`
3. Enable: Authentication (Email/Password) + Firestore Database
4. Get config from Project Settings → Web App

### Step 2: Update Config (2 mins)
Edit `src/services/firebaseConfig.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Create Test Account (2 mins)
1. Firebase Console → Authentication → Add User
2. Email: `student@example.com`
3. Password: `test123`

### Step 4: Add Sample Payment (3 mins)
1. Firebase Console → Firestore Database
2. Create `payments` collection
3. Add document with:
```json
{
  "studentId": "PASTE_USER_UID_HERE",
  "description": "Hall Fee January",
  "amount": 5000,
  "status": "pending",
  "dueDate": 1704067200000,
  "createdAt": 1703500800000
}
```

### Step 5: Run App (1 min)
```bash
npm start
```
- Login: `student@example.com` / `test123`
- Click "Payment Status" to see payment

---

## 📱 App Flows

### Student Journey
1. **Register** → Enter email, password, name, room
2. **Login** → View dashboard
3. **Click Payment Status** → See dues and payment history
4. **Logout** → Back to login screen

### Payment Status Screen
- **Top Cards**: Total due & paid amounts
- **Pending Section**: Payments not yet made
- **History Section**: Completed payments
- **Refresh**: Pull down to refresh data

---

## ✅ Features Ready

| Feature | Status | Location |
|---------|--------|----------|
| Register Account | ✅ Ready | RegisterScreen |
| Login (Email/Pass) | ✅ Ready | LoginScreen |
| View Payments | ✅ Ready | PaymentStatusScreen |
| Logout | ✅ Ready | Dashboard |

---

## 🔧 File Changes

### New Files Created
- `src/services/firebaseConfig.js` - Firebase init
- `src/services/authService.js` - Auth methods  
- `src/services/paymentService.js` - Payment queries
- `src/screens/RegisterScreen.js` - Registration UI
- `src/screens/PaymentStatusScreen.js` - Payment display

### Modified Files
- `src/context/UserContext.js` - Firebase auth instead of mock
- `src/screens/LoginScreen.js` - Email/password form
- `src/navigation/AppNavigator.js` - Added new routes
- `src/screens/StudentDashboardScreen.js` - Payment card linked

---

## 📚 Full Guides

- **Detailed Firebase Setup**: See `FIREBASE_SETUP.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "Config not valid" | Check all Firebase config fields filled |
| "No permission" | Use test mode in Firestore security rules |
| "No payments show" | Verify studentId matches logged-in user UID |
| "Login fails" | Ensure test account created in Authentication |

---

**Time to setup**: ~20 minutes
**Difficulty**: Easy ⭐⭐☆☆☆

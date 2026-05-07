# Ready-to-Use Payment Data for Firebase

## ⚠️ Important: Replace UIDs First!

Before adding any data, get these UIDs from Firebase Authentication → Users:
- Student UID: (Your student account UID)
- Admin UID: (Your admin account UID)

---

## 📋 How to Add (Manual Method)

1. Go to: https://console.firebase.google.com/project/hall-managment/firestore/databases/-default-/data/~2Fpayment
2. Click "+ Add document"
3. Copy-paste the JSON below (replace UIDs first)
4. Click "Save"

---

## 💰 Payment Records to Add

### Payment 1: Student - Pending Hall Fee
Replace `YOUR_STUDENT_UID` with actual UID:

```json
{
  "studentId": "YOUR_STUDENT_UID",
  "description": "Hall Fee - January 2024",
  "amount": 5000,
  "status": "pending",
  "dueDate": 1704067200000,
  "createdAt": 1703500800000,
  "updatedAt": 1703500800000
}
```

---

### Payment 2: Student - Completed Hall Fee
Replace `YOUR_STUDENT_UID` with actual UID:

```json
{
  "studentId": "YOUR_STUDENT_UID",
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

---

### Payment 3: Admin - Completed Payment
Replace `YOUR_ADMIN_UID` with actual UID:

```json
{
  "studentId": "YOUR_ADMIN_UID",
  "description": "Admin Account Balance",
  "amount": 50000,
  "status": "completed",
  "dueDate": 1704067200000,
  "paidDate": 1703500800000,
  "transactionId": "ADM001",
  "createdAt": 1703500800000,
  "updatedAt": 1703500800000
}
```

---

### Payment 4: Admin - Pending Maintenance Fee
Replace `YOUR_ADMIN_UID` with actual UID:

```json
{
  "studentId": "YOUR_ADMIN_UID",
  "description": "Maintenance Fee - January 2024",
  "amount": 2000,
  "status": "pending",
  "dueDate": 1705276800000,
  "createdAt": 1703500800000,
  "updatedAt": 1703500800000
}
```

---

## 🚀 Faster Method: Use Script

If you want to automate this:

```bash
# Install dependencies
npm install firebase-admin

# Edit addPayments.js and replace UIDs
# Then run:
node addPayments.js
```

---

## ✅ Steps

1. Get Student UID from Firebase Authentication
2. Get Admin UID from Firebase Authentication
3. Replace placeholders in JSON above
4. Copy-paste each JSON to Firebase Console (one by one)
5. Test the app!

---

**Need help? Tell me your UIDs and I'll give you ready-to-use JSON!**

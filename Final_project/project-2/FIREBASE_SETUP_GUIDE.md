# Firebase Setup Guide - Quidditch Manager

## ⚠️ Current Error: `auth/configuration-not-found`

This error means Firebase Authentication is not properly configured in your Firebase Console.

---

## 🔧 Step-by-Step Fix

### **Step 1: Verify Your Firebase Project Exists**

1. Go to: https://console.firebase.google.com/
2. Login with your Google account
3. Look for a project named **"quidditch-manager-41f53"**
4. If it doesn't exist, you need to create it:
   - Click "Add project"
   - Name it "quidditch-manager-41f53"
   - Follow the setup wizard

---

### **Step 2: Enable Firebase Authentication**

1. Click on your project **"quidditch-manager-41f53"**
2. In the left sidebar, click **"Build"** → **"Authentication"**
3. Click **"Get started"** button (if you see it)
4. This initializes Authentication for your project

---

### **Step 3: Enable Email/Password Provider**

1. After Authentication is enabled, click the **"Sign-in method"** tab
2. You should see a list of providers (Google, Email/Password, etc.)
3. Click on **"Email/Password"** row
4. Toggle **"Enable"** switch to ON
5. Click **"Save"**

**IMPORTANT:** Make sure the status shows "Enabled" with a green checkmark ✅

---

### **Step 4: Enable Firestore Database**

1. In the left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"** button
3. Choose **"Start in test mode"** (for development)
4. Select a location (e.g., "us-central" or closest to you)
5. Click **"Enable"**

---

### **Step 5: Verify Your Configuration**

1. In Firebase Console, click the **gear icon** ⚙️ (Project Settings)
2. Scroll down to **"Your apps"** section
3. You should see a web app registered
4. If not, click **"Add app"** → Select Web icon **</>**
5. Register app with a nickname (e.g., "Quidditch Manager Web")
6. Copy the Firebase config object

**Compare these values with your code:**
- `apiKey: 'AIzaSyB-x6HJVUnuK7l0VIfQhwIVos2IGSUyoRo'`
- `authDomain: 'quidditch-manager-41f53.firebaseapp.com'`
- `projectId: 'quidditch-manager-41f53'`

If they don't match, update `src/lib/firebase.ts` with the correct values.

---

## 🔍 Troubleshooting Checklist

Run through this checklist in Firebase Console:

### Authentication Setup
- [ ] Go to **Authentication** section
- [ ] See "Get started" button? Click it.
- [ ] Go to **"Sign-in method"** tab
- [ ] **Email/Password** shows "Enabled" with green checkmark
- [ ] If disabled, click on it and toggle "Enable"

### Firestore Setup
- [ ] Go to **Firestore Database** section
- [ ] Database exists (not showing "Create database" button)
- [ ] If no database, create one in "test mode"

### Project Configuration
- [ ] Go to **Project Settings** (gear icon)
- [ ] Scroll to **"Your apps"**
- [ ] Web app is registered
- [ ] Config values match your code

---

## 🧪 Test After Setup

After completing all steps:

1. **Clear browser cache** (important!)
   - Chrome: `Cmd + Shift + Delete` (Mac) or `Ctrl + Shift + Delete` (Windows)
   - Select "Cached images and files"
   - Click "Clear data"

2. **Restart dev server:**
   ```bash
   # Kill current server (in terminal)
   Ctrl + C

   # Start fresh
   npm run dev
   ```

3. **Test signup:**
   - Go to `http://localhost:5177/ministry-enlistment`
   - Fill in:
     - Name: Priyansh Thakkar
     - Email: priyanshthakkar29@gmail.com
     - Password: (min 6 characters, e.g., "Alohomora123")
     - Confirm Password: (same as above)
   - Click "Enlist Now"

4. **Expected behavior:**
   - ✅ No error message
   - ✅ Redirects to dashboard (`/quidditch-command`)
   - ✅ You're logged in as "Priyansh Thakkar"

---

## 🐛 Common Issues

### Issue 1: "auth/configuration-not-found"
**Cause:** Authentication is not enabled
**Fix:** Follow Steps 2-3 above

### Issue 2: "auth/api-key-not-valid"
**Cause:** Wrong API key in code
**Fix:** Get correct config from Firebase Console Project Settings

### Issue 3: "Firestore error: Missing or insufficient permissions"
**Cause:** Firestore rules are too restrictive
**Fix:**
1. Go to Firestore Database → Rules tab
2. Use these test rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click "Publish"

### Issue 4: Still getting errors after following all steps
**Fix:**
1. Open browser console (F12 or Right-click → Inspect)
2. Go to Console tab
3. Look for detailed error messages
4. Copy the full error and share it

---

## 📸 Screenshots to Verify

Take screenshots of these to verify setup:

1. **Authentication Dashboard**
   - Should show "Email/Password" as "Enabled"

2. **Firestore Database**
   - Should show database with collections (teams, players, matches, wizards)

3. **Project Settings**
   - Should show your web app registered with config values

---

## 🆘 Still Not Working?

If you've completed all steps and still see errors:

1. Check browser console for detailed errors
2. Verify your Google account has owner/editor permissions on the Firebase project
3. Try creating a completely new Firebase project with a different name
4. Make sure you're not behind a firewall blocking Firebase domains

---

## ✅ Success Indicators

You'll know it's working when:
- No "auth/configuration-not-found" error
- Signup successfully creates user
- You can see the new user in Firebase Console → Authentication → Users tab
- You can see wizard profile in Firestore Database → wizards collection
- After signup, you're redirected to dashboard
- Navigation shows your name and Hogwarts house

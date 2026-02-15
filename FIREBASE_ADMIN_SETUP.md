# Firebase Admin Setup Guide

## Setup Instructions

### 1. Enable Email/Password Authentication in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **yameensportfolio**
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. Click **Save**

### 2. Create Admin User

1. In Firebase Console, go to **Authentication** → **Users**
2. Click **Add User**
3. Enter your admin email and password
4. Click **Add User**

### 3. Access the Admin Panel

- Navigate to `/admin` on your website
- Sign in with the email and password you created
- You can now manage:
  - **Projects**: Toggle project visibility from your GitHub repos
  - **Blogs**: Create, edit, and publish blog posts

## Security Notes

- Your Firebase API key is safe to expose in client-side code (it's used to identify your Firebase project)
- Actual security is handled by Firebase Authentication and Security Rules
- Only authenticated users can access the admin panel features

## Firebase Configuration

The Firebase configuration is located in `lib/firebase.ts` and includes:
- App initialization
- Authentication setup

## Features

### Projects Management
- View all GitHub repositories
- Toggle visibility of projects on your portfolio
- Changes are saved to local storage

### Blog Management
- Create new blog posts
- Edit existing posts
- Toggle publish/draft status
- Delete posts
- All blog data is stored in local storage

## Default Credentials

**Important**: For security, make sure to create your own admin user in Firebase Console as described above.

## Troubleshooting

If you can't sign in:
1. Verify Email/Password authentication is enabled in Firebase
2. Ensure you've created a user in Firebase Console
3. Check the browser console for error messages
4. Verify your Firebase configuration in `lib/firebase.ts`

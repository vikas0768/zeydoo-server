# Zeydoo Postback Server

This is a simple Express.js server that listens for Zeydoo postback requests and updates user coins in Firebase.

## Setup

1. Clone this repo
2. Run `npm install`
3. Add environment variables in Render:
   - `FIREBASE_SERVICE_ACCOUNT` → full Firebase admin JSON (stringified)
   - `FIREBASE_DB_URL` → `https://your-app-id.firebaseio.com`
4. Deploy to Render
5. Set Zeydoo Postback URL to:

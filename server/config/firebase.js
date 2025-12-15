const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  console.error("ERROR: FIREBASE_SERVICE_ACCOUNT_PATH is missing in .env");
  process.exit(1);
}

try {
  // Load the service account key file
  const serviceAccount = require(`../${serviceAccountPath}`);

  initializeApp({
    credential: cert(serviceAccount),
  });
  console.log("Firebase Admin SDK Initialized.");
} catch (error) {
  console.error("ERROR: Could not initialize Firebase Admin SDK.", error);
  process.exit(1);
}

const db = getFirestore();

module.exports = { db };

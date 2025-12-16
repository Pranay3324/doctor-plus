const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path"); // Import path module
require("dotenv").config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  console.error("ERROR: FIREBASE_SERVICE_ACCOUNT_PATH is missing in .env");
  process.exit(1);
}

try {
  let serviceAccount;

  // FIX: Check if the path is absolute (like on Render: /etc/secrets/...)
  if (path.isAbsolute(serviceAccountPath)) {
    // Render: Use the absolute path directly
    serviceAccount = require(serviceAccountPath);
  } else {
    // Local: Use relative path (assuming it's in the parent directory)
    // path.resolve(__dirname, '..', ...) is safer than `../${path}`
    serviceAccount = require(path.resolve(__dirname, '..', serviceAccountPath));
  }

  initializeApp({
    credential: cert(serviceAccount),
  });
  console.log("Firebase Admin SDK Initialized.");
} catch (error) {
  console.error("ERROR: Could not initialize Firebase Admin SDK.", error);
  console.error("Path attempted:", serviceAccountPath);
  process.exit(1);
}

const db = getFirestore();

module.exports = { db };
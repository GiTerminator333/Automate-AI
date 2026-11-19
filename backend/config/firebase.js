import { cert, initializeApp, getApps } from "firebase-admin/app";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getServiceAccount() {
  // 1. Check FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_KEY env var
  const envKey =
    process.env.FIREBASE_SERVICE_ACCOUNT ||
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (envKey) {
    // If it points to a file path
    if (fs.existsSync(envKey)) {
      try {
        return JSON.parse(fs.readFileSync(envKey, "utf-8"));
      } catch (err) {
        console.error("Failed to parse Firebase key from path:", envKey, err.message);
      }
    }

    // Try parsing as raw JSON string
    try {
      return JSON.parse(envKey);
    } catch {
      // Try base64 decoding
      try {
        const decoded = Buffer.from(envKey, "base64").toString("utf-8");
        return JSON.parse(decoded);
      } catch (err) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", err.message);
      }
    }
  }

  // 2. Check individual env variables
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  // 3. Check GOOGLE_APPLICATION_CREDENTIALS or Render Secret Files path
  const filePaths = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    "/etc/secrets/serviceAccountKey.json",
    path.resolve(__dirname, "../serviceAccountKey.json"),
  ].filter(Boolean);

  for (const filePath of filePaths) {
    if (fs.existsSync(filePath)) {
      try {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (err) {
        console.error("Failed to parse Firebase key from:", filePath, err.message);
      }
    }
  }

  return null;
}

const serviceAccount = getServiceAccount();

if (!serviceAccount) {
  console.warn(
    "⚠️ Firebase service account credentials not found. Configure FIREBASE_SERVICE_ACCOUNT in your environment."
  );
}

const appOptions = {};

if (serviceAccount) {
  appOptions.credential = cert(serviceAccount);
}

const resolvedProjectId =
  serviceAccount?.project_id ||
  serviceAccount?.projectId ||
  process.env.FIREBASE_PROJECT_ID;

if (resolvedProjectId) {
  appOptions.projectId = resolvedProjectId;
}

export const app = getApps().length
  ? getApps()[0]
  : initializeApp(Object.keys(appOptions).length ? appOptions : undefined);

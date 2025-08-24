import express from "express";
import { requireAuth } from "@clerk/express";
import admin from "firebase-admin";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require("./services/serviceAccount.json");

const router = express.Router();

router.post("/api/firebase-login", requireAuth(), async (req, res) => {
  try {
    // ClerkExpressWithAuth attaches auth info to req.auth
    const { userId } = req.auth();
    if (!userId) {
      console.error("Clerk userId missing after middleware");
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        // credential: admin.credential.applicationDefault(),
        // Or use cert() if you have a service account JSON:
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized.");
    } else {
      console.log("Firebase Admin SDK already initialized.");
    }

    // Use Clerk user ID as Firebase UID
    const firebaseUid = `clerk:${userId}`;

    // Mint Firebase custom token
    const firebaseToken = await admin.auth().createCustomToken(firebaseUid);

    res.json({ firebaseToken });
  } catch (err) {
    console.error("Firebase login error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
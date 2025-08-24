const express = require("express");
const admin = require("firebase-admin");
const app = express();

// 🔑 Firebase Service Account (from Render env var)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// 🔥 Firebase Init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

const db = admin.firestore();

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Zeydoo Postback Server is running...");
});

// ✅ Postback route (Zeydoo calls this after offer complete)
app.get("/postback", async (req, res) => {
  try {
    const clickId = req.query.click_id; // user id (passed in smartlink var)
    const payout = parseFloat(req.query.payout || "0"); // payout from Zeydoo

    if (!clickId) return res.status(400).send("❌ Missing click_id");

    // 👉 Firebase user = clickId (map your app’s UID here)
    const userRef = db.collection("users").doc(clickId);

    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef);
      if (!doc.exists) throw "User not found in Firebase";

      const currentCoins = doc.data().coins || 0;
      const newCoins = currentCoins + Math.round(payout * 100); // 1$ = 100 coins

      t.update(userRef, { coins: newCoins });
    });

    res.send("✅ Coins added successfully");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("❌ Error: " + err);
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

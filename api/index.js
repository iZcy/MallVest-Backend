const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

// ✅ Allow all CORS
app.use(cors({ origin: "*" }));

// 🧠 MongoDB setup
const uri = process.env.MONGO_URI;
let db;

async function connectToDb() {
  if (!db) {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(); // Default DB
  }
  return db;
}

// ✅ POST /reports
app.post("/reports", async (req, res) => {
  try {
    const db = await connectToDb();
    const result = await db.collection("revenueReports").insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ GET /reports/:vaultAddress/:period
app.get("/reports/:vaultAddress/:period", async (req, res) => {
  try {
    const db = await connectToDb();
    const report = await db.collection("revenueReports").findOne({
      vaultAddress: req.params.vaultAddress,
      period: req.params.period
    });

    if (!report) return res.status(404).json({ error: "Not found" });
    res.json(report);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ DELETE /reports/:vaultAddress/:period
app.delete("/reports/:vaultAddress/:period", async (req, res) => {
  try {
    const db = await connectToDb();
    const result = await db.collection("revenueReports").deleteOne({
      vaultAddress: req.params.vaultAddress,
      period: req.params.period
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Export the wrapped handler
module.exports = serverless(app);

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const RevenueReport = require("../models/RevenueReport");
const cors = require("cors");

dotenv.config();

const app = express();

// ✅ Allow all CORS
app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create
app.post("/reports", async (req, res) => {
  const report = new RevenueReport(req.body);
  await report.save();
  res.json(report);
});

// Read (e.g. for oracle)
app.get("/reports/:vaultAddress/:period", async (req, res) => {
  const { vaultAddress, period } = req.params;
  const report = await RevenueReport.findOne({ vaultAddress, period });
  res.json(report);
});

// Mark as claimed
app.put("/reports/:id/claim", async (req, res) => {
  const report = await RevenueReport.findByIdAndUpdate(
    req.params.id,
    { claimed: true },
    { new: true }
  );
  res.json(report);
});

app.listen(3000, () => console.log("Server running on port 3000"));

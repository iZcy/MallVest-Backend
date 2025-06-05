const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const RevenueReport = require("../models/RevenueReport");

const app = express();
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://yitzhakedmundtiomanalu:y8TpvfIZIGBbPc7o@cluster0.ivwv9wb.mongodb.net/mallvestrevenue?connectTimeoutMS=120000&socketTimeoutMS=120000&serverSelectionTimeoutMS=120000",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

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

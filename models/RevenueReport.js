const mongoose = require("mongoose");

const RevenueReportSchema = new mongoose.Schema({
  vaultAddress: { type: String, required: true },
  period: { type: String, required: true }, // e.g., "2025-05"
  totalRevenue: { type: Number, required: true },
  submittedBy: { type: String },
  timestamp: { type: Date, default: Date.now },
  claimed: { type: Boolean, default: false }
});

module.exports = mongoose.model("RevenueReport", RevenueReportSchema);

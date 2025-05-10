import mongoose from "mongoose";
const logSchema = new mongoose.Schema({
  level: { type: String, required: true },
  message: { type: String, required: true },
  source: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
});

const Log = mongoose.model("Log", logSchema);
export default Log;

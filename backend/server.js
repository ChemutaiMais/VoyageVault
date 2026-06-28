import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import tripsRouter from "./routes/trips.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
})
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

app.use("/api/trips", tripsRouter);

app.get("/api/hello", (req, res) => {
  res.send("Voyage Vault backend is running");
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
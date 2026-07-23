import express from "express";

import mongoose from "mongoose";

import cors from "cors";

import dotenv from "dotenv";

import tripRoutes from "./routes/trips.js";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

//
// ROUTES
//
app.use(
  "/api/trips",
  tripRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

//
// DATABASE
//
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected"
    );

    app.listen(5000, () => {
      console.log(
        "Server running on port 5000"
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
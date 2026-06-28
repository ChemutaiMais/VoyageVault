import express from "express";
import Trip from "../models/Trip.js";

const router = express.Router();

//
// GET ALL TRIPS
//
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();

    res.json(trips);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//
// GET SINGLE TRIP
//
router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(
      req.params.id
    );

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.json(trip);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//
// CREATE TRIP
//
router.post("/", async (req, res) => {
  try {
    const newTrip = new Trip({
      name: req.body.name,
      destination:
        req.body.destination || "",
      startDate:
        req.body.startDate || null,
      endDate:
        req.body.endDate || null,
      expenses:
        req.body.expenses || [],
      photos: req.body.photos || [],
    });

    const savedTrip =
      await newTrip.save();

    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

//
// UPDATE TRIP
//
router.put("/:id", async (req, res) => {
  try {
    const updatedTrip =
      await Trip.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!updatedTrip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//
// DELETE TRIP
//
router.delete("/:id", async (req, res) => {
  try {
    const deletedTrip =
      await Trip.findByIdAndDelete(
        req.params.id
      );

    if (!deletedTrip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.json({
      message: "Trip deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;
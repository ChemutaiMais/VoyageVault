import express from "express";

import Trip from "../models/Trip.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//
// GET USER TRIPS
//
router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const trips =
        await Trip.find({
          user: req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.json(trips);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

//
// GET SINGLE TRIP
//
router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const trip =
        await Trip.findOne({
          _id: req.params.id,

          user: req.user.id,
        });

      if (!trip) {
        return res
          .status(404)
          .json({
            message:
              "Trip not found",
          });
      }

      res.json(trip);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

//
// CREATE TRIP
//
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const newTrip =
        new Trip({
          user: req.user.id,

          name:
            req.body.name,

          location:
            req.body.location ||
            "",

          dates:
            req.body.dates ||
            "",

          budget:
            req.body.budget ||
            0,

          currency:
            req.body.currency ||
            "KES",

          expenses:
            req.body.expenses ||
            [],

          photos:
            req.body.photos ||
            [],

          coords:
            req.body.coords ||
            [],

          image:
            req.body.image ||
            "/placeholder.svg",
        });

      const savedTrip =
        await newTrip.save();

      res.status(201).json(
        savedTrip
      );
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
);

//
// UPDATE TRIP
//
router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const updatedTrip =
        await Trip.findOneAndUpdate(
          {
            _id:
              req.params.id,

            user:
              req.user.id,
          },

          req.body,

          {
            new: true,
          }
        );

      if (!updatedTrip) {
        return res
          .status(404)
          .json({
            message:
              "Trip not found",
          });
      }

      res.json(updatedTrip);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

//
// DELETE TRIP
//
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const deletedTrip =
        await Trip.findOneAndDelete(
          {
            _id:
              req.params.id,

            user:
              req.user.id,
          }
        );

      if (!deletedTrip) {
        return res
          .status(404)
          .json({
            message:
              "Trip not found",
          });
      }

      res.json({
        message:
          "Trip deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

export default router;
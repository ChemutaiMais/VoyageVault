import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  label: String,
  amount: Number,
});

const PhotoSchema = new mongoose.Schema({
  url: String,
});

const TripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    default: "",
  },

  dates: {
    type: String,
    default: "",
  },

  budget: {
    type: Number,
    default: 0,
  },

  currency: {
    type: String,
    default: "KES",
  },

  expenses: [ExpenseSchema],

  photos: [PhotoSchema],

  coords: {
    type: [Number],
    default: [0, 0],
  },

  image: {
    type: String,
    default: "",
  },
});

export default mongoose.model(
  "Trip",
  TripSchema
);
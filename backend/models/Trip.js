import mongoose from "mongoose";

const ExpenseSchema =
  new mongoose.Schema({
    label: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      default: 0,
    },
  });

const PhotoSchema =
  new mongoose.Schema({
    url: {
      type: String,
      default: "",
    },

    caption: {
      type: String,
      default: "",
    },
  });

const TripSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

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

      expenses: {
        type: [ExpenseSchema],

        default: [],
      },

      photos: {
        type: [PhotoSchema],

        default: [],
      },

      coords: {
        type: [Number],

        default: [],
      },

      image: {
        type: String,

        default:
          "/placeholder.svg",
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Trip",
  TripSchema
);
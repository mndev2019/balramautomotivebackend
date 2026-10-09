const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    requirement: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      required: true,
      enum: [
        "car",
        "heavy commercial vehicle",
        "jcb/earth moving",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
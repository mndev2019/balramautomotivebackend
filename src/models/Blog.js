const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // ✅ search/sort fast
    },
    short_description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true, // ✅ VERY IMPORTANT (slug API fast)
    },
  },
  {
    timestamps: true,
  }
);

// ✅ ADD THIS (VERY IMPORTANT)
blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Blog", blogSchema);
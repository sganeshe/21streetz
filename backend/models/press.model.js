const mongoose = require("mongoose");

const pressSchema = new mongoose.Schema(
  {
    headline: { type: String, required: true, trim: true },
    image: { type: String, required: true }, 
    redirectLink: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Press", pressSchema);
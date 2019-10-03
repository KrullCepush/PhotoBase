const mongoose = require("mongoose");

const photoSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  photoImage: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model("Photo", photoSchema);

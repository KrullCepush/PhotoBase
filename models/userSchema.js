const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tracking: [],
  images: []
});

userSchema.statics.getByUsername = async function(username) {
  return this.find({ username });
};

module.exports = mongoose.model("User", userSchema);

const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);

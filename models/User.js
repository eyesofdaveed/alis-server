const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const roles = {
  OWNER: "owner",
  ADMIN: "admin",
  USER: "user",
};

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: "owner",
    },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);

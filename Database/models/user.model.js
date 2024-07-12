const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
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
    phone: {
      type: String,
      required: true
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", schema);
module.exports = userModel;

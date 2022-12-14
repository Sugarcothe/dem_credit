const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    balance: {
      type: Number,
      default: 0.0,
    },
    accountNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    amount: { 
      type: Number, 
      required: 
      true, 
      default: 0.0 
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "completed"],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

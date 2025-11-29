//This schema will be mapped to collection in MongoDB
const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

// const userSchena = new Schema({
//   firstName: String,
//   lastName: String,
//   emailId: String,
//   password: String,
//   age: Number,
//   gender: String,
// });

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, minlength: 3, trim: true },
    lastName: { type: String, trim: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: { type: String, trim: true },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender must be male, female or other");
        }
      },
      trim: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://www.kindpng.com/imgv/ioJmwwJ_dummy-profile-image-jpg-hd-png-download/",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url");
        }
      },
    },
    about: {
      type: String,
      default: "Hello! I am using this application.",
      trim: true,
    },
    skills: { type: [String] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

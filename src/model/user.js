//This schema will be mapped to collection in MongoDB
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchena = new Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  password: String,
  age: Number,
  gender: String,
});
const User = mongoose.model("User", userSchena);

module.exports = User;

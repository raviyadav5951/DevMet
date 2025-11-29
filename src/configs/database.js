const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log("Database connected!!");
};

//we will export the connectDB function and when DB gets connected then only app will listen
module.exports = connectDB;

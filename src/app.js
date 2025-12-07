const express = require("express");
const connectDB = require("./configs/database");
const cookieParser = require("cookie-parser");

const app = express();
require("dotenv").config();

//middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

//mapping all routers here after separating all api routes
//into different route files (grouping related routes together)

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

// app.use("/auth", authRouter);
// app.use("/profile", profileRouter);
// app.use("/request", requestRouter);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("DB connection successful");
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });

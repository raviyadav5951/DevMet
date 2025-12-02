const express = require("express");
const connectDB = require("./configs/database");
const User = require("./model/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validations");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const { userAuth } = require("./middlewares/auth");

const app = express();
require("dotenv").config();

//middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  // const userObject = {
  //   firstName: "Ravi",
  //   lastName: "Yadav",
  //   emailId: "test@test.com",
  //   password: "123456",
  //   age: 34,
  //   gender: "male",
  // };

  //creating new instance of User model
  // const user = new User(userObject);

  //getting user data from request body dynamically

  try {
    validateSignUpData(req);

    //encrypt password
    const { firstName, lastName, emailId, password, age, gender, skills } =
      req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      skills,
    });
    const savedUser = await user.save();
    // console.log("User saved successfully:", savedUser);
    res.status(201).json({
      message: "User signed up successfully",
      userId: savedUser._id,
    });
  } catch (error) {
    console.log("Error saving user:" + error.message);
    res.status(400).json({ message: error.message });
  }
});

//login api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address");
    }

    const user = await User.findOne({ emailId: emailId }).exec();
    // console.log(user);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn:"1h"});
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.send("user logged in successfully");
      } else {
        throw new Error("Invalid login credentials");
      }
    } else {
      throw new Error("Invalid login credentials");
    }
  } catch (error) {
    res.status(400).json({ message: "Login failed:" + error.message });
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    //moving this code to auth middleware

    const user = req.user;
    res.status(200).send(user);

    /*const { token } = req.cookies;
    console.log("Token:", token);

    if (!token) {
      throw new Error("Unauthorized access, token missing");
    }

    const decoded = jwt.verify(token, "shhhhh");
    const { _id } = decoded;

    const user = await User.findById(_id).exec();
    if (!user) {
      throw new Error("User not found");
    } else {
      res.status(200).send(user);
    }*/
  } catch (error) {
    res.status(400).json({ message: "Login failed:" + error.message });
  }
});

//get user by email id

app.get("/getUser", async (req, res) => {
  try {
    const emailId = req.query.emailId;
    const userObject = await User.findOne({ emailId: emailId }).exec();

    console.log(userObject);
    if (!userObject) {
      throw new Error("User not found");
    }
    res.status(200).send(userObject);
  } catch (error) {
    res.status(400).json({ message: "Sorry, user not found" + error.message });
  }
});

//get all users

app.get("/feed", async (req, res) => {
  try {
    const userObject = await User.find({});
    res.status(200).send(userObject);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Sorry, something went wrong" + error.message });
  }
});

//delete user by id

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);

    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).json({ message: "something went wrong" + error.message });
  }
});

//update user by id

app.patch("/user/:userId", async (req, res) => {
  try {
    // const userId = req.body.userId;
    const userId = req.params?.userId;

    console.log("UserId:", userId);
    const data = req.body;

    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) => {
      // console.log(key);

      return ALLOWED_UPDATES.includes(key);
    });

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//update user by email id
app.patch("/userByEmail", async (req, res) => {
  try {
    const emailId = req.body.emailId;
    const data = req.body;

    await User.findOneAndUpdate({ emailId: emailId }, data);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" + error.message });
  }
});

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

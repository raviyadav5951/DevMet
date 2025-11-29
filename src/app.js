const express = require("express");
const connectDB = require("./configs/database");
const User = require("./model/user");
const app = express();
require("dotenv").config();

//middleware to parse JSON request bodies
app.use(express.json());

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

  const user = new User(req.body);
  user
    .save()
    .then((savedUser) => {
      console.log("User saved successfully:", savedUser);
      res.status(201).json({
        message: "User signed up successfully",
        userId: savedUser._id,
      });
    })
    .catch((err) => {
      console.log("Error saving user:", err.message);
      res.status(400).json({ message: err.message });
    });
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

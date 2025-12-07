const express = require("express")
const authRouter = express.Router()
const User = require("../model/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validations");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address");
    }

    const user = await User.findOne({ emailId: emailId }).exec();
    // console.log(user);
    if (user) {
      //validate password using user schema method
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn:"1h"});
        // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        
        //getting token using user schema method
        const token = await user.getJWTToken();
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


authRouter.post("/logout", (req, res) => {
  
  // res.cookie("token", null, {
  //   expires: new Date(Date.now()),
  // }).send("User logged out successfully");

  try {
     res.clearCookie("token").send("User logged out successfully")
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
 

});

module.exports = authRouter


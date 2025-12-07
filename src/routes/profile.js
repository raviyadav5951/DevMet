const express = require("express");
const profileRouter = express.Router();
const User = require("../model/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(400).json({ message: "Login failed:" + error.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // const userId = req.body.userId;

    // const userId = user.userId;

    // console.log("UserId:", userId);
    const data = req.body;

    const isUpdateAllowed = validateEditProfileData(data);
    if (!isUpdateAllowed) {
      throw new Error("Invalid edit profile request");
    }

    const loggedInUser = req.user;
    // console.log("UserId:", loggedInUser);

    Object.keys(data).forEach((key) => (loggedInUser[key] = data[key]));

    await loggedInUser.save();

    res
      .json({
        message: `${loggedInUser.firstName} , your profile updated successfully`,
        data: loggedInUser,
      })
    // res.send(`${loggedInUser.firstName} , your profile updated successfully`);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//change password

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (currentPassword && newPassword) {
      const isPasswordValid = await user.validatePassword(currentPassword);
      if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // Validate new password strength

      if (!validator.isStrongPassword(newPassword)) {
        throw new Error("New password is not strong enough");
      }

      // Hash and update new password

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ message: "Password changed successfully" });
    } else {
      throw new Error("Current password and new password are required");
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});


/**
 * We will use below apis later
 */
//get user by email id

profileRouter.get("/getUser", async (req, res) => {
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

profileRouter.get("/feed", async (req, res) => {
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

profileRouter.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);

    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).json({ message: "something went wrong" + error.message });
  }
});

//update user by id

profileRouter.patch("/user/:userId", async (req, res) => {
  try {
    // const userId = req.body.userId;
    const userId = req.params?.userId;

    console.log("UserId:", userId);
    const data = req.body;

    const isUpdateAllowed = validateEditProfileData(data);
    if (!isUpdateAllowed) {
      throw new Error("Invalid edit profile request");
    }

    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true, //this will trigger the validation when this method is called and operation is being performed on schema
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
profileRouter.patch("/userByEmail", async (req, res) => {
  try {
    const emailId = req.body.emailId;
    const data = req.body;

    await User.findOneAndUpdate({ emailId: emailId }, data);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" + error.message });
  }
});

module.exports = profileRouter;

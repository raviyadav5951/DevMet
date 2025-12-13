const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");

const USER_SAFE_FIELDS = "firstName lastName photoUrl";

//get all pending connection requests for logged in user
userRouter.get("/user/receivedRequests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate("fromUserId", USER_SAFE_FIELDS) //map user schema here
      // .populate("fromUserId", ["firstName", "lastName", "photoUrl"])
      .exec();

    res
      .status(200)
      .json({ message: "data fetched successfully", data: connectionRequests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//connections api /user/connections (my connections)
//Sachin connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  //status = accepted and user can be either fromUserId or toUserId
  //Because I want to fetch all connections of logged in user
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_FIELDS)
      .populate("toUserId", USER_SAFE_FIELDS)
      .exec();

      const data = connectionRequests.map((row) => {
          
          if (row.fromUserId._id.equals(loggedInUser._id)) { 
                return row.toUserId;
          }
          
          return row.fromUserId
      });

    res.status(200).json({
      message: "data fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;

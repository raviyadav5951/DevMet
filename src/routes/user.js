const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");

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

      return row.fromUserId;
    });

    res.status(200).json({
      message: "data fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//get other user profiles

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    // 0-Not see his own profile
    // 1-user's own  connections
    // 2-ignored users
    // 3-alrady sent connection request

    const page = parseInt(req.query.page) || 1; //default page 1
    let limit = parseInt(req.query.limit) || 10
    
    if (limit > 50) { 
      limit = 50
    }//default limit 10
    const skip = (page - 1) * limit; //formula
    const logggedInUser = req.user;

    //find all connection request sent and received by logged in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: logggedInUser._id }, { toUserId: logggedInUser._id }],
    })
      .select("fromUserId toUserId")
      // .populate("fromUserId", USER_SAFE_FIELDS) //for debug
      // .populate("toUserId", USER_SAFE_FIELDS) // for debug
      .exec();

    //hide the users which are already connected or ignored or sent request by logged in user
    const hideUserIdsFromFeed = new Set();

    connectionRequests.forEach((request) => {
      hideUserIdsFromFeed.add(request.fromUserId.toString());
      hideUserIdsFromFeed.add(request.toUserId.toString());
    });

    // console.log(hideUserIdsFromFeed);

    //For Pagination we use skip and limit function
    // const page = parseInt(req.query.page) || 1; //default page 1
    // const limit = parseInt(req.query.limit) || 10; //default limit 10
    // const skip = (page - 1) * limit; //formula

    //Page 1 => skip 0 limit 10
    //Page 2 => skip 10 limit 10
    //Page 3 => skip 20 limit 10

    //finding the User collection and filtering the above hideUserIdsFromFeed
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserIdsFromFeed) } },
        { _id: { $ne: logggedInUser._id } }, //not equal to logged in user
      ],
    })
      .select(USER_SAFE_FIELDS)
      .skip(skip)
      .limit(limit)
      .exec();

    res.json({ message: "data fetched successfully", data: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;

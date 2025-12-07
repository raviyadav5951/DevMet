const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");

//requestRouter.post("/request/send/:{status =interested}}/:{toUserId}}"
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      //from user is your logged in user who is sending the request (it will be from user)
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //Check if fromUserId and toUserId are not same
      //moving this to be done from schema level using pre 'save' hook

      // if (fromUserId.toString() === toUserId.toString()) {
      //   throw new Error("You cannot send connection request to yourself");
      // }

      //Also check if toUserId is valid user id (exist in user collection)

      const toUser = await User.findById(toUserId).exec();
      if (!toUser) {
        throw new Error("User not found");
      }

      //check status should be either interested or ignored

      const allowedStatuses = ["interested", "ignored"];
      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid status value :" + status);
      }

      //check if existing request is there from same fromUserId to toUserId (A-->B)
      //then toUserId should not be alloed to send request again to fromUserId (B-->A) should not be allowed

      //Adding or condtion to check both ways (mongodb query)
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      }).exec();

      if (existingRequest) {
        throw new Error("Connection request already exists between users");
      }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });

      const data = await newConnectionRequest.save();

      let message;
      if (status === "ignored") {
        message = `${req.user.firstName}  ${status}  ${toUser.firstName}`
      }
      else if (status === "interested") { 
        message=`${req.user.firstName}  is ${status} in  ${toUser.firstName}`
      }

      res.json({
        message,
        data: data,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = requestRouter;

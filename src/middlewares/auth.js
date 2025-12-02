const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  //read token from request
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Access denied. No token provided.");
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decoded;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // attach user to request object
    next() // to move to request handler
    
    
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = { userAuth };

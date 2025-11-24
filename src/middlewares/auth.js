const adminAuth = (req, res, next) => {
  console.log("Admin middleware called.");
  const token = "12345";
  const isAdminAuthorized = token === "12345";
  if (!isAdminAuthorized) {
    res.send("Not authorized to access admin routes");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("UserAuth middleware called.");
  const token = "12345";
  const isAdminAuthorized = token === "12345";
  if (!isAdminAuthorized) {
    res.send("Not authorized to access user routes");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };

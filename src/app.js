const express = require("express");

const app = express();
const { adminAuth ,userAuth} = require("./middlewares/auth");
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello from server");
});

//middleware usecase ep-5
//e.g when using the routes which are protected and need authentication
//for all request like get, post , put , delete we can use middleware
//we will use app.use for middleware

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  console.log("getAllData called");
  res.send("This is admin getAllData endpoint");
});

app.get("/admin/deleteData", (req, res) => {
  console.log("deleteData called");
  res.send("This is admin deleteData endpoint");
});

app.get("/test", (req, res) => {
  res.send("This is a test endpoint dashboard");
});

//ab?c, ab+c, ab*c, ab(cde)?f
//we can create regex of routes also

app.get("/user/:id", userAuth,(req, res) => {
  console.log(req.params);

  res.send(`User ID created`);
});

//Multiple route handlers

//next can call to next route , but it should be called only if res.send is not called
app.use(
  "/user",
  (req, res, next) => {
    console.log("rh1");
    // res.send("Response from rh1");
    next();
  },

  (req, res, next) => {
    console.log("rh2");
    res.send("Response from rh2");
    next();
  }
);

//we can also use array of handlers

app.use("/usernew", [
  (req, res, next) => {
    console.log("rh1");
    // res.send("Response from rh1");
    next();
  },

  (req, res, next) => {
    console.log("rh2");
    res.send("Response from rh2");
    next();
  },
]);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//advaanced routing example

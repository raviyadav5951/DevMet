const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.get("/test", (req, res) => {
  res.send("This is a test endpoint dashboard");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

mongoose.connect(
  "mongodb+srv://abhishek9111:abhishek9111@cluster0.tw7gvp2.mongodb.net/"
);

const User = mongoose.model("Users", {
  name: String,
  username: String,
  password: String,
});

function userExists(username, password) {
  // write logic to return true or false if this user exists
  // in ALL_USERS array
  return true;
}
app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const userExist = await User.findOne({ username });
  if (userExist) {
    return res.status(400).send("User already exist");
  }
  // const user = new User({
  //   name,
  //   username,
  //   password,
  // });
  // user.save();

  await User.create({ name, username, password });
  res.json({
    msg: "added",
  });
});

app.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.statusCode(403).json({
      msg: "User doesn't exist",
    });
  }
  var token = jwt.sign({ username: username }, jwtPassword);
  return res.json({
    token,
  });
});

app.get("/users", (req, res) => {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

app.listen(3000, () => {
  console.log("server is now running");
});

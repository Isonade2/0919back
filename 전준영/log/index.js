const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
//app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/user")
  .then(() => {
    console.log("Mongo connection open!");
  })
  .catch((err) => {
    console.log("Mongo connection error!");
    console.log(err);
  });
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    maxlength: 100,
    unique: true,
  },
  password: {
    type: String,
    maxlength: 100,
  },
});

const User = mongoose.model("User", userSchema);
// const user = new User({
//   email: "c1004sos@naver.com",
//   password: "jhb5164",
// });

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.post("/login", async (req, res) => {
  const user = req.body;
  console.log(await User.find({ email: user.email, password: user.password }));
  User.find({ email: user.email, password: user.password }).then((result) => {
    if (result.length == 0) {
      console.log("fail!!");
      res.redirect("/login");
    } else {
      console.log("success!!");
      res.redirect("/success");
    }
  });
  console.log(user);
});

app.get("/", async (req, res) => {
  const users = await User.find({});
  console.log(users);
  res.render("index");
});

app.listen(8000, () => {
  console.log("Server started!");
});

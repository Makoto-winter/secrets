//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

// This userShema is not just a js object
// but tis userShema is an object created from mongoose class.
const userShcema = new mongoose.Schema ({
  email: String,
  password: String
});

console.log(process.env.API_KEY);

const User = new mongoose.model("User", userShcema)


app.get("/", (req, res)=>{
  res.render('home');
});

app.get("/login", (req, res)=>{
  res.render('login');
});

app.get("/register", (req, res)=>{
  res.render('register');
});

app.post("/register", (req, res)=>{

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB
    const newUser = new User({
      email:  req.body.username,
      password: hash
    });

    newUser.save()
      .then(()=>{
        res.render("secrets");
      })
      .catch((err)=>{
        console.log(err);
      });

  });



});

app.post("/login", (req, res)=>{
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username})
    .then((foundUser)=>{
      if (foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result=== true){
            res.render("secrets");
          }
        });
      }
    })
})



app.listen(3000 , function() {
  console.log("Server started on port 3000.");
});

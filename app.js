require("dotenv").config();
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

const ejs = require("ejs");
app.set('view engine', 'ejs');
app.use(express.static("public"));

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/usersDB");

const encrypt = require("mongoose-encryption");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

async function searchOne(username){
    return await User.findOne({email: username}).exec();
}

async function createUser(user){
    return await User.create(user);
}

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const email = req.body.username;
    const password = req.body.password;

    const newUser = {
        email : email,
        password : password
    };

    createUser(newUser).then((user)=>{
        if(user){
            res.render("secrets");
        }
    });
    
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    
    searchOne(username).then((user)=>{
        if (user.password === password){
            res.render("secrets");
        }else{
            res.send("Error");
        }
    })
});

app.get("/logout", function(req, res){
    res.render("home");
});

app.listen("3000", function(req, res){
    console.log("Server started at port 3000");
})
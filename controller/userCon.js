const { request } = require("express");
const userModel = require("../model/userModel.js");
//import chatSchema
const chat = require("./../model/chatModel.js");

const bcrypt = require("bcrypt");
const { subscribe } = require("../routes/user.js");

// register user controller
const registerLoad = async (req, res) => {
  try {
    res.render("register"); // render the register file from views to here
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const data = req.body;

    const salt = await bcrypt.genSalt(10);
    // hash the password
    const hash = await bcrypt.hash(data.password, salt);
    const image = "img/" + req.file.filename;
    data.image = image;
    data.password = hash;

    const user = new userModel(data);
    /*const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            image: 'img/'+req.file.filename,
            password: hash
        });*/

    await user.save();
    // res.render('register', { message: 'success registration' });
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// login user
const loginDisplay = async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    // fetch login data
    const email = req.body.email;
    const password = req.body.password;
    // match email
    const userData = await userModel.findOne({ email: email });
    if (!userData) {
      return res.render("login", { message: "Invalid credentials" });
    }
    // const pass = await bcrypt.compare(password, userData.password);
    const pass = await userData.comparePassword(password);
    if (!pass) {
      return res.render("login", { message: "Invalid credentials" });
    }
    req.session.user = userData;
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy(); //delete session
    res.redirect("/");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const dashboard = async (req, res) => {
  try {
    const users = await userModel.find({
      _id: { $nin: [req.session.user._id] },
    });
    // const users = await userModel.find();
    res.render("dashboard", { user: req.session.user, users: users });
    // console.log(" this is dash board data "+users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};
const display = async (req, res) => {
  try {
    const users = await userModel.find();
    res.render("display", { users });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

// chatting endpoints

const saveChat = async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;

    if (!sender_id || !receiver_id || !message) {
      return res.json({ success: false, msg: 'Invalid data received.' });
    }  
    
    try {
    const chatData = new chat({
      sender_id,
      receiver_id,
      message,
      // createdAt: new Date()
    });
    const newChat = await chatData.save();
    res.status(200).send({ success: true, msg: "chat saved successfully", data: newChat });
  } catch (err) {
    console.error(err.message);
    res.status(400).send({ success: false, msg: err.message });
  }
}

module.exports = {
  registerLoad,
  register,
  loginDisplay,
  login,
  logout,
  dashboard,
  display,
  saveChat,
};

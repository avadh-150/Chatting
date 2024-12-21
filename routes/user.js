
const express = require('express');
const router = express.Router();

const User = require('./../model/userModel.js');

// path from path module
const path = require('path');

// import multers
//middleware for handling multipart/form-data, which is primarily used for uploading files in Node.js

const multer = require('multer');// Uploading 
const storage = multer.diskStorage({
    destination: function (req, file, cb) { // cb means callback function..
        cb(null, path.join(__dirname, '../public/img')); // add img path with public
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });


//controllers 
const UserCon = require('./../controller/userCon.js');

//middleware routes authentication 
const auth=require('./../middleware/auth.js');

//registrations for User
router.get('/register', auth.logout,UserCon.registerLoad);
router.post('/register', upload.single('pic'), UserCon.register);
// pic means name of img tag in html

//Login Routes
router.get('/',auth.logout, UserCon.loginDisplay);
router.post('/', UserCon.login);
router.get('/logout', UserCon.logout);
router.get('/dashboard',auth.login ,UserCon.dashboard);
router.get('/display',auth.login, UserCon.display);
router.post('/save-chat', UserCon.saveChat);

module.exports = router;
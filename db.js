const mongoose = require('mongoose');

// Connect to MongoDB Url

require('dotenv').config();

mongoUrl=process.env.MONGOURL;

// connect to MongoDB
mongoose.connect(mongoUrl);

// connect to MongoDB object
const db = mongoose.connection;

//event listener

db.on('connected',() => {

console.log('Connected to MongoDB Database');

});

db.on('error',(err) => {
console.log('Error connecting to MongoDB Database');
});

db.on('disconnect',() => {
    console.log('Disconnected from MongoDB Database');
});

//export function to db object
module.exports = {
    db

};







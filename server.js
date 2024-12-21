const express=require('express');
const app=express();

// environment variables
require('dotenv').config();

// database file path
const db=require('./db.js');

// user Models Schemas
const userModel=require('./model/userModel.js')

// socket.io routes
const {Server}=require('socket.io');
const http=require('http');

//middleware functiuon
const middle=(req, res, next)=>{
    console.log(`[${new Date().toLocaleString()}] response Method is ${req.originalUrl}`);
    next(); // Move to the next middleware or route handler in the stack
}
app.use(middle);

// Sessions
const session = require('express-session');
app.use(session({ 
    secret: process.env.SESSION_SECRET ,// Replace with your secret key
    resave: false, // Prevents unnecessary saving of session if no changes are made
    saveUninitialized: true // Save uninitialized sessions (useful for login sessions)
}));


//body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static routes folder
app.use(express.static('public'));

app.set('view engine', 'ejs');//EJS (Embedded JavaScript) as the templating enginee
app.set('views', './views');//This specifies the directory where the view templates are stored.

// Routing file of user
const User=require('./routes/user.js');

app.use('/',User);
app.get('*', (req, res) => {
    res.redirect('/');
});
// Socket.IO setup
const server = http.createServer(app);// Create HTTP server
const io = new Server(server);// Attach Socket.IO to the HTTP server

const userNamespace = io.of('/user-namespace');
userNamespace.on('connection',async (socket) => {
    console.log('User connected');

     console.log(socket.handshake.auth.token);// fetch the _id from token created in dashboard file
     const userID=socket.handshake.auth.token;
    await userModel.findByIdAndUpdate({_id:userID},{$set:{is_online:'1'}});// uupdate status
     
    // user broadcase online status
    socket.broadcast.emit('online',{user_id:userID});

    socket.on('disconnect',async () => {
        console.log('User disconnected');
        await userModel.findByIdAndUpdate({_id:userID},{$set:{is_online:'0'}});
     
    // user broadcase offline status
    // offline is function name in dashboard file,user_id is key
    socket.broadcast.emit('offline',{user_id:userID});
    });
    // chatting implementation
    socket.on('newChat',(data) => {
        socket.broadcast.emit('loadChat',data);
});

});


server.listen(process.env.PORT||3000, () => {
    console.log('Server is running on port 3000');
});


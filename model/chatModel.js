const { timeStamp } = require('console');
const mongoose = require('mongoose');

const chatShema = new mongoose.Schema({
    sender_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        // required:true
    },
    message:{
        type:String,
        required:true
    }  
},
    { timestamps: true }
);
module.exports = mongoose.model('Chat',chatShema);

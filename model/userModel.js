const { timeStamp } = require('console');
const mongoose = require('mongoose');
 const bcrypt = require('bcrypt');
const userShema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    image: {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    is_online:
    {
        type: String,
        default: '0'
    }
},
    { timestamps: true }
);
userShema.methods.comparePassword=async function(userpass){
    try
    {
        const isMatch=await bcrypt.compare(userpass,this.password);
        return isMatch;
    }

    catch (err) {
      console.error(err);
      throw err;
    }
    };
    

module.exports = mongoose.model('User',userShema);


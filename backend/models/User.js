const mongoose = require('mongoose');
const {schema} = mongoose.Schema;
const userSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true,index:true},
    email:{type:String, required:true, unique:true,index:true},
    password:{type:String, required:true},
    role:{type:String, enum:['admin', 'trainer','receptionist','member'], default:'member'},
    phone:{type:String, index:true},
    profilePicture:{type:String},
    createdAt:{type:Date, default:Date.now},
    isActive:{type:Boolean, default:true},
    lastLogin:{type:Date},
    refreshToken:{type:String}
});

module.exports = mongoose.model('User', userSchema);
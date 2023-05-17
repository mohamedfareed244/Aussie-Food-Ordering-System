import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const employees= new Schema({
 Firstname:String,
 Middlename:String,
 Lastname:String,
 Phone:Number,
 Orders:[{id:String}],
 Email:String,
 Password:String,

//ConfirmPassword:String,


  
});
const Emp=mongoose.model('Reg',employees);

export {Reg};
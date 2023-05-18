import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const employees= new Schema({
 Firstname:String,
 Lastname:String,
 Phone:Number,
 Salary:Number,
 Email:String,
 Password:String,

//ConfirmPassword:String,


  
});
const Emp=mongoose.model('Reg',employees);

export {Emp};
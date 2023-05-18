import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const Custom = new Schema({
Firstname:String,
Middlename:String,
Lastname:String,
Phone:Number,
Orders:[{id:String}],
Email:String,
Password:String,
  
});
 const customers =mongoose.model('customers',Custom);

export {customers};

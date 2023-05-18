import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const customers = new Schema({
customerid:String,
orders:[{orderid : String}],
firstname: String,
middlename: String,
lastname: String,
phone:String,
email:String,
psw: String
  
});
 const customerss =mongoose.model('customerss',customers);

export {customerss};

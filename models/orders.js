import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const Items= new Schema({
customermail:String,
customerphone:String,
items:[{item_name:String,Qty:Number,price:Number}],
emp_name:string,
emp_mail:String,
orderdate:Date,
status:String,
Addressid:String
  
});
const orders=mongoose.model('orders',Items);

export {orders};
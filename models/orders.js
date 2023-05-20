import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const Items= new Schema({
customerid:String,
items:[{item_name:String,Qty:Number,price:Number}],
emp_name:string,
emp_phone:String,
orderdate:Date,
status:String
  
});
const orders=mongoose.model('orders',Items);

export {orders};
import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const Items= new Schema({
 name:String,
 path:String,
 price:Number,
 description:String,
 section:String
  
});
const All=mongoose.model('All',Items);

export {All};
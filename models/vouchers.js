import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const Items = new Schema({
   value:Number,
   code:String,
   mongoid:String,
   used:Boolean,

});
const voucher = mongoose.model('vouchers', Items);

export { voucher };
//formated

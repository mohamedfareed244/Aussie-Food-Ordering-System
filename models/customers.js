import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const Custom = new Schema({
Firstname:String,
Middlename:String,
Lastname:String,
Phone:String,
Orders:[{id:String}],
Email:String,
Password:String,
chat:[{msg:String, issent:Boolean}],
addreses:[{ location: String, Adress:String, apartement: string, floor: String, Building:String}],
favorites:[{ itemId: String}]
  
});
 const customers =mongoose.model('customers',Custom);

export {customers};

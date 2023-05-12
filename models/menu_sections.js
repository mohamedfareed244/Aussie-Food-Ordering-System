import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const Sections= new Schema({
 name:String,
items:[{id:String}]
  
});
const Sec=mongoose.model('Sec',Sections);

export {Sec};
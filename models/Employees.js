import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const employees = new Schema({
    Name: String,
    Email: String,
    Address: String,
    Phone: String,
    Password: String,
    isadmin: Boolean,
    verified: Boolean
});
const Emp = mongoose.model('Reg', employees);

export { Emp };
//formated

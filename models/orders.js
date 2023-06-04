import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const Items = new Schema({
    customermail: String,
    customername: String,
    customerphone: String,
    items: [{ item_name: String, Qty: Number, price: Number }],
    emp_name: String,
    emp_phone: String,
    orderdate: String,
    status: String,
    Addressid: String,
    num: Number

});
const orders = mongoose.model('orders', Items);

export { orders };
//formated

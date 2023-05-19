import express from "express";
import ejs, { compile } from "ejs";
import mongoose from "mongoose"
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
//import the routes 
import product_router from "./routes/products.js";
//ali
import cust_router from "./routes/customers.js";
import emp_router from "./routes/employees.js";


//import the routes 
import {All} from "./models/schema.js";
import {Sec} from "./models/menu_sections.js";
import { CLIENT_RENEG_LIMIT } from "tls";
import session from "express-session";
import cors from "cors"
//Read the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();


 

//set up app 

//set up session 
app.use(session({ secret: 'Your_Secret_Key' }));


app.set('view engine', 'ejs');
//setup static 
app.use(express.static(path.join(__dirname,'public')));

//db post request
app.use(express.urlencoded({extended:true}));

//routes 
app.use('/products',product_router);
app.use('/employees',emp_router);
app.use('/recentt-customers',cust_router);


//test playing sound for use in the future at orders 
app.get("/Users/user/Downloads/Message%20notification.m4r",function(req,res){
    res.sendFile(path.join("/Users/user/Downloads/Message notification.m4r"));
})




//ali


// app.get("/reg",function(req,res){
//     res.render("register");
// })






//error handling 
app.use((req,res)=>{
    res.send("OOPS! it seems that there are an error try again with a valid URL ");
})

export default app;














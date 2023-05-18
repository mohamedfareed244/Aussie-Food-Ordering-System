import express from "express";
import ejs, { compile } from "ejs";
import mongoose from "mongoose"
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
//import the routes 
import product_router from "./routes/products.js";


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

//ali
import {customers} from "./models/customers.js";
 import {Emp} from "./models/Employees.js";

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


//test playing sound for use in the future at orders 
app.get("/Users/user/Downloads/Message%20notification.m4r",function(req,res){
    res.sendFile(path.join("/Users/user/Downloads/Message notification.m4r"));
})




//ali


// app.get("/reg",function(req,res){
//     res.render("register");
// })

 app.post('/recentt-customers', (req, res)=> {

    const customer=new customers(req.body);
    customer
    .save( )
    .then( result => {
     console.log("succesfully saved");
    })
    .catch( err => {
      console.log(err);
   });
  })





 app.post('/employees', (req, res)=> {
  
    const employee=new Emp(req.body);
    employee
    .save( )
    .then( result => {
     console.log("succesfully saved");
    })
    .catch( err => {
      console.log(err);
    });
  })
app.get('/employees', (req, res)=> {
       employee
     .find( )
     .then( result => {     console.log(result);    })
   .catch( err => {
     console.log(err);
    });
 })




app.get('/', (req, res) => 
{
  res.render('index')
})






//error handling 
app.use((req,res)=>{
    res.send("OOPS! it seems that there are an error try again with a valid URL ");
})

export default app;














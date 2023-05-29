import express from "express";
import {orders} from "./models/orders.js";
import {Server} from 'socket.io';
import path from "path";
import { fileURLToPath } from "url";
//import the routes 
import product_router from "./routes/products.js";
//ali
import cust_router from "./routes/customers.js";
import emp_router from "./routes/employees.js";
// end import routes 
import { CLIENT_RENEG_LIMIT } from "tls";
import session from "express-session";
// import cors from "cors"
// import { Server } from "http";
//Read the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();


//set up app 
//set up session 
const sessionMiddleware = session({
  secret: 'Your_secret_key',
  resave: false,
  saveUninitialized: false
});
app.use(sessionMiddleware);


app.set('view engine', 'ejs');
//setup static 
app.use(express.static(path.join(__dirname,'public')));

//db post request
app.use(express.urlencoded({extended:true}));

//routes 
app.use('/products',product_router);
app.use('/employees',emp_router);
app.use('/customers',cust_router);


//test playing sound for use in the future at orders 
// app.get("/Users/user/Downloads/Messagenotification.m4r",function(req,res){
//     res.sendFile(path.join("/Users/user/Downloads/sound.m4r"));
// })

app.get("/test",(req,res)=>{
const emp=req.session.employee;
orders.find({emp_name:emp.Name,emp_phone:emp.Phone}).then((result)=>{
  if(result!==null&&result!==undefined){
    res.render("dashboard-orders",{orders:result});
  }

})
})

//ali






    // app.get("/",function(req,res){
    //         res.render("add-employee");
    //    })


app.get('/test',(req,res)=>{
  console.log(req.baseUrl);
  console.log("start")
res.render("add-employee");
});
app.get('/',(req,res)=>{
  let number=0;
  if(req.session.cart_items!==undefined){
  for(let i=0;i<req.session.cart_items.length;i++){ number+=req.session.cart_items[i].qty;}
  }
  res.render("index",{s:(req.session.cart_items===undefined?new Array():req.session.cart_items)
    ,num:number,current_user:req.session.signed_customer==undefined?null:req.session.signed_customer});
});


//error handling 
app.use((req,res)=>{
    res.send("OOPS! it seems that there are an error try again with a valid URL ");
})
//
let onlineemp=new Array();

async function chg_sock(emp,new_id){
  let f=JSON.stringify(emp);

console.log("the is ",emp._id);
  for(let i=0;i<onlineemp.length;i++){
    console.log(onlineemp[i].curr.id);
    if(onlineemp[i].curr.id===emp._id){
     onlineemp[i].sock=new_id;
     console.log("the new id will be :"+new_id);
     break;
    }
  }
}
 async function addemp(emp){
  const obj ={curr:emp,orders:0,chat:0,sock:"String"};
onlineemp.push(obj);
console.log("now "+onlineemp.length+" employees are conected ");
 }
 async function delemp(emp){
for(let i=0;i<onlineemp.length;i++){
  if(onlineemp[i].curr.id===emp.id){
    onlineemp.splice(i,1);
    break;
  }
}
 }
 //
 async function findforchat(){
  if(onlineemp.length===0){
    return null;
  }
  let min=onlineemp[0];
  for(let i=1;i<onlineemp.length;i++){
if(onlineemp[i].chat<min.chat){
  min=onlineemp[i];
}
  }
  min.chat++;
  return min.curr;
 }
 //
 async function findfororder(){
  if(onlineemp.length===0){
    return null;
  }
  let min=onlineemp[0];
  for(let i=1;i<onlineemp.length;i++){
if(onlineemp[i].orders<min.orders){
  min=onlineemp[i];
}
  }
  min.orders++;
  return min.curr;
 }
 //
 async function find_soc(emp){
  
console.log("red : ",emp);
  for(let i=0;i<onlineemp.length;i++){
    if(onlineemp[i].curr.id===emp.id){
      return onlineemp[i].sock;
    }
      }
 }
export {app,addemp,delemp,findforchat,findfororder,chg_sock,sessionMiddleware,find_soc};














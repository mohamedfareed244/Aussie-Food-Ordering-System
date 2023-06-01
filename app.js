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
import cors from "cors"
// import cors from "cors"
// import { Server } from "http";
//Read the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

//ali

app.use(cors());






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

app.get("/test",async (req,res)=>{
// const emp=req.session.employee;
// let f;
// await orders.find({emp_name:emp.Name,emp_phone:emp.Phone}).then((result)=>{
//   if(result!==null&&result!==undefined){
//     f=result;
//   }

// })
let obj=[{"id":"123","Firstname":"mohamed","Middlename":"fareed","Phone":"01210847509","chats":[{"body":"ana khlas gbt akhry ","issent":true},
{"body":"ana khlas gbt akhry ","issent":false},
{"body":"ana khlas gbt akhry ","issent":true}]},
{"id":"124","Firstname":"mohamed","Middlename":"fareed","Phone":"01210847509"},
{"id":"125","Firstname":"mohamed","Middlename":"fareed","Phone":"01210847509"}]
let sele={"id":"123","Firstname":"mohamed","Middlename":"fareed","Phone":"01210847509","chats":[{"body":"ana khlas gbt akhry ","issent":true},
{"body":"ana khlas gbt akhry ","issent":false},
{"body":"ana khlas gbt akhry ","issent":true}]}
res.render("admin_chat",{connected:obj,selected:sele});
})



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


//    app.get("/emp",function(req,res){
//      res.render("dashboard-employees");
// })

//error handling 
app.use((req,res)=>{
   res.render("error-page")
})
//

let onlineemp=new Array();
let online_cus=new Array();



async function getmyemp(customer){
  let ob=null;
  console.log("the cus is in ini ",customer);
 for(let i=0;i<online_cus.length;i++){
  if(online_cus[i].customer._id===customer._id){
    console.log("the customer is : ",customer);
    console.log("the index is : ",online_cus[i].to);
    await find_soc(onlineemp[online_cus[i].to].curr).then((res)=>{
      console.log("the returned socket is ",res);
      ob=res;
      
    })
  }
 }
 return ob;
}
async function chg_sock(emp,new_id){
  let f=JSON.stringify(emp);

console.log("the is ",emp._id);
  for(let i=0;i<onlineemp.length;i++){
    console.log(onlineemp[i].curr.id);
    if(onlineemp[i].curr.id===emp._id){
      console.log("the old emp is ",onlineemp[i]);
     onlineemp[i].sock=new_id;
     console.log("the new emp is ",onlineemp[i]);
     console.log("the new id will be :"+new_id);
     break;
    }
  }
}
async function add_customer(cust){
  let emp_index;
  let founded=false;
  let index;
  for(let i=0;i<online_cus.length;i++){
if(online_cus[i].customer._id===cust._id){
  console.log("the online customer founded is ",online_cus[i]);
  founded=true;
  index=i;
  break;
}
  }
  if(!founded){
  const ind=online_cus.length;
  console.log("the index in customer is ",ind);
 emp_index= await findforchat(cust,ind);

  const obj ={"customer":cust,"to":emp_index,"soc":"s"};
  await online_cus.push(obj);
  console.log("the onlone now is ",online_cus);
  console.log("the customers size is io",online_cus.length);
  if(emp_index===null||emp_index===undefined){
    console.log("no employee founded ");
    return false;
  }else{
    return true;
  }
  }else{
    online_cus[index].to= await findforchat(online_cus[index],index);
  if(online_cus[index].to===null||online_cus[index].to===undefined){
    console.log("no employee founded ");
    return false;
  }else{
    
  return true;
  }
}
}

async function chg_custsock(cust,new_id){
  for(let i=0;i<online_cus.length;i++){
    if(online_cus[i].id===cust.id){
online_cus[i].soc=new_id;
break;
    }
  }
}
async function get_customers(emp){
let index;

const obj=new Array();
for(let i=0;i<onlineemp.length;i++){
  console.log(onlineemp[i]);
  if(onlineemp[i].curr._id.valueOf()===emp._id){
    for(let j=0;j<onlineemp[i].customers.length;j++){
obj.push(online_cus[onlineemp[i].customers[j].index].customer);
    }
    
  }
}

return obj;
}
 async function addemp(emp){
  let founded=false;
  for(let i=0;i<onlineemp.length;i++){
    
    if(onlineemp[i].curr.id===emp.id){
founded=true;
break;
    }
  }
  if(!founded){
  const obj ={curr:emp,orders:0,chat:0,sock:"String","customers":new Array()};
onlineemp.push(obj);

console.log("now "+onlineemp.length+" employees are conected ");
 }
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
 async function findforchat(customer,ind){
  if(onlineemp.length===0){
    console.log("the lenght is ",onlineemp.length);
    return null;
  }
  
  console.log("in find for chat the object is ");
  let min=onlineemp[0];
  let index=0;
  for(let i=0;i<onlineemp.length;i++){
if(onlineemp[i].chat<min.chat){
  min=onlineemp[i];
  index=i;
}

  }
  let obj={"index":ind};
  min.chat++;
  console.log("now the emp has : ",min.chat);
  console.log("the suggested place for the nre is ",ind);
  console.log("the customers size is ",online_cus.length);
min.customers.push(obj);
return index;
 
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
  

  for(let i=0;i<onlineemp.length;i++){
    if(onlineemp[i].curr.id===emp.id){
      return onlineemp[i].sock;
    }
      }
 }
 async function remove_emp(emp){
  for(let i=0;i<onlineemp.length;i++){
    console.log(onlineemp[i].curr.id);
    if(onlineemp[i].curr.id===emp._id){
    onlineemp.splice(i,1);
    console.log("has been removed the new number is : ",onlineemp.length);
     break;
    }
  }
}
 //
 async function find_customer_socket(id){
for(let i=0;i<online_cus.length;i++){
  if(online_cus[i].customer._id===id){
    return online_cus[i];
  }
}

 }
 //
async function remove_customer(cust){
  for(let i=0;i<online_cus.length;i++){
    if(online_cus[i].customer._id===cust._id){
if(onlineemp.length!=0){
      for(let j=0;j<onlineemp[online_cus[i].to].customers.length;j++){
        if(onlineemp[online_cus[i].to].customers[j].index===i){
          onlineemp[online_cus[i].to].chat--;
          onlineemp[online_cus[i].to].customers.splice(j,1);
          online_cus.splice(i,1);
          console.log("removed from both employees and customers");

          return cust;
        }
      }
    }else{
      online_cus.splice(i,1);
      console.log("removed from customers only ");
      return cust;
    }

    }
  }
}

async function repcust(cust){
  for(let i=0;i<online_cus.length;i++){
    if(online_cus[i].customer._id===cust._id){
      online_cus[i].customer=cust;
      return;
    }
  }
}

export {repcust,app,addemp,delemp,findforchat,findfororder,chg_sock,sessionMiddleware,find_soc,remove_emp,get_customers,add_customer
,chg_custsock,getmyemp,remove_customer,find_customer_socket};














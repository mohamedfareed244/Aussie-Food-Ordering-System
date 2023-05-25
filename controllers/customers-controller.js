import {customers} from "../models/customers.js";
import mongoose from "../bin/www.js";
import nodemailer from "nodemailer"
import ejs from "ejs"
async function sendsms(User){

  const trans=nodemailer.createTransport({service:'gmail',
auth:{
  user:"aussiefood6@gmail.com",
  pass:"gqhnpwicffirkdhn"
}});
let data;
ejs.renderFile("/Users/user/Desktop/web_back2 /views/template.ejs",{user:User},(err,d)=>{
  data=d;
 console.log(d);
});
const options={
  from:"aussiefood6@gmail.com",
  to:User.Email,
  subject:"mail confirmation",
 html:data

}
trans.sendMail(options,function (err,info){
  if(err){
    console.log("there are an error "+err)
  }else{
    console.log(info);
  }
})

 }



















//add new customer to the database 
const postcustomers = async (req, res)=> {
let validatephone
console.log(req.body.Phone);
 await customers.findOne({Email:req.body.Email}).then(async (result)=>{
  if(result!==null){
    res.render("register",{alert:true,text:"this email already exists ! "});
  }else{
    const obj={Firstname:req.body.Firstname,
      Middlename:req.body.Middlename,
      Lastname:req.body.Lastname,
      Phone:req.body.Phone,
      "Orders":new Array(),
      Email:req.body.Email,
      Password:req.body.Password,
      "chat":new Array(),
      verified:false
      }
          const customer=new customers(obj);
      
      try{
      await customer.save();
      sendsms(customer);
      res.redirect("/products/All");
      }catch(err){
      console.log(err);
      }
  }
 })




    // customer.save().then((result)=>{
    //   console.log("saved successfully ");
    //   res.send("welcome to auusie ");
    // }).catch((err)=>{
    //   res.send(`an error happend : ${err}`);
    // })

   
 
  }
//customer sign in 
  const getcustomers= async (req, res) => {
 
  let  current_customer;
  console.log(req.body.phone);
  console.log(req.body.password);
   await customers.findOne({Email:req.body.phone,Password:req.body.password}).then((result)=>{
    current_customer=result;
   })
   console.log(current_customer);
   
   if(current_customer===undefined||current_customer===null){
    res.render("sign-in",{alert:true,text:" incorrect email or password "});

   }else{
    if(!current_customer.verified){
      res.render("sign-in",{alert:true,text:" you have to verify your email firstly check your mailbox please"});
      return;
    }
    req.session.signed_customer=current_customer;
  console.log(req.rawHeaders[19]);
    res.redirect("/products/All");
   }
   }



   const customerpr= async (req, res) => {
    if(req.session.signed_customer===null||req.session.signed_customer===undefined){
     res.render("sign-in",{alert:true,text:"you must sign in to access profile "});
    }else{
 res.render("personalinfo",{customer:req.session.signed_customer});
    }
     }

     const customeror=async (req,res)=>{
      res.render("customer_orders");
     }
     




   const customerml= async (req, res) => {
console.log("recieve request");
const customer= await customers.findById(req.params.id);

if(!customer.verified){
  customer.verified=true;
  await customers.findByIdAndUpdate(customer.id,customer);
req.session.signed_customer=customer;
}

res.redirect('/');

     }

   
   

   export {getcustomers,postcustomers,customerpr,customeror,customerml};
import {customers} from "../models/customers.js";
import mongoose from "../bin/www.js";
//add new customer to the database 
const postcustomers = async (req, res)=> {
let validatephone
console.log(req.body.Phone);
 await customers.findOne({Phone:req.body.Phone}).then(async (result)=>{
  if(result!==null){
    res.render("register",{alert:true});
  }else{
    const obj={Firstname:req.body.Firstname,
      Middlename:req.body.Middlename,
      Lastname:req.body.Lastname,
      Phone:req.body.Phone,
      "Orders":new Array(),
      Email:req.body.Email,
      Password:req.body.Password,
      "chat":new Array()
      }
          const customer=new customers(obj);
      
      try{
      await customer.save();
      req.session.signed_customer=obj;
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
   await customers.findOne({Phone:req.body.phone,Password:req.body.password}).then((result)=>{
    current_customer=result;
   })
   console.log(current_customer);
   if(current_customer===undefined||current_customer===null){
    res.send("invalid phone or password ");
   }else{
    req.session.signed_customer=current_customer;
    res.redirect("/products/All");
   }
   }

   export {getcustomers,postcustomers};
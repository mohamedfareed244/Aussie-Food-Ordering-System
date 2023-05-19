import {customers} from "../models/customers.js";
import mongoose from "../bin/www.js";
//add new customer to the database 
const postcustomers = async (req, res)=> {
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
console.log("done");
}catch(err){
console.log(err);
}

    // customer.save().then((result)=>{
    //   console.log("saved successfully ");
    //   res.send("welcome to auusie ");
    // }).catch((err)=>{
    //   res.send(`an error happend : ${err}`);
    // })

   
 
  }
//customer sign in 
  const getcustomers= async (req, res) => {
 
   const current_customer= await customers.findOne({phone:req.body.phone,Password:req.body.Password});
   if(current_customer===undefined){
    res.send("invalid phone or password ");
   }else{
    req.session.signed_customer=current_customer;
    res.redirect("/products/All");
   }
   }

   export {getcustomers,postcustomers};
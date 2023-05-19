import {customers} from "../models/customers.js";

//add new customer to the database 
const postcustomers = async (req, res)=> {

    const customer=new customers(req.body);
    customer
    .save( )
    .then( result => {
     console.log("succesfully saved");
     res.send("done ! welcome to aussie ");
    })
    .catch( err => {
      console.log(err);
   });
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
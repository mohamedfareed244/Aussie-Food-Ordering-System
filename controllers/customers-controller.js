import {customers} from "../models/customers.js";

//add new customer to the database 
const postcustomers = async (req, res)=> {

    const customer=new customers(req.body);
    customer
    .save( )
    .then( result => {
     console.log("succesfully saved");
    })
    .catch( err => {
      console.log(err);
   });
  }
//customer sign in 
  const getcustomers= async (req, res) => {
 
   const current_customer=customers.findOne({})
   }

   export {getcustomers,postcustomers};
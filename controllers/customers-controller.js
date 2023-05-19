import {customers} from "../models/customers";


const postcustomers =(req, res)=> {

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

  const getcustomers= (req, res) => {
 
    customers.find()
       .then((result) => {
         res.render("index", { arrCust: result });
       })
       .catch((err) => {
         console.log(err);
       });
   }

   export {getcustomers,postcustomers};
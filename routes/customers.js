
import Router from "express"
import {customers} from "../models/customers";
const router=Router();

router.post('/', (req, res)=> {

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


  router.get("/", (req, res) => {
 
   customer.find()
      .then((result) => {
        res.render("index", { arrCust: result });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  export default router;
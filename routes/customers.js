
import Router from "express"
import {getcustomers} from "../controllers/customers-controller.js";
import {postcustomers} from "../controllers/customers-controller.js";

const router=Router();

router.post('/signup', postcustomers );
  router.post("/signin", getcustomers);

  router.get('/j/k',async (req,res)=>{
    res.render("register");
  });

  export default router;

import Router from "express"
import {getcustomers} from "../controllers/customers-controller.js";
import {postcustomers} from "../controllers/customers-controller.js";
import {customerpr} from "../controllers/customers-controller.js";
import {customeror} from "../controllers/customers-controller.js";
const router=Router();

router.post('/signup', postcustomers );
  router.post("/signin", getcustomers);

  router.get('/signup',async (req,res)=>{
    res.render("register",{alert:false});
  });
  router.get('/signin',async (req,res)=>{
    res.render("sign-in");
  });
  router.get('/profile/login',customerpr);

  router.get('/profile/orders',customeror);
  export default router;
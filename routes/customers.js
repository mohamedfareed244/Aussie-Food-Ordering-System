
import Router from "express"
import {getcustomers} from "../controllers/customers-controller.js";
import {postcustomers} from "../controllers/customers-controller.js";
import {customerpr} from "../controllers/customers-controller.js";
import {customeror} from "../controllers/customers-controller.js";
import {customerml} from "../controllers/customers-controller.js";
import {customeraddr} from "../controllers/customers-controller.js";
const router=Router();

router.post('/signup', postcustomers );
  router.post("/signin", getcustomers);

  router.get('/signup',async (req,res)=>{
    res.render("register",{alert:false});
  });
  router.get('/signin',async (req,res)=>{
    res.render("sign-in",{alert:false});
  });
  router.get('/profile/login',customerpr);

  router.get('/profile/orders',customeror);

  router.get('/mail/validation/:id',customerml);
  router.get('/profile/addr',customeraddr)
  export default router;
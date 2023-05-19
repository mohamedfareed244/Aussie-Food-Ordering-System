
import Router from "express"
import {getcustomers} from "../controllers/customers-controller.js";
import {postcustomers} from "../controllers/customers-controller.js";

const router=Router();

router.post('/signin', postcustomers )


  router.post("/sing_up", getcustomers);

  export default router;
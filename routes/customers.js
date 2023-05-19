
import Router from "express"
import {getcustomers} from "../controllers/customers-controller.js";
import {postcustomers} from "../controllers/customers-controller.js";

const router=Router();

router.post('/', postcustomers )


  router.get("/", getcustomers);

  export default router;
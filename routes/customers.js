
import Router from "express"
import {getcustomers} from "../controllers/customers-controller";
import {postcustomers} from "../controllers/customers-controller";

const router=Router();

router.post('/', postcustomers )


  router.get("/", getcustomers);

  export default router;
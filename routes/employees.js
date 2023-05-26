
import Router from "express"
import {getemployees} from "../controllers/employees-controllers.js";
import {postemployees} from "../controllers/employees-controllers.js";

const router=Router();

 router.post("/", postemployees)

  router.post("/signin", getemployees);

router.get("/mail/verification/:id");


// app.get('/', (req, res) => 
// {
//   res.render('index')
// })


// router.get('/', (req, res) => 
//   {

//     res.render('dashboard-employees')
//  })



 export default router;

import Router from "express"
import {getemployees} from "../controllers/employees-controller";
import {postemployees} from "../controllers/employees-controller";

const router=Router();

 router.post("/", postemployees)






  router.get("/", getemployees);




// app.get('/', (req, res) => 
// {
//   res.render('index')
// })


// router.get('/', (req, res) => 
//   {

//     res.render('dashboard-employees')
//  })



 export default router;
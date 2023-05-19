
import Router from "express"
import {getemployees} from "../controllers/employees-controllers";
import {postemployees} from "../controllers/employees-controllers";

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
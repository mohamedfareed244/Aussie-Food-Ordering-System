
import Router from "express"
import {getemployees} from "../controllers/employees-controllers.js";
import {postemployees} from "../controllers/employees-controllers.js";
import {confirmmail} from "../controllers/employees-controllers.js";
import {empprof} from "../controllers/employees-controllers.js";
import {changepass} from "../controllers/employees-controllers.js";
import {getallchats} from "../controllers/employees-controllers.js";
import {getallchatssel} from "../controllers/employees-controllers.js";
const router=Router();
//employees sign up 
 router.post("/", postemployees)
//employees sign in 
  router.post("/signin", getemployees);
//access to employees profile 
router.get("/profile",empprof);
//verify employees mail 
router.get("/mail/verification/:id",confirmmail);
//change employees password 
router.post("/profile/password/change",changepass);
router.get("/signin",(req,res)=>{
  res.render("admin_signin",{alert:false});
})
router.get("/profile/chat/details/:id",getallchatssel);
router.get("/profile/chat/details",getallchats);
// app.get('/', (req, res) => 
// {
//   res.render('index')
// })


// router.get('/', (req, res) => 
//   {

//     res.render('dashboard-employees')
//  })



 export default router;
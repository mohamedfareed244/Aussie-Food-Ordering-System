
import Router from "express"
import { GetAllproducts, getemployees } from "../controllers/employees-controllers.js";
import { postemployees } from "../controllers/employees-controllers.js";
import { confirmmail } from "../controllers/employees-controllers.js";
import { empprof } from "../controllers/employees-controllers.js";
import { changepass } from "../controllers/employees-controllers.js";
import { getallchats } from "../controllers/employees-controllers.js";

import { GetAllemps } from "../controllers/employees-controllers.js";

import { GetAllcustomers} from "../controllers/employees-controllers.js";


import { GetAllsections } from "../controllers/employees-controllers.js";




import { getallchatssel ,emporder} from "../controllers/employees-controllers.js";
const router = Router();
console.log(postemployees);
//employees sign up 
router.post("/", postemployees)
//employees sign in 
router.post("/signin", getemployees);

//access to employees profile 
router.get("/profile", empprof);
//verify employees mail 
router.get("/mail/verification/:id", confirmmail);
//change employees password 
router.post("/profile/password/change", changepass);
router.get("/signin", (req, res) => {
  res.render("admin_signin", { alert: false });
})
router.get("/profile/chat/details/:id", getallchatssel);
router.get("/profile/chat/details", getallchats);
router.get("/profile/orders", emporder)


//for employees
router.get("/emp", GetAllemps);

//for admin menu sections
router.get("/emppp", GetAllsections);


router.get("/emppp", GetAllproducts);


router.get("/empp", GetAllcustomers);



export default router;


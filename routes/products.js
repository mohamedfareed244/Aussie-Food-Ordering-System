import Router from "express"
//import the products databse controllers 
import {getsection} from "../controllers/products_controller.js";
import {getitembyid} from "../controllers/products_controller.js";
import {delitem} from "../controllers/products_controller.js";
import {check_out} from "../controllers/products_controller.js";
//import the products database controllers 


const router=Router();

//get section items by section name 
router.get('/:sec_name',getsection);
//send item id to append to the cart 
router.get('/getitem/:id',getitembyid);
//delete item from the cart 
router.get('/cartdel/:id',delitem);
//check out 
router.get('/cart/end/checkout',check_out);
//
router.post('/customer/order/address',)
export default router;

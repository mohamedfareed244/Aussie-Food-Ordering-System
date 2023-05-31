import Router from "express"
//import the products databse controllers 
import {getsection, postsection} from "../controllers/products_controller.js";
import {getitembyid} from "../controllers/products_controller.js";
import {delitem} from "../controllers/products_controller.js";
import {check_out} from "../controllers/products_controller.js";
import {new_order} from "../controllers/products_controller.js";
// import {postsection} from "../controllers/products_controller.js";
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
//add section
router.get('/add section',postsection);
//router.post('/customer/order/address',)
router.get('/customer/cart/checkout/order',new_order);
export default router;

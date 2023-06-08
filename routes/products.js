import Router from "express"
//import the products databse controllers 
import { getsection, postproduct, postsection } from "../controllers/products_controller.js";
import { getitembyid } from "../controllers/products_controller.js";
import { delitem } from "../controllers/products_controller.js";
import { check_out,edititem } from "../controllers/products_controller.js";
import { new_order ,getorderdet,searchitems,getitemforedit} from "../controllers/products_controller.js";
import { confirml,disconfirml} from "../controllers/customers-controller.js";
// import {postsection} from "../controllers/products_controller.js";
//import the products database controllers 



const router = Router();
router.post('/edit/a/a/a/b/c/d/f',edititem);

//get section items by section name 
router.get('/:sec_name', getsection);
//send item id to append to the cart 
router.get('/getitem/:id', getitembyid);
//delete item from the cart 
router.get('/cartdel/:id', delitem);
//check out 
router.get('/cart/end/checkout', check_out);
//add section
router.post('/add/sectionn', postsection);

router.post('/search',searchitems);

//add product
router.post('/add/product', postproduct);
//router.post('/customer/order/address',)
router.post('/customer/cart/checkout/order', new_order);
router.get('/ordrers/get/details/admin/:id',getorderdet);
router.get('/employee/edit/item/menu/edit/:id',getitemforedit);
router.get('/admin/confirm/order/send/mail/customer/:id',confirml);
router.get('/admin/cancel/order/send/mail/customer/ok/:id',disconfirml);
export default router;
//formated

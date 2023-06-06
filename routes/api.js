import {generatefor,apply} from "../controllers/vouchers_controller.js"

import Router from "express"
const router=Router();

router.post('/dskjf/newuser',generatefor);
router.post('/voucher',apply);
import {generatefor,apply} from "../controllers/vouchers_controllers.js"

import Router from "express"
const router=Router();

router.post('/dskjf/newuser',generatefor);
router.post('/voucher',apply);

export default router;
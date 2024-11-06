const router=require('express').Router();
const {middleware}=require('../../../utils/middleware')
const {buyerMiddleware}=require('../../../utils/buyerMiddleware')
const {getBonds,getBoughtBonds,registerForExchange}=require('../../../controllers/buyer/bonds/bond')
router.get('/get-bonds',middleware,getBonds)
router.get('/getBoughtBonds',buyerMiddleware,getBoughtBonds)
router.post('/registerForExchange',buyerMiddleware,registerForExchange)
module.exports=router;
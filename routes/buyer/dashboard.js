const router=require('express').Router();
const {createBuyer,switchinfluencer}=require('../../controllers/buyer/dashboard')
const {middleware}=require('../../utils/middleware')
const {buyerMiddleware}=require('../../utils/buyerMiddleware')
router.get('/create-buyer',middleware,createBuyer)
router.get('/switch-influencer',buyerMiddleware,switchinfluencer)

module.exports=router;
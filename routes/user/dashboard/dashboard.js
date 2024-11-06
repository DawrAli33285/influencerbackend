const router=require('express').Router();
const {middleware}=require('../../../utils/middleware')
const {buyerMiddleware}=require('../../../utils/buyerMiddleware')
const {dashboardData,dashboardBuyerData}=require('../../../controllers/user/dashboard/dashboard')
router.get(`/get-dashboardData`,middleware,dashboardData)
router.get(`/get-buyerdashboardData`,buyerMiddleware,dashboardBuyerData)

module.exports=router;
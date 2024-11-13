const router=require('express').Router();
const {getDashboardData }=require('../../../controllers/admin/dashboard/dashboard')

router.get('/getDashboardData',getDashboardData)


module.exports=router;
const router=require('express').Router()
const {getPayments,approvePayment,suspendPayment}=require('../../../controllers/admin/transaction/transaction')

router.get('/get-payments',getPayments)
router.patch('/suspendPayment/:id',suspendPayment)
router.patch('/approvePayment/:id',approvePayment)
module.exports=router;
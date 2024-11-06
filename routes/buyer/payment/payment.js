const router=require('express').Router();
const {buyBondCard,buyBondPaypal,payForExchangeCard,exchangePaypal}=require('../../../controllers/buyer/payment/payment')
const {buyerMiddleware}=require('../../../utils/buyerMiddleware')
router.post('/buyBondCard',buyerMiddleware,buyBondCard)
router.post('/buyBondPaypal',buyerMiddleware,buyBondPaypal)
router.post('/exchangePaypal',buyerMiddleware,exchangePaypal)
router.post('/payForExchangeCard',buyerMiddleware,payForExchangeCard)
module.exports=router;
const {createOffer,getOffers,rejectBuyerOffer,acceptBuyerOffer}=require('../../../controllers/buyer/offers/offers')
const router=require('express').Router();
const {buyerMiddleware}=require('../../../utils/buyerMiddleware')

router.post('/create-offer',buyerMiddleware,createOffer)
router.get('/getOffers',buyerMiddleware,getOffers)
router.get('/rejectBuyerOffer/:buyeroffer_id',rejectBuyerOffer)
router.get('/acceptBuyerOffer/:buyeroffer_id',buyerMiddleware,acceptBuyerOffer)
module.exports=router;
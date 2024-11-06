const router=require('express').Router();
const {middleware}=require('../../../utils/middleware')
const {bondListing,getSingleBond,acceptOffer,createBond,withoutMissions ,rejectOffer}=require('../../../controllers/user/bond/bond')
const imageMiddleware=require('../../../utils/imageMiddleware');
const { buyerMiddleware } = require('../../../utils/buyerMiddleware');
router.get('/bond-listing',middleware,bondListing)
router.post('/createBond',imageMiddleware.array('photos',10),middleware,createBond)
router.get('/bond-withoutMissions',middleware,withoutMissions)
router.get('/getSingleBond/:bond_id',getSingleBond)
router.delete('/rejectOffergetSingleBond/:bond_id/:issuer_id',middleware,rejectOffer)
router.get('/acceptOffer/:bond_id/:issuer_id',middleware,acceptOffer)
module.exports=router;
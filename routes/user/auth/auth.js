const router=require('express').Router();
const {register,getVerificationData,verifyEmailOTP,emailOTP,mobileOTP,verifyOTP,socialLogin,login}=require('../../../controllers/user/auth/auth')
const {middleware}=require('../../../utils/middleware')
router.post('/register',register)
router.post('/login',login)
router.post('/socialLogin',socialLogin)
router.post('/mobile-otp',mobileOTP)
router.post('/verifyOTP',verifyOTP)
router.post('/emailOTP',emailOTP)
router.post('/verifyEmailOTP',verifyEmailOTP)
router.get('/getVerificationData/:email',getVerificationData)

module.exports=router;
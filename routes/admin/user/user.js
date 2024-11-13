const {getUsers,deleteUser,getUser,sendEmail,editUser,sendReply}=require('../../../controllers/admin/user/user')
const imageMiddleware=require('../../../utils/imageMiddleware')
const router=require('express').Router();


router.get('/get-users',getUsers)
router.get('/getUser/:email',getUser)
router.delete('/deleteUser/:id',deleteUser)
router.patch('/editUser/:email',imageMiddleware.any(),editUser)
router.post('/sendReply',sendReply)
router.post('/sendEmail',sendEmail)

module.exports=router;
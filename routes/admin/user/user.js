const {getUsers,deleteUser,getUser,editUser}=require('../../../controllers/admin/user/user')
const imageMiddleware=require('../../../utils/imageMiddleware')
const router=require('express').Router();


router.get('/get-users',getUsers)
router.get('/getUser/:email',getUser)
router.delete('/deleteUser/:id',deleteUser)
router.patch('/editUser/:email',imageMiddleware.single('avatar'),editUser)



module.exports=router;
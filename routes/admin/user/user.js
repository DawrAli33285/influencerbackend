const {getUser}=require('../../../controllers/admin/user/user')

const router=require('express').Router();


router.get('/get-users',getUser)



module.exports=router;
const router=require('express').Router();
const {getBonds,updateBond,getBond,updateStatus,deleteBond}=require('../../../controllers/admin/bond/bond')

router.get('/get-bonds',getBonds)
router.delete('/deleteBond/:id',deleteBond)
router.patch('/update-status/:status/:id',updateStatus)
router.get('/get-bond/:id',getBond)
router.patch('/update-bond/:id',updateBond)
module.exports=router;
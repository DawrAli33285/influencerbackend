const router=require('express').Router();
const {getBonds,updateBond,cancelBond,rejectBond,rejectCancellation,getCancellations,getSingleCancellation,approveCancellationStatus,getBond,updateStatus,deleteBond}=require('../../../controllers/admin/bond/bond')

router.get('/get-bonds',getBonds)
router.delete('/deleteBond/:id',deleteBond)
router.patch('/update-status/:status/:id',updateStatus)
router.get('/get-bond/:id',getBond)
router.patch('/update-bond/:id',updateBond)
router.get('/getCancellations',getCancellations)
router.get('/getSingleCancellation/:id',getSingleCancellation)
router.get('/approveCancellationStatus/:id',approveCancellationStatus)
router.get('/cancelBond/:id',cancelBond)
router.get('/rejectCancellation/:id',rejectCancellation)
router.post('/rejectBond',rejectBond)
module.exports=router;
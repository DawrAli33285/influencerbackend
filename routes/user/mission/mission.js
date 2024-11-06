const router=require('express').Router();
const {createMission,missionList}=require('../../../controllers/user/mission/mission');
const { middleware } = require('../../../utils/middleware');

router.post('/create-mission',createMission)
router.get('/get-missionList',middleware,missionList)

module.exports=router;
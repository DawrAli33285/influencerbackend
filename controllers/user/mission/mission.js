const missionModel = require('../../../models/user/sponsorMission');
const bondModel = require('../../../models/user/sponsorBond');

module.exports.missionList = async (req, res) => {
    try {
        const bondsList = await bondModel.find({ issuer_id: req.issuerId });
        const missionPromises = bondsList.map((bond) => {
            return missionModel.find({ bond_id: bond._id }).populate('bond_id');
        });   
        const missionList = await Promise.all(missionPromises);
        return res.status(200).json({
            missionList: missionList.flat(), 
        });
    } catch (e) {
        return res.status(400).json({
            error: "Server error please try again",
        });
    }
};

module.exports.createMission=async(req,res)=>{
let {...data}=req.body;
    try{
let mission=await missionModel.create(data)
let getMission=await missionModel.findOne({_id:mission._id}).populate('bond_id')
return res.status(200).json({
    getMission
})
    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}
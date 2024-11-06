const bondModel=require('../../../models/user/sponsorBond')
const usermodel=require('../../../models/user/User')
const issuermodel=require('../../../models/user/issuer')
const levelsmodel=require('../../../models/user/levels')
const countryModel = require('../../../models/user/countryCode')
const sponsorBondModel = require('../../../models/user/sponsorBond')

const sponsorMissionModel = require('../../../models/user/sponsorMission')
const buyermodel = require('../../../models/user/buyer')

module.exports.dashboardData = async (req, res) => {
    try {

      const issuerId = req.issuerId; 
      
      const [issuer, bondList] = await Promise.all([
        issuermodel.findOne({ _id: issuerId }),
        sponsorBondModel.find({ issuer_id: issuerId })
      ]);

     

      const [user, bondGroup] = await Promise.all([
        usermodel.findOne({ _id: issuer.user_id }).populate('country_code_id'),
        sponsorBondModel.aggregate([
          { $match: { issuer_id: issuerId } },
          { $group: { _id: '$createdAt' } }
        ])
      ]);
  
      const [countrycode, level] = await Promise.all([
        countryModel.findOne({ _id: user.country_code_id }),
        levelsmodel.findOne({ _id: user.level_id })
      ]);
  
      const bondIds = bondList.map(bond => bond._id);
      const missionList = await sponsorMissionModel.find({ bond_id: { $in: bondIds } });
     
      return res.status(200).json({
        issuer,
        user,
        countrycode,
        level,
        bondList,
        missionList,
        bondGroup
      });
      
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: "Server error, please try again"
      });
    }
  };
  



  
module.exports.dashboardBuyerData = async (req, res) => {
  try {

   const buyerId=req.buyer_id
    
    const [issuer, bondList] = await Promise.all([
      buyermodel.findOne({ _id: buyerId }),
      sponsorBondModel.find({ buyer_id: buyerId })
    ]);

   

    const [user, bondGroup] = await Promise.all([
      usermodel.findOne({ _id: issuer.user_id }).populate('country_code_id'),
      sponsorBondModel.aggregate([
        { $match: { buyer_id: buyerId } },
        { $group: { _id: '$createdAt' } }
      ])
    ]);

    const [countrycode, level] = await Promise.all([
      countryModel.findOne({ _id: user.country_code_id }),
      levelsmodel.findOne({ _id: user.level_id })
    ]);

    const bondIds = bondList.map(bond => bond._id);
    const missionList = await sponsorMissionModel.find({ bond_id: { $in: bondIds } });
   
    return res.status(200).json({
      issuer,
      user,
      countrycode,
      level,
      bondList,
      missionList,
      bondGroup
    });
    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Server error, please try again"
    });
  }
};

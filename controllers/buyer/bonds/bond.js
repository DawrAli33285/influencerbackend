const buyermodel = require('../../../models/user/buyer');
const issuermodel = require('../../../models/user/issuer');
const offermodel=require('../../../models/user/offers')
const bondModel=require('../../../models/user/sponsorBond');
const missionModel=require('../../../models/user/sponsorMission')
const usermodel = require('../../../models/user/User');
const buyerOffer=require('../../../models/user/buyerOffer')

module.exports.getBonds = async (req, res) => {
    try {
      
        const missions = await missionModel.find({}, 'bond_id');
        const bondIds = missions.map(mission => mission.bond_id);

        
        const bonds = await bondModel.find({ _id: { $in: bondIds }, status: { $ne: 'IN PROGRESS' } });

       
        const offers = await offermodel.find({});
        const buyerOffers = await buyerOffer.find({});

      
        const offersByBondId = offers.reduce((acc, offer) => {
            if (!acc[offer.bond_id]) acc[offer.bond_id] = [];
            acc[offer.bond_id].push(offer);
            return acc;
        }, {});

        
        const buyerOffersByBondId = buyerOffers.reduce((acc, offer) => {
            if (!acc[offer.bond_id]) acc[offer.bond_id] = [];
            acc[offer.bond_id].push(offer);
            return acc;
        }, {});

       
        const bondsWithOffers = bonds.map(bond => ({
            ...bond.toObject(), 
            offers: offersByBondId[bond._id] || [],  
            buyerOffers: buyerOffersByBondId[bond._id] || [] 
        }));

      
        const issuer = await issuermodel.findOne({ _id: req.issuerId });
        const user = await usermodel.findOne({ _id: issuer.user_id });
        const buyer = await buyermodel.findOne({ user_id: user._id }, '_id');

        return res.status(200).json({
            bonds: bondsWithOffers,
            issuer_id: req.issuerId,
            buyer_id: buyer._id
        });
        
    } catch (e) {
        console.log(e.message)
        return res.status(400).json({
            error: "Server error please try again"
        });
    }
};


module.exports.getBoughtBonds=async(req,res)=>{
    try{
let bond=await bondModel.find({buyer_id:req.buyer_id,status:{$ne:"WAITING FOR EXCHANGE"}})
return res.status(200).json({
    bond
})
  }catch(e){
return res.status(400).json({
    message:"Server error please try again"
})
  }
}



module.exports.registerForExchange=async(req,res)=>{
    let {...data}=req.body;

       const validityString = data.validity_number;
       const monthsMatch = validityString.match(/\d+/); 
   
       let validityMonths = monthsMatch ? parseInt(monthsMatch[0], 10) : null;

try{
    let bond=await bondModel.findOne({_id:data.bond_id})
    bond=bond.toObject();

  
    if(bond.total_bonds==1){

   await bondModel.deleteOne({_id:bond._id})

let newbond=await bondModel.create({
bond_price:data.bond_price,
total_bonds:data.total_bonds,
status:"WAITING FOR EXCHANGE",
buyer_id:req.buyer_id,
bond_issuerance_amount:data.bond_issuerance_amount,
title:bond.title,
photos:bond.photos,
social_media_links:data.social_media_links,
validity_number:validityMonths,
issuer_id:bond.issuer_id
})
newbond=newbond.toObject();
await missionModel.updateOne({bond_id:bond._id},{$set:{
status:"NOT STARTED",
bond_id:newbond._id
}})
await buyerOffer.create({
    bond_id:newbond._id,
    issuer_id:bond.issuer_id,
    price:data.bond_price,
    number_of_bonds:newbond.total_bonds,
    status:"PENDING",
    oldbuyer_id:bond.buyer_id,
   
})

    }else{
        if((parseInt(bond?.total_bonds)-parseInt(data.quantity))==0){
await bondModel.deleteOne({_id:data.bond_id})
        }else{
            await bondModel.updateOne({_id:data.bond_id},{$set:{
                total_bonds:bond?.total_bonds-data.quantity,
            }})
        }
       
      let newbond=await bondModel.create({
        bond_price:data.bond_price,
        total_bonds:data.total_bonds,
        status:"WAITING FOR EXCHANGE",
        buyer_id:req.buyer_id,
        bond_issuerance_amount:data.bond_issuerance_amount,
        title:bond.title,
        photos:bond.photos,
        social_media_links:data.social_media_links,
        validity_number:validityMonths,
        issuer_id:bond.issuer_id
        })
        newbond=newbond.toObject();
    
await missionModel.updateOne({bond_id:bond._id},{$set:{
    status:"NOT STARTED",
    bond_id:newbond._id
}})
await buyerOffer.create({
    bond_id:newbond._id,
    issuer_id:bond.issuer_id,
    price:data.bond_price,
    number_of_bonds:newbond.total_bonds,
    status:"PENDING",
    oldbuyer_id:bond.buyer_id,
   
})



    }

return res.status(200).json({
    message:"SUCESS"
})
}catch(e){
    console.log(e.message)
    return res.status(400).json({
        error:"Server error please try again"
    })
}
}
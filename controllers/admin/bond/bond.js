let bondModel=require('../../../models/user/sponsorBond');
const sponsorMissionModel = require('../../../models/user/sponsorMission');
const transactionModel = require('../../../models/user/transaction');
const issuerModel=require('../../../models/user/issuer')

module.exports.getBonds=async(req,res)=>{
    try{
        let bonds = await bondModel.find({}).populate({
            path: "issuer_id", 
            populate: {
                path: "user_id", 
                model: "user" 
            }
        });
        
return res.status(200).json({
    bonds
})
    }catch(e){
        console.log(e.message)
return res.status(400).json({
    error:"Server error please try again"
})
    }
}



module.exports.deleteBond=async(req,res)=>{
    let {id}=req.params;
    try{
await Promise.all([
    bondModel.deleteOne({_id:id}),
  sponsorMissionModel.deleteOne({bond_id:id})
])


return res.status(200).json({
    message:"Bond deleted sucessfully"
})
    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}


module.exports.updateStatus=async(req,res)=>{
    let {status,id}=req.params;
    try{
await bondModel.updateOne({_id:id},{$set:{
    status
}})
return res.status(200).json({
    message:"Status updated successfully"
})
    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}


module.exports.getBond=async(req,res)=>{
    let {id}=req.params;
    try{
let bond=await bondModel.findOne({_id:id}).populate({
    path:"issuer_id",
    populate:{
        path:"user_id",
        model:'user'
    }
})

let mission=await sponsorMissionModel.findOne({bond_id:id})
let transaction=await transactionModel.findOne({bond_id:id})
let issuers=await issuerModel.find({}).populate('user_id')
return res.status(200).json({
    bond,
    mission,
    transaction,
    issuers

})
    }catch(e){
return res.status(400).json({
    error:"Server error please try again"
})
    }
}


module.exports.updateBond=async(req,res)=>{
    let {id}=req.params;
    try{
        let data = { ...req.body };

        
        let bond = await bondModel.findOneAndUpdate(
            { _id: id },
            { $set: data },
            { new: true }
        );
      
        let mission = await sponsorMissionModel.findOneAndUpdate(
            { bond_id: id },
            { $set: data },
            { new: true }
        );
        
        return res.status(200).json({
            message: "Bond updated successfully",
            bond,
            mission
        });
        
    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}
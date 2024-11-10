const bondModel=require('../../../models/user/sponsorBond')
const fs=require('fs')
const path=require('path')
const filemodel = require('../../../models/user/fileObject')
const documentmodel = require('../../../models/user/documents')
const missionModel=require('../../../models/user/sponsorMission')
const sponsorMissionModel = require('../../../models/user/sponsorMission')
const offersModel=require('../../../models/user/offers')
const cancellationmodel = require('../../../models/user/cancellation')
module.exports.bondListing=async(req,res)=>{
    try{
let bondsList=await bondModel.find({issuer_id:req.issuerId})

return res.status(200).json({
    bondsList
})
    }catch(e){
return res.status(400).json({
    error:"Server error please try again"
})
    }
}

module.exports.withoutMissions = async (req, res) => {
    try {
        let bonds = await bondModel.find({ issuer_id: req.issuerId });
        let bondIds = bonds.map(bond => bond._id);
        let missionBonds = await sponsorMissionModel.find({ bond_id: { $in: bondIds } });
        let missionBondIds = missionBonds.map(mission => mission.bond_id);
       
        let bondsWithoutMissions = await bondModel.find({ _id: { $nin: missionBondIds, $in: bondIds } });

        
        return res.status(200).json({
            bondsList: bondsWithoutMissions
        });
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({
            error: "Server error, please try again."
        });
    }
};



module.exports.createBond = async (req, res) => {
    let { ...data } = req.body;
console.log(data)
    data.issuer_id = req.issuerId;
    data.bond_issuerance_amount=data.quantity*data.bond_price;
 data.total_bonds=data.quantity;
    try {
        let bondPhotosFolder = "issuerPhotos";
        let photos = [];

 
        const bondPhotosDir = path.resolve(__dirname,'../../../', bondPhotosFolder); // Adjust the path accordingly
        let exists=fs.existsSync(bondPhotosDir)
      
        
       if(!exists){
           let created=fs.mkdirSync(bondPhotosDir, { recursive: true });
       
        }
        let filesPromise = req.files.map(async (file, i) => {
            let fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.originalname}`;
          
            let bondPhotosPath = path.join(bondPhotosDir, fileName);
            fs.writeFileSync(bondPhotosPath, file.buffer);
            let fileRecord = await filemodel.create({
                file_path: bondPhotosPath,
                folder_name: bondPhotosFolder
            });
            await documentmodel.create({
                file_path_id: fileRecord._id
            });

            photos.push(bondPhotosPath);
        });
        await Promise.all(filesPromise);
        data.photos = photos;
       let bond= await bondModel.create(data);
       console.log(bond)
        return res.status(200).json({
            message: "Bond created successfully"
        });

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({
            error: "Server error, please try again"
        });
    }
};

module.exports.getSingleBond=async(req,res)=>{

    let {bond_id}=req.params;

    try{
       
let bond=await bondModel.findOne({_id:bond_id})

let mission=await missionModel.findOne({bond_id})
let offer=await offersModel.findOne({bond_id:bond._id})


return res.status(200).json({
    bond,
    offer,
    mission
})

    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}


module.exports.rejectOffer=async(req,res)=>{
    let {bond_id,issuer_id}=req.params;

    if(issuer_id!=req.issuerId){
        return res.status(400).json({
            error:"Please login to your issuer account"
        })
    }
    

    try{
       
let bond=await bondModel.updateOne({_id:bond_id},{status:"PENDING"},{new:true})
let offer=await offersModel.deleteOne({bond_id})
return res.status(200).json({
  message:"Offer rejected sucessfully"
})
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}


module.exports.acceptOffer=async(req,res)=>{
    let {bond_id,issuer_id}=req.params;

if(issuer_id!=req.issuerId){
    return res.status(400).json({
        error:"Please login to your issuer account"
    })
}

    try{
        let bond=await bondModel.updateOne({_id:bond_id},{status:"AWAITING FOR PAYMENT"},{new:true})
        let offer=await offersModel.updateOne({bond_id},{status:"ACCEPTED"})
        return res.status(200).json({
          message:"Offer accepted sucessfully"
        })
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}





module.exports.cancellBond=async(req,res)=>{
    let {...data}=req.body;
    try{
        data={
            ...data,
            buyer_id:req.buyer_id
        }

let pending=await cancellationmodel.findOne({bond_id:data.bond_id,buyer_id:req.buyer_id})
if(pending){
    return res.status(400).json({
        error:"Cancellation request already pending"
    })
}



await cancellationmodel.create(data)

return res.status(200).json({
message:"cancellation request sent sucessfully"
})
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}


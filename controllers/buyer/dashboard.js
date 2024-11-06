let buyerModel=require('../../models/user/buyer')
let issuerModel=require('../../models/user/issuer')
let jwt=require('jsonwebtoken')
module.exports.createBuyer = async (req, res) => {
    try {
        let issuer = await issuerModel.findOne({ _id: req.issuerId });

        if (!issuer) {
            return res.status(400).json({
                error: "Issuer not found"
            });
        }

        let buyerFound = await buyerModel.findOne({ user_id: issuer.user_id });

        if (buyerFound) {
            let buyerid=buyerFound._id
            buyerFound=buyerFound.toObject()
     
            let token = await jwt.sign({id:buyerid}, process.env.JWT_BUYER); 
            return res.status(200).json({
                buyerToken:token,
                influencer: false
            });
        }

        let buyer = await buyerModel.create({
            user_id: issuer.user_id,
            social_media_id: issuer.social_media_id,
            profile_img_id: issuer.profile_img_id
        });
        let buyerid=buyer._id

        let token = await jwt.sign({id:buyerid}, process.env.JWT_BUYER); 

        return res.status(200).json({
            buyerToken:token,
            influencer: false
        });

    } catch (e) {
        console.log(e.message);
        return res.status(400).json({
            error: "Server error please try again"
        });
    }
};


module.exports.switchinfluencer=async(req,res)=>{

    try{
        let buyer=await buyerModel.findOne({_id:req.buyer_id})
        console.log(buyer)
        console.log("HI")
let issuer=await issuerModel.findOne({user_id:buyer.user_id})
console.log(issuer)
if(!issuer){
    return res.status(400).json({
        error:"Influencer not found"
    })
}
issuer=issuer.toObject();
let token=await jwt.sign(issuer,process.env.JWT_KEY)
return res.status(200).json({
    token,
    influencer: true
}
)
    }catch(e){
        console.log(e.message)
   return res.status(400).json({
    error:"Server error please try again"
   })     
    }
}
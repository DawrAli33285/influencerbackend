const issuermodel = require('../../../models/user/issuer');
const offermodel=require('../../../models/user/offers')
const bondModel=require('../../../models/user/sponsorBond');
const usermodel = require('../../../models/user/User');
const buyerOfferModel=require('../../../models/user/buyerOffer');
const buyermodel = require('../../../models/user/buyer');
const eeClient = require('elasticemail-webapiclient').client;

module.exports.createOffer=async(req,res)=>{
let {...data}=req.body;


let bond=await bondModel.findOne({_id:data.bond_id})

let issuer=await issuermodel.findOne({_id:bond.issuer_id})
let user=await usermodel.findOne({_id:issuer.user_id})
const options = {
    apiKey: process.env.ELASTIC_API_KEY,
    apiUri: 'https://api.elasticemail.com/',
    apiVersion: 'v2'
}
 
    try{
if(data?.oldbuyer_id?.length>0){
    let buyer=await buyermodel.findOne({_id:data.oldbuyer_id})
    let userBuyer=await usermodel.findOne({_id:buyer.user_id})
    data={
        ...data,
        number_of_bonds:bond.total_bonds,
        newbuyer_id:req.buyer_id,
        status:"PENDING"
    }
    await buyerOfferModel.create(data)


}else if(data?.oldbuyer_id?.length>0 && data?.price>(bond?.bond_price*bond?.total_bonds)){
    let buyer=await buyermodel.findOne({_id:data.oldbuyer_id})
    let userBuyer=await usermodel.findOne({_id:buyer.user_id})
    data={
        ...data,
        number_of_bonds:bond.total_bonds,
        newbuyer_id:req.buyer_id,
        status:"AWAITING FOR PAYMENT"
    }
    await buyerOfferModel.create(data)



    const EE = new eeClient(options);
     
    EE.Account.Load().then(function(resp) {
        
    });
    
    const emailParams = {
        "subject": `Offer Awaiting Payment Of Bond: ${bond.title}`,
        "to": `${userBuyer.email}`,
        "from": process.env.EMAIL,
        "body": `
        Hello ${userBuyer.username},
    
    We are pleased to inform you that you have received a new offer on your bond titled ${bond.title}.
    
    Offer Details:
    
    Price Offered: ${data.price}
    Quantity Requested: ${data.number_of_bonds}
    The buyer has expressed interest in purchasing ${data.number_of_bonds} unit(s) at the price of ${data.price} per unit.
   The Bond is awaiting payment
    If you have any questions or would like to proceed with this offer, please log in to your account or contact our support team for assistance.
    
    Thank you for using our platform!
    
    Best regards,
    Sponsor Bond Team
        
        `,
          "fromName": 'Sponsor bond',
        "bodyType": 'Plain'
    };
     
    
    EE.Email.Send(emailParams)
    .catch((err) => {
        return res.status(400).json({
            error:"Error sending email please try again"
        })
    });
    let bondUpdate=await bondModel.updateOne({_id:data.bond_id},{status:"AWAITING FOR PAYMENT"})

 
}else{
    data={
        ...data,
        buyer_id:req.buyer_id
    }
    await offermodel.create(data)

const EE = new eeClient(options);
 
EE.Account.Load().then(function(resp) {
    
});

const emailParams = {
    "subject": `Offer Received for Bond: ${bond.title}`,
    "to": `${user.email}`,
    "from": process.env.EMAIL,
    "body": `
    Hello ${user.username},

We are pleased to inform you that you have received a new offer on your bond titled ${bond.title}.

Offer Details:

Price Offered: ${data.price}
Quantity Requested: ${data.number_of_bonds}
The buyer has expressed interest in purchasing ${data.number_of_bonds} unit(s) at the price of ${data.price} per unit.
Please go to this page and accept or reject the offer https://influencer-frontend.uc.r.appspot.com/influenceroffer?bond_id=${data.bond_id}
If you have any questions or would like to proceed with this offer, please log in to your account or contact our support team for assistance.

Thank you for using our platform!

Best regards,
Sponsor Bond Team
    
    `,
      "fromName": 'Sponsor bond',
    "bodyType": 'Plain'
};
 

EE.Email.Send(emailParams)
.catch((err) => {
    return res.status(400).json({
        error:"Error sending email please try again"
    })
});

let bondUpdate=await bondModel.updateOne({_id:data.bond_id},{status:"OFFER PENDING"})

}

return res.status(200).json({
    message:"offer sent sucessfully"
})
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}




module.exports.getOffers=async(req,res)=>{
   try{
    let buyer=await buyermodel.findOne({_id:req.buyer_id})
    let user=await usermodel.findOne({_id:buyer.user_id})
    let issuer=await issuermodel.findOne({user_id:user._id})
    let offers = await buyerOfferModel.find({
        oldbuyer_id: { $ne: req.buyer_id },
        issuer_id: { $ne: issuer._id },
        status: { $ne: 'ACCEPTED' },
        rejectedBY: { $nin: [req.buyer_id] } 
    }).populate('bond_id');
    console.log("OFFERS")
    
console.log(offers)
 return res.status(200).json({
    offers
 })
   }catch(e){
    console.log(e.message)
    return res.status(400).json({
        error:"Server error please try agian"
    })
   } 
}







module.exports.rejectBuyerOffer=async(req,res)=>{
    let {buyeroffer_id}=req.params;

    try{
let offer = await buyerOfferModel.updateOne(
    { _id: buyeroffer_id },
    {
        $set: {
            status: 'REJECTED',
        },
        $push: {
            rejectedBY: req.buyer_id
        }
    }
);

return res.status(200).json({
  message:"Offer rejected sucessfully"
})
    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}


module.exports.acceptBuyerOffer=async(req,res)=>{
    let {buyeroffer_id}=req.params;
    
    try{
         
         const updatedOffer = await buyerOfferModel.findOneAndUpdate(
            { _id: buyeroffer_id },
            { $set: { status: "ACCEPTED" ,newbuyer_id:req.buyer_id} },
            { new: true } 
        );

        if (!updatedOffer) {
            return res.status(404).json({ error: "Offer not found" });
        }

       
        const updatedBond = await bondModel.findOneAndUpdate(
            { _id: updatedOffer.bond_id },
            { $set: { status: "AWAITING FOR PAYMENT" } },
            { new: true } 
        );

        if (!updatedBond) {
            return res.status(404).json({ error: "Bond not found" });
        }

        return res.status(200).json({
            message: "Offer accepted successfully",
            
        });
    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}
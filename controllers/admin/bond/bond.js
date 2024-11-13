let bondModel=require('../../../models/user/sponsorBond');
const sponsorMissionModel = require('../../../models/user/sponsorMission');
const transactionModel = require('../../../models/user/transaction');
const issuerModel=require('../../../models/user/issuer')
const cancellationmodel=require('../../../models/user/cancellation');
const buyermodel = require('../../../models/user/buyer');
const eeClient = require('elasticemail-webapiclient').client;


module.exports.getBonds=async(req,res)=>{
    try{
 
let bonds = await bondModel.find({ status: 'PENDING' }).populate({
    path: "issuer_id",
    populate: {
        path: "user_id",
        model: "user"
    }
});


const bondIds = bonds.map(bond => bond._id);


let missions = await sponsorMissionModel.find({ bond_id: { $in: bondIds } });


const bondIdsWithMissions = new Set(missions.map(mission => mission.bond_id.toString()));


const bondsWithMissions = bonds.filter(bond => bondIdsWithMissions.has(bond._id.toString()));


return res.status(200).json({
    bonds: bondsWithMissions
});


     
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
  sponsorMissionModel.deleteOne({bond_id:id}),
  transactionModel.updateMany({bond_id:id},{$set:{
    status:"REJECTED"
  }})
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
let transaction=await transactionModel.find({bond_id:id}).populate({
    path:"bond_id",
    populate:{
        path:"issuer_id",
       populate:{
        path:'user_id',
        model:'user'
       }
    }
})
console.log(transaction)

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

module.exports.getCancellations=async(req,res)=>{
    try{
        let cancellationRates = await cancellationmodel.find({})
    .populate({
        path: "bond_id",
        model: "sponsor_bonds", 
        populate: {
            path: "issuer_id",
            model: "issuerr", 
            populate: {
                path: "user_id",
                model: "user" 
            }
        }
    }).populate({
        path:"buyer_id",
        model:"buyer",
        populate:{
            path:"user_id",
            model:"user"
        }
    });

return res.status(200).json({
    cancellationRates
})

    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}

module.exports.getSingleCancellation=async(req,res)=>{
let {id}=req.params;
    try{
        let cancellation = await cancellationmodel.findOne({ _id: id }).populate({
            path: "bond_id",
            model: "sponsor_bonds",
            populate: {
                path: "issuer_id",
                model: "issuerr",
                populate: {
                    path: "user_id",
                    model: "user",
                    populate: {
                        path: "country_code_id",
                        model: "country_code"
                    }
                }
            }
        });
        
        let transactions=await transactionModel.find({bond_id:cancellation.bond_id._id}).populate("payment_method_id").populate("bond_id")
        return res.status(200).json({
            cancellation,
            transactions
        })

    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}


module.exports.approveCancellationStatus=async(req,res)=>{
    let {id}=req.params;
    try{
await cancellationmodel.updateOne({_id:id},{$set:{
    status:"APPROVED"
}})

return res.status(200).json({
    message:"Status updated sucessfully"
})

    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}


module.exports.rejectCancellation=async(req,res)=>{
    let {id}=req.params;
try{
let cancellation=await cancellationmodel.updateOne({_id:id},{$set:{
    status:"REJECTED"
}})
return res.status(200).json({
    message:"Cancellation request rejected sucessfully"
})
}catch(e){
    console.log(e.message)
    return res.status(400).json({
        error:"Server error please try again"
    })
}
}



module.exports.cancelBond=async(req,res)=>{
let {id}=req.params;
    try{
        const options = {
            apiKey: process.env.ELASTIC_API_KEY,
            apiUri: 'https://api.elasticemail.com/',
            apiVersion: 'v2'
        }

        let cancellation = await cancellationmodel.findOne({ _id: id }).populate({
            path: "bond_id",
            model: "sponsor_bonds",
            populate: {
                path: "issuer_id",
                model: "issuerr",
                populate: {
                    path: "user_id",
                    model: "user",
                }
            }
        })
        let buyer=await buyermodel.findOne({_id:cancellation.buyer_id}).populate('user_id')
        

await bondModel.updateOne({_id:cancellation.bond_id._id},{$set:{
    status:"CANCELLED"
}})

await cancellationmodel.updateOne({_id:id},{$set:{
    status:"APPROVED"
}})


const EE = new eeClient(options);
     
    EE.Account.Load().then(function(resp) {
        
    });
    
    const emailParams = {
        "subject": `Cancellation Request for Your Bond:${cancellation?.bond_id?.title} `,
        "to": `${cancellation?.bond_id?.issuer_id?.user_id?.email}`,
        "from": process.env.EMAIL,
        "body": `
        Hello ${cancellation?.bond_id?.issuer_id?.user_id?.username},
    
        We regret to inform you that a cancellation request has been made for your bond titled ${cancellation?.bond_id?.title}.
    
        Cancellation Details:
    
        Reason for Cancellation: ${cancellation?.reason}
        Description: ${cancellation?.description}
        The bond is now marked as cancelled, and any actions required from your side will be notified accordingly.
    
        If you have any questions or require further clarification, please feel free to log in to your account or contact our support team for assistance.
    
        We apologize for any inconvenience caused and appreciate your understanding.
    
        Thank you for using our platform!
    
        Best regards,
        Sponsor Bond Team
        `,
        "fromName": 'Sponsor Bond',
        "bodyType": 'Plain'
    };

    const emailParamsBuyer = {
        "subject": `Cancellation Request for Your Bond: ${cancellation?.bond_id?.title}`,
        "to": `${buyer?.user_id?.email}`,
        "from": process.env.EMAIL,
        "body": `
        Hello ${buyer?.user_id?.username},
    
        We regret to inform you that your request to cancel the bond titled "${cancellation?.bond_id?.title}" has been successfully processed.
    
        Cancellation Details:
    
        - **Reason for Cancellation**: ${cancellation?.reason}
        - **Description**: ${cancellation?.description}
    
        The bond has now been marked as cancelled. Any further actions required from your side will be communicated to you accordingly.
    
        If you have any questions or need further clarification, please log in to your account or reach out to our support team for assistance.
    
        We apologize for any inconvenience caused and appreciate your understanding.
    
        Thank you for using our platform!
    
        Best regards,
        Sponsor Bond Team
        `,
        "fromName": 'Sponsor Bond',
        "bodyType": 'Plain'
    };
    
    
    EE.Email.Send(emailParams)
    .catch((err) => {
        return res.status(400).json({
            error:"Error sending email please try again"
        })
    });

    EE.Email.Send(emailParamsBuyer)
    .catch((err) => {
        return res.status(400).json({
            error:"Error sending email please try again"
        })
    });



return res.status(200).json({
    message:"Bond cancelled sucessfully"
})
    }catch(e){
        
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}




module.exports.rejectBond=async(req,res)=>{
    let {...data}=req.body;

    try{
        await bondModel.updateOne({_id:data.bond_id},{$set:{
            status:"REJECTED"
        }})
        
await sponsorMissionModel.updateOne({bond_id:data.bond_id},{$set:{
    status:data.status
}})

const options = {
    apiKey: process.env.ELASTIC_API_KEY,
    apiUri: 'https://api.elasticemail.com/',
    apiVersion: 'v2'
}



const EE = new eeClient(options);
     
    EE.Account.Load().then(function(resp) {
        
    });
    
    const emailParams = {
        "subject": `Rejection Request for Your Bond:${data?.title}`,
        "to": `${data.email}`,
        "from": process.env.EMAIL,
        "body": `
       The bond has been rejected and is not purchasable

        If you have any questions or require further clarification, please feel free to log in to your account or contact our support team for assistance.
    
        We apologize for any inconvenience caused and appreciate your understanding.
    
        Thank you for using our platform!
    
        Best regards,
        Sponsor Bond Team
        `,
        "fromName": 'Sponsor Bond',
        "bodyType": 'Plain'
    };



    EE.Email.Send(emailParams)
    .catch((err) => {
        return res.status(400).json({
            error:"Error sending email please try again"
        })
    });

return res.status(200).json({
    message:"Sponsor bond rejected sucessfully"
})


    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}
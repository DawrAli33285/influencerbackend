const stripe = require('stripe')("sk_test_51QGEijKlyiNy12v1RgT7rmtE8zTcK7kWI4W6APJhpRZVLUaJbFSLJoohCWIQobGD45RizMy0gg5vi1RNh9GWsySl00IqrR47GJ");
const issuermodel = require('../../../models/user/issuer');
const offermodel=require('../../../models/user/offers')
const bondModel=require('../../../models/user/sponsorBond');
const usermodel = require('../../../models/user/User');
const paymentMethodModel=require('../../../models/user/paymentMethod')
const transactionModel=require('../../../models/user/transaction')
const buyerModel=require('../../../models/user/buyer')
const buyerOffer=require('../../../models/user/buyerOffer')
const missionModel=require('../../../models/user/sponsorMission')
module.exports.buyBondCard=async(req,res)=>{

    let {...data}=req.body;

    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: data.amount*100,
            currency: 'usd',
            payment_method:data.card,
            return_url:'http://localhost:3000/buyerDashboard',
           confirm:true
          });
        
          

        let bondfind=await bondModel.findOne({_id:data.bond_id})
        let mission=await missionModel.findOne({bond_id:bondfind._id})
        mission=mission.toObject();
        bondfind=bondfind.toObject();
       

        if((bondfind.total_bonds-data.no_of_bonds)==0){
            await bondModel.deleteOne({_id:data.bond_id})
            }else{
                await bondModel.findOneAndUpdate({_id:data.bond_id},{$set:{
                    status:"IN PROGRESS",
                    total_bonds: parseInt(bondfind.total_bonds) - parseInt(data.no_of_bonds),
                    bond_issuerance_amount:(bondfind.total_bonds-data.no_of_bonds)*bondfind.bond_price,
                    status:"PENDING"
                }})
            }
     

       await offermodel.updateOne({_id:data?.offer_id},{$set:{
        status:"APPROVED"
       }})

   let paymentMethod=await paymentMethodModel.create({
        card:data.card,
        method_name:"STRIPE"
      })
      let buyer=await buyerModel.findOne({_id:req.buyer_id})
      console.log("BOND_ID")
      console.log(data.bond_id)
      await transactionModel.create({
        payment_method_id:paymentMethod?.id,
        no_of_bonds:data.no_of_bonds,
        bond_id:data.bond_id,
        amount:data.amount,
        status:"SUCESS",
        user_id:buyer.user_id

      })
      const { _id: bondfindId, ...bondfindWithoutId } = bondfind;
      const { _id: missionId, ...missionWithoutId } = mission;
      let bondData={
        ...bondfindWithoutId,
        buyer_id:req.buyer_id,
        total_bonds: parseInt(data.no_of_bonds),
         bond_issuerance_amount:parseInt(data.no_of_bonds)*parseFloat(data.amount),
        bond_price:data.amount,
       
        status:"IN PROGRESS"
    }


 let newbond=   await bondModel.create(bondData)
 let missionData={
    ...missionWithoutId,
    bond_id:newbond._id

}

await missionModel.create(missionData)
      return res.status(200).json({
        message:"SUCCESS"
    })
  

    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}


module.exports.buyBondPaypal=async(req,res)=>{
 let {...data}=req.body;

    try{
        let bondfind=await bondModel.findOne({_id:data.bond_id})
        let mission=await missionModel.findOne({bond_id:bondfind._id})
   
        bondfind=bondfind.toObject();
        
        
       
        mission=mission.toObject();

        

if((bondfind.total_bonds-data.number_of_bonds)==0){
await bondModel.deleteOne({_id:data.bond_id})
}else{
    await bondModel.findOneAndUpdate({_id:data.bond_id},{$set:{
        status:"IN PROGRESS",
        total_bonds: parseInt(bondfind.total_bonds) - parseInt(data.number_of_bonds),
        status:"PENDING",
        bond_issuerance_amount:(bondfind.total_bonds-data.number_of_bonds)*bondfind.bond_price
    }})
}

 
        
        await offermodel.updateOne({_id:data?.offer_id},{$set:{
            status:"APPROVED"
           }})

   let paymentMethod=await paymentMethodModel.create({
        paypal:data.paypal,
        method_name:"PAYPAL"
      })
let buyer=await buyerModel.findOne({_id:req.buyer_id})

      await transactionModel.create({
        payment_method_id:paymentMethod?.id,
        no_of_bonds:data.number_of_bonds,
        bond_id:data.bond_id,
        amount:data.amount,
        status:"SUCESS",
        user_id:buyer.user_id

      })
        
      const { _id: bondfindId, ...bondfindWithoutId } = bondfind;
      const { _id: missionId, ...missionWithoutId } = mission;
      let bondData={
        ...bondfindWithoutId,
        buyer_id:req.buyer_id,
         status:"IN PROGRESS",
        bond_price:data.amount,
        total_bonds: parseInt(data.number_of_bonds),
        bond_issuerance_amount:parseInt(data.number_of_bonds)*parseFloat(data.amount),
    }
  let newbond=await bondModel.create(bondData)
  let missiondata={
    ...missionWithoutId,
    bond_id:newbond._id
  }
  await missionModel.create(missiondata) 

        return res.status(200).json({
            message:"SUCCESS"
        })

    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}








module.exports.payForExchangeCard=async(req,res)=>{

    let {...data}=req.body;

    try{
       
        // let oldbuyer=await buyerModel.findOne({_id:data.buyer_id})
    //     let transaction = await transactionModel.findOne({ user_id: oldbuyer.user_id })
    //     .sort({ createdAt: -1 });
    //  let oldBuyerPaymentMethod=await paymentMethodModel.findOne({_id:transaction.payment_method_id})    
    //  let buyerCardNumber=oldBuyerPaymentMethod.card;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: data.amount*100,
            currency: 'usd',
            payment_method:data.card,
            return_url:'http://localhost:3000/buyerDashboard',
           confirm:true
          });
        
            await bondModel.findOneAndUpdate({_id:data.bond_id},{$set:{
            status:"IN PROGRESS",
            buyer_id:req.buyer_id
        }})

       await buyerOffer.updateOne({bond_id:data.bond_id,status:"AWAITING FOR PAYMENT"},{$set:{
        status:"APPROVED"
       }})

   let paymentMethod=await paymentMethodModel.create({
        card:data.card,
        method_name:"STRIPE"
      })
      let buyer=await buyerModel.findOne({_id:req.buyer_id})
      await transactionModel.create({
        payment_method_id:paymentMethod?.id,
        bond_id:data.bond_id,
        no_of_bonds:data.no_of_bonds,
        amount:data.amount,
        status:"SUCESS",
        user_id:buyer.user_id
      })

      return res.status(200).json({
        message:"SUCCESS"
    })

    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}




module.exports.exchangePaypal=async(req,res)=>{
    let {...data}=req.body;
 
       try{
           await bondModel.findOneAndUpdate({_id:data.bond_id},{$set:{
               status:"IN PROGRESS",
               buyer_id:req.buyer_id
           }})
    
           await bondModel.findOneAndUpdate({_id:data.bond_id},{$set:{
            status:"IN PROGRESS",
            buyer_id:req.buyer_id
        }})

       await buyerOffer.updateOne({bond_id:data.bond_id,status:"AWAITING FOR PAYMENT"},{$set:{
        status:"APPROVED"
       }})
   
      let paymentMethod=await paymentMethodModel.create({
           paypal:data.paypal,
           method_name:"PAYPAL"
         })
   let buyer=await buyerModel.findOne({_id:req.buyer_id})
   
         await transactionModel.create({
           payment_method_id:paymentMethod?.id,
           no_of_bonds:data.no_of_bonds,
           amount:data.amount,
           status:"SUCESS",
           bond_id:data.bond_id,
           user_id:buyer.user_id
   
         })
           
           return res.status(200).json({
               message:"SUCCESS"
           })
   
       }catch(e){
           console.log(e.message)
           return res.status(400).json({
               error:"Server error please try again"
           })
       }
   }
   
   
   
   
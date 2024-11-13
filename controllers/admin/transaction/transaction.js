let transactionModel=require('../../../models/user/transaction')
let paymentMethodModel=require('../../../models/user/paymentMethod')

module.exports.getPayments=async(req,res)=>{
    try{
        let transactions = await transactionModel.find({  })
        .populate('payment_method_id')
        .populate('bond_id');

return res.status(200).json({
    transactions
});
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}

module.exports.suspendPayment=async(req,res)=>{
    let {id}=req.params;
    try{
await transactionModel.updateOne({_id:id},{$set:{
    status:"REJECTED"
}})
return res.status(200).json({
    message:"Transaction rejected sucessfully"
})
    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}

module.exports.approvePayment=async(req,res)=>{
    let {id}=req.params;
    console.log(id)
    try{
        await transactionModel.updateOne({_id:id},{$set:{
            status:"SUCESS"
        }})
        return res.status(200).json({
            message:"Transaction rejected sucessfully"
        })
    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}
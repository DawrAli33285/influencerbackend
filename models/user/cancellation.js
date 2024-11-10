const mongoose=require('mongoose')
const cancellationSchema=mongoose.Schema({
    reason:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    bond_id:{
        type:mongoose.Schema.ObjectId,
        ref:'sponsor_bonds'
    },
    buyer_id:{
    type:mongoose.Schema.ObjectId,
    ref:'buyer'     
    },
    status:{
        type:String,
        enum:["PENDING","CANCELLED","APPROVED","REJECTED"]
    }
},{
    timestamps:true
}) 


const cancellationmodel=mongoose.model('cancellation',cancellationSchema)
module.exports=cancellationmodel
const mongoose=require('mongoose')
const offersSchema=mongoose.Schema({
    bond_id:{
        type:mongoose.Schema.ObjectId,
        ref:'sponsor_bonds'
    },
    buyer_id:{
        type:mongoose.Schema.ObjectId,
        ref:'buyer'
    },
    issuer_id:{
        type:mongoose.Schema.ObjectId,
        ref:'issuerr'
    },
    price:{
        type:Number,
        required:true
    },
    number_of_bonds:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["APPROVED","PENDING","REJECTED"]
    }
},{timestamps:true})

const offermodel=mongoose.model('offers',offersSchema)
module.exports=offermodel;
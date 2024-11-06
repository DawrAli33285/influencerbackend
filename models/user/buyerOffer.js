const mongoose=require('mongoose')
const offersSchema=mongoose.Schema({
    bond_id:{
        type:mongoose.Schema.ObjectId,
        ref:'sponsor_bonds',
        required:true
    },
    oldbuyer_id:{
        type:mongoose.Schema.ObjectId,
        ref:'buyer',
        required:true
    },
    newbuyer_id:{
                type:mongoose.Schema.ObjectId,
        ref:'buyer',
      
    },
    issuer_id:{
        type:mongoose.Schema.ObjectId,
        ref:'issuerr',
        required:true
    },
    price:{
        type:Number,
        required:true,
        required:true
    },
    number_of_bonds:{
        type:Number,
        required:true,
    },
    rejectedBY:[
{
type:mongoose.Schema.ObjectId,
ref:'buyer'
}
    ],
    status:{
        type:String,
        enum:["APPROVED","PENDING","REJECTED"],
        default:"PENDING"
    }
},{timestamps:true})

const offermodel=mongoose.model('buyer_offer',offersSchema)
module.exports=offermodel;
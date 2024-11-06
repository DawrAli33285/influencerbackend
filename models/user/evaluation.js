const mongoose=require('mongoose')

const evaluationSchema=mongoose.Schema({
    buyer_id:{
        type:mongoose.Schema.ObjectId,
        ref:'buyer'
    },
    issuer_id:{
        type:mongoose.Schema.ObjectId,
        ref:'issuerr'
    },
    bond_id:{
        type:mongoose.Schema.ObjectId,
        ref:'sponsor_bonds'
    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{timestamps:true})


const evaluationModel=mongoose.model('evaluation',evaluationSchema)
module.exports=evaluationModel
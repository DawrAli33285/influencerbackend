const mongoose=require('mongoose')

const sponsorBondSchema=mongoose.Schema({
    issuer_id:{
        type:mongoose.Schema.ObjectId,
        ref:'issuerr',
        required:true
    },
    evaluation_id:{
type:mongoose.Schema.ObjectId,
ref:'evaluation'
    },
    title:{
type:String,
required:true
    },
    photos:[{
        type:String,
        required:true
    }], 
    social_media_links:[
        {
            type:String,
            required:true
        }
    ],
    buyer_id:{
        type:mongoose.Schema.ObjectId,
        ref:'buyer',
        
    },
    bond_price:{
        type:Number
    },
    total_bonds:{
        type:Number
    },
    bond_issuerance_amount:{
        type:Number
    },
    validity_number:{
        type:Number
    },

    status:{
        type:String,
        enum:['PENDING','REJECTED','APPROVED','COMPLETED','WAITING FOR EXCHANGE',"IN PROGRESS"],
        default:"PENDING"
    }
},{timestamps:true})

const sponsorBondModel=mongoose.model('sponsor_bonds',sponsorBondSchema)
module.exports=sponsorBondModel
const mongoose=require('mongoose')
const sponsorMissionSchema=mongoose.Schema({
    bond_id:{
type:mongoose.Schema.ObjectId,
ref:'sponsor_bonds'
    },
    description:{
        type:String,
        required:true
    },
    
task_type:{
type:String,
required:true
    },
    status:{
        type:String,
        enum:['PENDING','APPROVED','REJECTED','COMPLETED','NOT STARTED'],
        default:'NOT STARTED'
    }
},{timestamps:true})

const sponsorMissionModel=mongoose.model('sponsor_missions',sponsorMissionSchema)

module.exports=sponsorMissionModel
const mongoose=require('mongoose')

const documentSchema=mongoose.Schema({
    file_path_id:{
type:mongoose.Schema.ObjectId,
    ref:'file_object',
    required:true
    },
    is_uploaded:{
        type:Boolean,
        default:false
    },
    is_approved:{
        type:Boolean,
        default:false
    },
    is_rejected:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
const documentmodel=mongoose.model('documents',documentSchema)

module.exports=documentmodel
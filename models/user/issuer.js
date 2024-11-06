const mongoose=require('mongoose')

const issuerSchema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    social_media_id:{
type:mongoose.Schema.ObjectId,
ref:'social_media',
required:true
    },
    profile_img_id:{
type:mongoose.Schema.ObjectId,
ref:'file_object'

    },
    is_verified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
const issuermodel=mongoose.model('issuerr',issuerSchema)

module.exports=issuermodel
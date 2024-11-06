const mongoose=require('mongoose')

const buyerSchema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
        required:true
    },
    social_media_id:{
        type:mongoose.Schema.ObjectId,
        ref:'social_media',

            },
    profile_img_id:{
type:mongoose.Schema.ObjectId,
ref:'file_object',

    },
    is_verified:{
        type:Boolean,
        default:false
    }
})

const buyermodel=mongoose.model('buyer',buyerSchema)
module.exports=buyermodel
const mongoose=require('mongoose')

const socialMediaSchema=mongoose.Schema({
    social_media_platform:{
        type:mongoose.Schema.ObjectId,
        ref:'social_media_platforms',
        required:true
    },
    social_media_link:{
        type:String,
        required:['Please enter social media link',true],
        
    },
    is_verified:{
        type:Boolean,
        default:false
    }
})

const socialMediaModel=mongoose.model('social_media',socialMediaSchema)
module.exports=socialMediaModel
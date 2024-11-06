const mongoose=require('mongoose')

const socialMediaPlatformSchema=mongoose.Schema({
    name:{
        type:String,
        enum:['TIKTOK','FACEBOOK','YOUTUBE','INSTAGRAM']
    }
},{
    timestamps:true
})

const socialMediaPlatformModel=mongoose.model('social_media_platforms',socialMediaPlatformSchema)
module.exports=socialMediaPlatformModel
const mongoose=require('mongoose')

const otpSchema=mongoose.Schema({
    otp:{
        type:String,
        required:true
    },
    entity_type:{
        type:String,
        enum:['mobile','email'],
        required:true
    },
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
        required:true
    },
    expires_at:{
type:Date,
required:true
    },
    Is_expired:{
        type:Boolean,
        required:true,
        default:false
    }
},{timestamps:true})

const otpmodel=mongoose.model('otp',otpSchema)
module.exports=otpmodel
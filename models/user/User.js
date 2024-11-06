const mongoose=require('mongoose')

const user=mongoose.Schema({
    username:{
        type:String,
        required:['Please enter username',true]
    },
    mobile_number:{
        type:String,
        required:['Please enter phone number',true],
        unique:true
    },
    Is_mobile_number_verified:{
        type:Boolean,
        default:false
    },
    email:{
        type:String,
        required:['Please enter email',true],
        unique:true
    },
    is_email_verified:{
        type:Boolean,
        default:false
    },
    country_code_id:{
type:mongoose.Schema.ObjectId,
ref:'country_code'
    },
    password:{
        type:String,
        required:['Please enter password',true]
    },
    current_active_state: {
        type: String,
        enum: ['TEMPORARY', 'ISSUERER', 'BUYER'],  
        default:'TEMPORARY'
    },
    issuer_id:{
type:mongoose.Schema.ObjectId,
ref:'issuerr',
     
    },
    buyer_id:{
        type:mongoose.Schema.ObjectId,
        ref:'buyer',
      
    },
    level_id:{
        type:mongoose.Schema.ObjectId,
        ref:'levels'
    },
    payment_method_id:{
    type:mongoose.Schema.ObjectId,
    ref:'payment_method'
    },
    payment_method:{
        type:String,
        enum:['STRIPE','PAYPAL','GOOGLE_PAY'],
    }

},{
    timestamps:true
})


const usermodel=mongoose.model('user',user)

module.exports=usermodel
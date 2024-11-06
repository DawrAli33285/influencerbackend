const mongoose=require('mongoose')

const paymentMethodSchema=mongoose.Schema({
    method_name:{
        type:String,
        enum:['PAYPAL','STRIPE','GOOGLE_PAY'],
        required:true
    },
paypal:{
        type:String
    },
card:{
    type:String
}

},{
    timestamps:true
})

const paymentmethodmodel=mongoose.model('payment_method',paymentMethodSchema)
module.exports=paymentmethodmodel
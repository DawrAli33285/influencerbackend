const mongoose=require('mongoose')

const transactionSchema=mongoose.Schema({
payment_method_id:{
    type:mongoose.Schema.ObjectId,
    ref:'payment_method',
    required:true
},
user_id:{
    type:mongoose.Schema.ObjectId,
    ref:'user',
    required:true
},
no_of_bonds:{
type:Number
},
amount:{
    type:Number
},
status:{
    type:String,
    enum:['SUCESS','FAILED']
},

},{
    timestamps:true
})

const transactionModel=mongoose.model('transaction',transactionSchema)

module.exports=transactionModel
const mongoose=require('mongoose')

const featureSchema=mongoose.Schema({
    feature_name:{
        type:String,
required:true
    },
actions:[{
type:mongoose.Schema.ObjectId,
ref:'actions'
}],
description:{
    type:String,
    required:['Please enter description',true]
},

},{timestamps:true})

const featuremodel=mongoose.model('features',featureSchema)
module.exports=featuremodel
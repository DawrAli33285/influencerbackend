const mongoose=require('mongoose')

const actionSchema=mongoose.Schema({
    action_name:{
        type:String,
        enum:['CREATE','UPDATE','DELETE'],
        unique:true
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true})

const actionsModel=mongoose.model('actions',actionSchema)
module.exports=actionsModel

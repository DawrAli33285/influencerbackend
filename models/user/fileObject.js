const mongoose=require('mongoose')

const fileObject=mongoose.Schema({
    file_path:{
        type:String,
        required:['Please enter file path',true]
    },
    folder_name:{
        type:String
    }
},{timestamps:true})

const filemodel=mongoose.model('file_object',fileObject)
module.exports=filemodel
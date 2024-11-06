const mongoose=require('mongoose')


const levelNumbers = Array.from({ length: 30 }, (_, i) => i + 1);



const levelsSchema=mongoose.Schema({
level_name:{
    type: Number,        
    enum: levelNumbers, 
    required: true  
},
description:{
    type:String,
    required:true
}
})


const levelsmodel=mongoose.model('levels',levelsSchema)
module.exports=levelsmodel
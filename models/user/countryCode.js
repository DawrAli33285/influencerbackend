const mongoose=require('mongoose')

const countrySchema=mongoose.Schema({
    country_code:{
        type:String,
        required:true
    }
},{timestamps:true})

const countryModel=mongoose.model('country_code',countrySchema)
module.exports=countryModel
const userModel=require('../../../models/user/User')


module.exports.getUser=async(req,res)=>{
try{

    let user=await userModel.find({}).populate("country_code_id")
    return res.status(200).json({
        user
    })

}catch(e){
    return res.status(400).json({
        error:"Server error please try again"
    })
}
}
let jwt=require('jsonwebtoken')

module.exports.middleware=async(req,res,next)=>{
   
    try{
if(req.headers?.authorization?.startsWith('Bearer')){
  
    let token=req.headers.authorization.split(' ')[1]

let issuerId=jwt.verify(token,process.env.JWT_KEY)

req.issuerId=issuerId._id
next();
}else{
    return res.status(400).json({
        error:"User not loggedin"
    })
}
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
        error:"Authentication failed"
        })
    }
}
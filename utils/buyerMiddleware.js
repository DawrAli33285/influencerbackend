let jwt=require('jsonwebtoken')

module.exports.buyerMiddleware=async(req,res,next)=>{


    try{
if(req.headers?.authorization?.startsWith('Bearer')){
  
let token=req.headers.authorization.split(' ')[1]

let data=jwt.verify(token,process.env.JWT_BUYER)

req.buyer_id=data.id
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
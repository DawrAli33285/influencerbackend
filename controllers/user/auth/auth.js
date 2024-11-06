const userModel=require('../../../models/user/User');
const countryModel = require('../../../models/user/countryCode');
const issuermodel = require('../../../models/user/issuer');
const socialMediaModel = require('../../../models/user/socialMedia');
const otpGenerator = require('otp-generator');
const eeClient = require('elasticemail-webapiclient').client;
const otpStore = {}; 

const socialMediaPlatformModel = require('../../../models/user/socialMediaPlatform');
const jwt=require('jsonwebtoken')

const bcrypt=require('bcrypt')
const otpModel=require('../../../models/user/otp')
const mailgun = require("mailgun-js");
module.exports.register = async (req, res) => {
    let { ...data } = req.body;
console.log(data)
    try {
        let phoneAlreadyExists=await userModel.findOne({mobile_number:data.mobile_number})
        if(phoneAlreadyExists){
            return res.status(400).json({
                error:"Phone number is already taken"
            })
        }

        let emailAlreadyExists=await userModel.findOne({email:data.email})
    if(emailAlreadyExists){
        return res.status(400).json({
          error:"Email is already taken"  
        })
    }
  
    let hashedPassword=await bcrypt.hash(data.password,10)
    data.password=hashedPassword
   const countryCode=await countryModel.create({
    country_code:data.country_code
   })
   data.country_code_id=countryCode._id
    const [user, socialMediaPlatform] = await Promise.all([
        userModel.create(data),
        socialMediaPlatformModel.create({ name: "YOUTUBE" })
    ]);

    const socialMediaEntry = await Promise.all([socialMediaModel.create({
        social_media_platform: socialMediaPlatform._id,
        social_media_link: 'https://www.youtube.com/@soggycerealz'
    })]);


    const issuer = await Promise.all([ issuermodel.create({
        user_id: user._id,
        social_media_id: socialMediaEntry[0]._id 
    })]);

    return res.status(200).json({
        message: "User created successfully",
    
    });

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({
           error: "Server error, please try later"
        });
    }
};




module.exports.login=async(req,res)=>{
    let {email,password}=req.body;
    
    try{
let emailFound=await userModel.findOne({email}).populate('country_code_id')

if(!emailFound){
    return res.status(400).json({
        error:"Email not found"
    })
}


passwordencrypted=emailFound.password
let passwordMatch=await bcrypt.compare(password,passwordencrypted)
if(!passwordMatch){
    return res.status(400).json({
        error:"Incorrect password"
    })
}

const issuer = await Promise.all([ issuermodel.findOne({
    user_id: emailFound._id,

}).populate('user_id')]);

if(issuer[0].user_id.Is_mobile_number_verified==true && issuer[0].user_id.is_email_verified==true){
    let token=await jwt.sign(issuer[0].toObject(),process.env.JWT_KEY)
    return res.status(200).json({
         token,
        verified:true,
        influencer:true,
        user:emailFound
    })
}else{
    return res.status(200).json({
        message:"User logged in",
        verified:false,
        influencer:true,
        user:emailFound
    })
}


    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}

module.exports.socialLogin=async(req,res)=>{
    let {email}=req.body;
    try{
let userFound=await userModel.findOne({email}).populate('country_code_id')


   

const issuer = await Promise.all([ issuermodel.findOne({
    user_id:userFound._id,

}).populate("user_id")])

if(issuer[0].user_id.Is_mobile_number_verified==true && issuer[0].user_id.is_email_verified==true ){
    
    let token=await jwt.sign(issuer[0].toObject(),process.env.JWT_KEY)
    return res.status(200).json({
    token,
     verified:true,
     user:userFound
    })
}else{
    return res.status(200).json({
        message:"User logged in",
        verified:false,
        user:userFound
    })
}

    }catch(e){
        console.log(e.message)
       return res.status(400).json({
        error:"Server error please try again"
       }) 
    }
}

module.exports.mobileOTP=async(req,res)=>{
let {phoneNumber,email}=req.body;
const accountSid = 'ACd291b91974bc3551e5868d23c90b798e';
const authToken = 'ca157e3aa36f7185efb12a0006d316ce';
const client = require('twilio')(accountSid, authToken);
const user=await userModel.findOne({email})
if(user.Is_mobile_number_verified==true){
    return res.status(400).json({error:"phone already verified"})
}
    try{
      
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false }); 
       
      await otpModel.create({
        otp,
        entity_type:'mobile',
        user_id:user._id,
        expires_at:Date.now()
      })

       await client.messages
        .create({
            to:phoneNumber,
            body: `Your OTP is: ${otp}. It will expire in 30 seconds.`,
            from:"+12164853379"
        })
     
        return res.status(200).json({
            message:"OTP sent sucessfully"
        })
        
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}




module.exports.verifyOTP = async (req, res) => {
    let {  otp ,email} = req.body; 
   


 
    try {
       
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let storedOtpData = await otpModel.findOne(
            { user_id: user._id, Is_expired: false }
        ).sort({ createdAt: -1 });
  


if(!storedOtpData){
return res.status(400).json({
    error:"OTP has expired"
})
}
       
        const { otp: storedOtp, expires_at ,createdAt
        } = storedOtpData;
     
      const expirationThreshold = new Date(createdAt.getTime() + 30 * 1000); 
    
      if (otp === storedOtp) {
   console.log(new Date())
console.log(expirationThreshold)
   
           if (new Date() < expirationThreshold) {
          console.log("FIT")
                await otpModel.updateOne({ _id: storedOtpData._id }, { Is_expired: true });
               
                await userModel.updateOne({email},{$set:{
                    Is_mobile_number_verified:true
                }})


         
                return res.status(200).json({
                    message: "OTP verified successfully!",
                
                });
            } else {
                console.log("FALSE")
                await otpModel.updateOne({ _id: storedOtpData._id }, { Is_expired: true });
                return res.status(400).json({ error: "OTP has expired" });
            }
        } else {
            
            return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }

    } catch (error) {
      console.log(error.message)
        res.status(500).json({ error: "Server error, please try again" });
    }
};


module.exports.emailOTP=async(req,res)=>{
 const {email}=req.body;
 
    try{
        let user=await userModel.findOne({email})
        if(user.is_email_verified==true){
            return res.status(400).json({error:"Email already verified"})
        }
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false }); 
       
        await otpModel.create({
          otp,
          entity_type:'email',
          user_id:user._id,
          expires_at:Date.now(),
          is_expired:false
        })

        const options = {
            apiKey: process.env.ELASTIC_API_KEY,
            apiUri: 'https://api.elasticemail.com/',
            apiVersion: 'v2'
        }
         

const EE = new eeClient(options);
 
EE.Account.Load().then(function(resp) {
    
});
console.log("EMAIL SENT TO")
console.log(user.email)

const emailParams = {
    "subject": `OTP for sponsorbond`,
    "to": email,
    "from": process.env.EMAIL,
    "body": `
    <p>Please enter this code ${otp}</p>

    `
};
 

let emailSent=EE.Email.Send(emailParams)
.catch((err) => {
    return res.status(400).json({
        error:"Error sending email please try again"
    })
});
console.log(emailSent)
  return res.status(200).json({
    message:"Email sent"
  })
       
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}




module.exports.verifyEmailOTP = async (req, res) => {
    let {  otp,email } = req.body; 
   
    try {
        
        let user = await userModel.findOne({email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        let storedOtpData = await otpModel.findOne(
            { user_id: user._id, Is_expired: false }
        ).sort({ createdAt: -1 });
  
if(!storedOtpData){
return res.status(400).json({
    error:"OTP has expired"
})
}
        
        
        const { otp: storedOtp, expires_at ,createdAt
        } = storedOtpData;
   
      const expirationThreshold = new Date(createdAt.getTime() + 30 * 1000); 
        if (otp === storedOtp) {
           console.log("MATCH")
           if (new Date() < expirationThreshold) {
                
                await otpModel.updateOne({ _id: storedOtpData._id }, { Is_expired: true });
                await userModel.updateOne({email},{$set:{
                    verifyEmailOTP:true,
                    is_email_verified:true
                }})
                return res.status(200).json({
                    message: "OTP verified successfully!",
                  
                });
            } else {
                await otpModel.updateOne({ _id: storedOtpData._id }, { Is_expired: true });
                return res.status(400).json({ error: "OTP has expired" });
            }
        } else {
            
            return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }

    } catch (error) {
      console.log(error)
        res.status(500).json({ error: "Server error, please try again" });
    }
};



module.exports.getVerificationData=async(req,res)=>{
let {email}=req.params;

    try{
        

        let user=await userModel.findOne({email})
        let issuer=await issuermodel.findOne({user_id:user._id})
        if(user.is_email_verified===true && user.Is_mobile_number_verified===true){
            issuer=issuer.toObject()
        
let token=await jwt.sign(issuer,process.env.JWT_KEY)

return res.status(200).json({
    user,
    token
})
        }

      
        return res.status(200).json({
            user,
        
        })
       

    }catch(e){
        console.log(e.message)
return res.status(400).json({
    error:"Server error please try again"
})
    }
}
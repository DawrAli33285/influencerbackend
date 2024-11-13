const userModel=require('../../../models/user/User')
const fs=require('fs')
const path=require('path')
const filemodel=require('../../../models/user/fileObject')
const documentmodel=require('../../../models/user/documents')
const issuermodel = require('../../../models/user/issuer')
const buyermodel = require('../../../models/user/buyer')
const eeClient = require('elasticemail-webapiclient').client;
module.exports.getUsers=async(req,res)=>{
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

module.exports.deleteUser=async(req,res)=>{
    let {id}=req.params;
    try{
await userModel.deleteOne({_id:id})
await issuermodel.deleteOne({user_id:id})
await buyermodel.deleteOne({user_id:id})
return res.status(200).json({
message:"User deleted sucessfully"    
})

    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}

module.exports.getUser=async(req,res)=>{
    let {email}=req.params;
try{
let user=await userModel.findOne({email})
return res.status(200).json({
    user
})

}catch(e){
    return res.status(400).json({
        error:"Server error please try again"
    })
}
}

module.exports.editUser = async (req, res) => {
    const { email } = req.params;
    let { ...data } = req.body;

    try {
       
        let userFound = await userModel.findOne({ email });
        let [emailFound, mobileFound, userNameFound] = await Promise.all([
            userModel.findOne({ email: data.email, _id: { $ne: userFound._id } }),
            userModel.findOne({ mobile_number: data.mobile_number, _id: { $ne: userFound._id } }),
            userModel.findOne({ username: data.username, _id: { $ne: userFound._id } })
        ]);

        if (userNameFound) {
            return res.status(400).json({ error: "Username already taken" });
        }
        if (emailFound) {
            return res.status(400).json({ error: "Email already taken" });
        }
        if (mobileFound) {
            return res.status(400).json({ error: "Mobile number taken" });
        }

       
        const bondPhotosFolder = "avatar";
        const bondPhotosDir = path.resolve(__dirname, '../../../', bondPhotosFolder);
        if (!fs.existsSync(bondPhotosDir)) {
            fs.mkdirSync(bondPhotosDir, { recursive: true });
        }

      
        if (req.files && req.files.length > 0) {
           
            const latestFile = req.files[req.files.length - 1];
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${latestFile.originalname}`;
            const bondPhotosPath = path.join(bondPhotosDir, fileName);

           
            fs.writeFileSync(bondPhotosPath, latestFile.buffer);

            
            let fileRecord = await filemodel.create({
                file_path: bondPhotosPath,
                folder_name: bondPhotosFolder
            });
            await documentmodel.create({
                file_path_id: fileRecord._id
            });

       
            data = {
                ...data,
                avatar: `http://localhost:5000/avatar/${fileName}`
            };
        }

      
        let user = await userModel.findOneAndUpdate({ email }, { $set: data }, { new: true });
        return res.status(200).json({
            message: "User edited successfully",
            user
        });
    } catch (e) {
        console.error(e.message);
        return res.status(400).json({
            error: "Server error, please try again"
        });
    }
};

module.exports.sendReply = async (req, res) => {
    let { ...data } = req.body;
    console.log(data);
  
    try {
     
      const options = {
        apiKey: process.env.ELASTIC_API_KEY,
        apiUri: 'https://api.elasticemail.com/',
        apiVersion: 'v2'
      };
  
      const EE = new eeClient(options);
  
      
     if(data?.messageId){
        const messageId = `<${data.messageId.replace(/\s+/g, '')}>`;
        const emailParams = {
            subject: data.subject,
            to: data.to,
            from: process.env.EMAIL,
            replyTo: data.to,
            headers: JSON.stringify({
              "In-Reply-To": messageId,
              "References": messageId
            }),
            bodyText: data.description,  
            fromName: 'Sponsor Bond',
            bodyType: 'Plain'
          };
      
         
          await EE.Email.Send(emailParams);
      
     }else{
        const emailParams = {
            subject: data.subject,
            to: data.to,
            from: process.env.EMAIL,
            replyTo: data.to,
            bodyText: data.description,  
            fromName: 'Sponsor Bond',
            bodyType: 'Plain'
          };
      
         
          await EE.Email.Send(emailParams);
      
     }
      return res.status(200).json({
        message: "Reply sent successfully"
      });
    } catch (e) {
      console.error("Error:", e);
      return res.status(400).json({
        error: "Server error, please try again"
      });
    }
  };
  





  module.exports.sendEmail=async(req,res)=>{
    let {...data}=req.body;
    try{


        const options = {
            apiKey: process.env.ELASTIC_API_KEY,
            apiUri: 'https://api.elasticemail.com/',
            apiVersion: 'v2'
          };
      
          const EE = new eeClient(options);

          const emailParams = {
            subject: data.subject,
            to: data.to,
            from: process.env.EMAIL,
            replyTo: data.to,
            bodyText: data.description,  
            fromName: 'Sponsor Bond',
            bodyType: 'Plain'
          };

          await EE.Email.Send(emailParams);

        return res.status(200).json({
            message:"Email sent sucessfully"
        })
    }catch(e){
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
  }
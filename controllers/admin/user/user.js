const userModel=require('../../../models/user/User')
const fs=require('fs')
const path=require('path')
const filemodel=require('../../../models/user/fileObject')
const documentmodel=require('../../../models/user/documents')
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

module.exports.editUser=async(req,res)=>{
let {email}=req.params;
let {...data}=req.body;
    try{
let userFound=await userModel.findOne({email})
let [emailFound,mobileFound,userNameFound]=await Promise.all([
    userModel.findOne({ email: data.email, _id: { $ne: userFound._id } }), 
    userModel.findOne({mobile_number:data.mobile_number,_id:{$ne:userFound._id}}),
    userModel.findOne({username:data.username,_id:{$ne:userFound._id}})
])
console.log(emailFound)
console.log(mobileFound)
console.log(userNameFound)
if(userNameFound){
return res.status(400).json({
    error:"Username already taken"
})
}
if(emailFound){
return res.status(400).json({
    error:"Email already taken"
})
}
if(mobileFound){
    return res.status(400).json({
        error:"Mobile number taken"
    })
}

let bondPhotosFolder = "avatar";



const bondPhotosDir = path.resolve(__dirname,'../../../', bondPhotosFolder); 
let exists=fs.existsSync(bondPhotosDir)


if(!exists){
   let created=fs.mkdirSync(bondPhotosDir, { recursive: true });

}

let file=req.file
let fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.originalname}`;
  
let bondPhotosPath = path.join(bondPhotosDir, fileName);
fs.writeFileSync(bondPhotosPath, file.buffer);
let fileRecord = await filemodel.create({
    file_path: bondPhotosPath,
    folder_name: bondPhotosFolder
});
await documentmodel.create({
    file_path_id: fileRecord._id
});

let avatar=`http://localhost:5000/avatar/${fileName}`
data={
    ...data,
    avatar
}

let user=await userModel.findOneAndUpdate({ email }, { $set: data }, { new: true });
return res.status(200).json({
    message:"User edited sucessfully",
    user
})
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}
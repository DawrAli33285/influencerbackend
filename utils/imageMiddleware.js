const multer=require('multer')

const multerStorage=multer.memoryStorage();
const fileFilter =(req,file,cb)=>{
  
    if(file.mimetype.startsWith('image')){
        return cb(null,true)
    }else{
        return cb({message:'invalid file format'},false)
    }
}

const imageMulter=multer({
storage:multerStorage,
fileFilter
})

module.exports=imageMulter
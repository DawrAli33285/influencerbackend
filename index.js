//imports
const env=require('dotenv')
const cors=require('cors')
const express=require('express')
const path=require('path')
const app=express();
const userAuthRoutes=require('./routes/user/auth/auth')
const userBondRoutes=require('./routes/user/bond/bond')
const connect=require('./connection/connection')
const dashboardRoutes=require('./routes/user/dashboard/dashboard')
const missionRoutes=require('./routes/user/mission/mission')
const buyerRoutes=require('./routes/buyer/dashboard')
const offersRoutes=require('./routes/buyer/offers/offers')
const bondsRoutes=require('./routes/buyer/bonds/bonds')
const buyerPaymentRoutes=require('./routes/buyer/payment/payment')
const adminUserRoutes=require('./routes/admin/user/user')
const adminBondsRoutes=require('./routes/admin/bond/bond')
//middlewares
env.config()
app.use(cors({
    origin:'*',
    methods:['POST','GET','DELETE','PATCH','PUT']
}))
app.use(express.json())
app.use('/issuerPhotos', express.static(path.join(__dirname, 'issuerPhotos')));
app.use('/avatar', express.static(path.join(__dirname, 'avatar')));


//routes
app.get('/',(req,res)=>{
    return res.status(200).json({
        message:"APP running sucessfully"
    })
})
app.use(userAuthRoutes)
app.use(userBondRoutes)
app.use(dashboardRoutes)
app.use(missionRoutes)
app.use(buyerRoutes)
app.use(offersRoutes)
app.use(bondsRoutes)
app.use(buyerPaymentRoutes)
app.use("/admin",adminUserRoutes)
app.use("/admin",adminBondsRoutes)
//db connection
connect
//port
app.listen(process.env.PORT,()=>{
console.log(`Listening to port ${process.env.PORT}`)
})
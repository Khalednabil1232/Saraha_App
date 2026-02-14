import express from "express";
import checkConnectionDB from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
const app = express();
const port = 3000

const bootstrap = () => {
    

    app.use(express.json())
    checkConnectionDB()


    app.use("/users",userRouter)

    app.get("/",(req,res,next)=>{
        res.status(200).json({message:`Welcome ON Saraha APP ...💬`})
    })

    app.use("{/*demo}",(req,res,next)=>{
        //res.status(404).json({message:` Url ${req.originalUrl} Not Found...❌`})
        throw new Error(`Url ${req.originalUrl} Not Found...❌`,{cause:404})
    })
// لازم يكون اخر middleware
    app.use((err, req, res, next) => {
        res.status(err.cause || 500).json({message : err.message , stack:err.stack})
})



    app.listen(port,()=>{
        console.log(`server is Running on port ${port}..⏳`);
    })

}

export default bootstrap
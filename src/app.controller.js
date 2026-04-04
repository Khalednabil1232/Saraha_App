import express from "express";
import checkConnectionDB from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import cors from "cors"
import { PORT, WHITE_LIST } from "../config/config.service.js";
import { redisClient, redisConnection } from "./DB/redis/redis.db.js";
import { set } from "mongoose";
import messageRouter from "./modules/messages/message.controller.js";
import helmet from "helmet";
import {rateLimit} from "express-rate-limit";

const app = express();
const port = PORT

const bootstrap = async () => {

    const limiter = rateLimit({
        windowMs: 60 * 30 * 1000, // 15 minutes
        limit: 3, // limit each IP to 100 requests per windowMs
        message : {message:"Too many requests from this IP, please try again after 15 minutes...⏳"}
});

    const corsOptions = {
    origin: function (origin, callback) {
    if([...WHITE_LIST,undefined].includes(origin)){
        callback(null, true)
    }else{
        callback(new Error(`Origin ${origin} Not Allowed By CORS...❌`))
}
    }
    }

    // middlewares
    app.use(express.json())
    app.use(helmet(),limiter) // بتضيف هيدرز للريسبونس بتاعك عشان تحمي ابلكيشن بتاعك من بعض الثغرات الامنية المعروفة
     // بتحدد عدد الريكوستات اللي ممكن يرسلها كل يوزر في فترة زمنية معينة عشان تحمي ابلكيشن بتاعك من الهجمات اللي بتعتمد علي ارسال عدد كبير من الريكوستات في وقت قصير زي هجمات DDoS مثلا
    app.use(cors(corsOptions)) // cross origin resource sharing , بتسمح لفرونت اند من دومين تاني انه يتواصل مع السيرفر بتاعك

    // db connection
    checkConnectionDB()
    redisConnection()


    //await redisClient.set("name", "khaled")
    // const name = await redisClient.exists("name")
    // console.log(name);
    


    app.use("/uploads",express.static("uploads"))
    // routes
    app.use("/users",userRouter)
    app.use("/messages",messageRouter)

    app.get("/",(req,res,next)=>{
        res.status(200).json({message:`Welcome ON Saraha APP ...💬`})
    })

    app.use("{/*demo}",(req,res,next)=>{
        //res.status(404).json({message:` Url ${req.originalUrl} Not Found...❌`})
        throw new Error(`Url ${req.originalUrl} Not Found...❌`,{cause:404})
    })
// لازم يكون اخر middleware
    app.use((err, req, res, next) => {
        res.status(err.cause || 500).json({message : err.message , stack:err.stack,error:err})
})



    app.listen(port,()=>{
        console.log(`server is Running on port ${port}..⏳`);
    })

}

export default bootstrap
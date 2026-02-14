import { ProviderEnum } from "../../common/enum/user.enum.js";
import { successResponse } from "../../common/utils/response.success.js";
import { decrypt, encrypt } from "../../common/utils/security/encrypt.security.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import { GenerateToken, VerifyToken } from "../../common/utils/token.service.js";
import * as db_service from "../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// express > version 5 بتعملها لوحدها 
// const asyncHandler = (fn)=>{ 
//     return (req, res, next) => {
//         fn(req,res,next).catch((error)=>{
//             // res.status(404).json({msg:error.message})
//             next(error) // دي اللي بتودي لل global error handling
//         })
//     }
// }



// Sign Up
export const signUp = async (req, res, next) => {
    const { userName, email, password,cpassword, age, gender ,phone } = req.body

    // ahmedali لو حد معملش مسافه اعمل ايه ؟
    //if(userName.split(" ") length<2){}

    if (password !== cpassword) {
    throw new Error("Invalid Password", { cause: 400 });
}


    if(
        await db_service.findOne({model:userModel,filter: {email} })) {
        //return res.status(409).json({message:`Email Already Exist`})
        throw new Error("Email Already Exist") 
        // بعد كده اي ايرور هيحصل اعمله ب ثرو
    }
    const user = await db_service.create({model : userModel, data : {
        userName,
        email,
        password: await Hash({plainText:password}),
        gender ,
        phone:encrypt(phone) }})
   //res.status(201).json({message : `Done..👌`,user})
    successResponse({res,status:201 , data:user})

}

// Sign In

export const signIn = async (req, res, next) => {
    const {email, password} = req.body

    const user = await db_service.findOne({model:userModel,filter:{email , provider: ProviderEnum.system}})
    if(!user) {
        //return res.status(409).json({message:`User Not Exist`})
        throw new Error("User Not Exist",{cause:400})
    }


    if(!await Compare({plainText: password, cipherText : user.password})) {
        //res.status(400).json({message:`Uncorrect Password`})
        throw new Error("Uncorrect Password",{cause : 400})
    }
    
    // create token
    const access_token = GenerateToken({
        payload:{ id :user._id,email:user.email},
        secret_key:"Khaled",
        options:{
            expiresIn:60,
            //notBefore :60*60,
            audience:"http//als",
            //noTimestamp:true
            jwtid:uuidv4()
        }

    }) 

    //res.status(201).json({message : `Done..👌`,user})
    successResponse({res,message:"success Sign In" , data: {access_token}})
}

// access_token : عايز تعمل اي حاجه لازم تبعته 
// refresh_token : توكن بس ال expire طويله 
// في المواقع الكبيره زي الفيس بيعمل توكن ولما يخلص يعمله رفريش تلقائي

export const getProfile = async (req, res, next) => {
    // const {id} = req.params

    // const {authorization} = req.headers
    // const decoded = VerifyToken({token:authorization,secret_key:"Khaled"})

    


    //res.status(201).json({message : `Done..👌`,user})
    console.log(req.user);
    
    successResponse({res,message:"Success SignIN" , data : req.user })

}


import userModel from "../../DB/models/user.model.js"
import { VerifyToken } from "../utils/token.service.js"
import * as db_service from "./../../DB/db.service.js"

export const authentication = async (req,res,next)=>{
    const {authorization} = req.headers

    if(!authorization){
        throw new Error ("Token not exist")
    }

    const decoded = VerifyToken({token:authorization,secret_key:"Khaled"})

    if(!decoded || !decoded?.id){
        throw new Error("invalid token")
    }
    const user = await db_service.findOne({model:userModel,id : decoded.id, select:"-password"})
    if(!user) {
        throw new Error("User Not Exist",{cause:400})
    }
    req.user = user
    next()
}
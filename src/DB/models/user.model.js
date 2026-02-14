import mongoose from "mongoose";
import { GenderEnum, ProviderEnum } from "../../common/enum/user.enum.js";



const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        minLength: 3,
        maxLength: 6,
        trim: true
    },
    lastName:{
        type:String,
        required: true,
        minLength: 3,
        maxLength: 6,
        trim: true
    },
    email:{
        type:String,
        required: true,
        unique:true,
        trim: true,
        lowercase:true
    },
    password:{
        type:String,
        required: true,
        trim : true
        
    },
    age:Number,
    gender:{
        type:String,
        enum:Object.values(GenderEnum),
        default: GenderEnum.male
    },
    phone:{type:String,required:true},
    profilePicture:String,
    confirmed:Boolean,
    provider:{
        type: String,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.system


    }
},{
    timestamps: true,
    strictQuery: true, // لازمتها لما تروح تعمل فيلد جديد مش عامله متضيفوش
    toJSON: {virtuals:true},
    toObject: {virtuals:true}


})

userSchema.virtual("userName")
    .get(function(){
        return this.firstName + " " + this.lastName
    })
    .set(function (v) {
        const [firstName,lastName]= v.split(" ")
        this.set({firstName ,lastName})
    })

const userModel = mongoose.models.user || mongoose.model("user",userSchema)

export default userModel
import mongoose ,{Schema}from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new Schema(
    {
        name :{
            type:String,
            required:true
        },
        email:{
            type :String,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:Number,
            default:0
        },
        cart: {
            type:Array,
            default:[]


        }

    },{
        timestamps:true
    }
    
)
userSchema.pre("save",async function(next){
        if(!this.isModified("password")) return next();

        this.password =await bcrypt.hash(this.password,10)
        next()
    })
    userSchema.methods.isPasswordCorrect = async function(password){
        return await bcrypt.compare(password,this.password)
    }
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this.id,
            email:this.email,
            name:this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }




        
    )
}
userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}

export const User = mongoose.model("User",userSchema)
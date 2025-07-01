import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
const productSchema = new Schema(
    {
        product_id :{
            type:String,
            unique:true,
            required:true,
            trim:true
        },
        title:{
            type:String,
            trim:true,
            required:true,
        },
        description:{
            type:String,
            required:true
        },
         price:{
        type:Number,
        trim:true,
        required:true
    },
    checked:{
        type:Boolean,
        default:false
    },
    sold:{
        type:Number,
        default:0
    },
    category:{
        type:String,
        required:true
    },
    images:{
        type:Object,
        required:true
    }


    },
    {
        timestamps:true
    }

)

export const Product = mongoose.model("Product",productSchema)
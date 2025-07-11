import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
// ✅ Correct (add `server/`)
// ✅ Correct
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import dotenv from "dotenv";
dotenv.config();
console.log("Cloudinary Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Cloudinary Key:", process.env.CLOUDINARY_API_KEY);
console.log("Cloudinary Secret:", process.env.CLOUDINARY_API_SECRET ? "✓ Loaded" : "❌ Missing");

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
})
)
app.use(express.json()); // to parse JSON body
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.get('/',(req,res)=>{
    res.json({msg:"This is Example"})
})

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products",productRoutes);
// app.use("/api/v1/products", productRoutes); // optional

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});
 // for parsing cookies


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const URI = process.env.MONGODB_URI;

mongoose.connect(URI,{
    
    
}).then(()=>{
    console.log("mongoDb connected")
}).catch(err=>{
    console.log(err)
})
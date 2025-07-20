import express from "express";
import razorpayInstance from "../utils/razorpay.js";

const router = express.Router();

router.post("/create-order" ,async(req,res)=>{
    try{
        const {amount} = req.body;
        const options = {
            amount:amount * 100,
            currency:"INR",
            receipt:`receipt_order_${Date.now()}`,
        
        };
        const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Server Error" });

    }
})
export default router;
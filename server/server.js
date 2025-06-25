const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express();

const PORT = process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.json({msg:"This is Example"})
})

app.listen(PORT,() =>{
    console.log("Server is running")
})

const URI = process.env.MONGODB_URI;

mongoose.connect(URI,{
    
    
}).then(()=>{
    console.log("mongoDb connected")
}).catch(err=>{
    console.log(err)
})
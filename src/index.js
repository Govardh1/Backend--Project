// require('dotenv').config({path:'./env'})

import dotenv from "dotenv";

dotenv.config();
import connectDB from "./db/index.js";
import { app } from "./app.js";




connectDB()
.then(()=>{
app.listen(process.env.PORT || 8000 ,()=>{
    console.log(`server is runnig at PORT-------- ${process.env.PORT}`);
})
}).
catch((err)=>{
    console.log("MONGO DB CONNECTIONFAILED",err);
})








/*
import express from "express";
const app= express()
(async()=>{
   try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on(error,()=>{
        console.log("ERROR:",error);
        throw error;
    })
    app.listen(process.env.PORT ,()=>{
        console.log(`App is listning on port ${PORT}`);
    }) 
   } catch (error) {
    console.error("ERROR",error)
    throw error
   }
})()*/

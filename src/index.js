// require('dotenv').config({path:'./env'})

import dotenv from "dotenv";

dotenv.config();
import connectDB from "./db/index.js";





connectDB()








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

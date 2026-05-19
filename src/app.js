const express=require("express");

const app=express();

// route should be handled one by one 

app.get("/getUserData",(req,res)=>{
    try{
    // Logic of Db call and get user data
    throw new Error("abcdef")
    res.send("User Data Sent");
    }
    catch(err){
     res.status(500).send("Some Error contact support team");
    }
});

// error will be the first parameter 


app.use("/",(err,req,res,next)=>{
   if(err){

    // Log your error 

    res.status(500).send("something went wrong");
   }
});




app.listen(7777,()=>{
    console.log("Server is successfully listening on port 7777....");
});




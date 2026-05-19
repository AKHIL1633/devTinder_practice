const express=require("express");
const app=express();

const {adminAuth,userAuth}= require("./middlewares/auth.js");
// Handle Auth Middleware for all request get ,post 
// if you want  get request then used get only 

// you can use  app.all("/admin")
//Always make app.use instead of app.all 

app.use("/admin",adminAuth);
// app.use("/user",userAuth);

//if the middleware sent the response then it is okay otherwise it is not okay 

app.post("/user/login",()=>{
    res.send("User logged in successfully");
});

app.get("/user/data",userAuth,(req,res)=>{
    res.send("User Data Sent");
});

app.get("/user",userAuth,(req,res) => {
    res.send("User Data Sent");
})

app.get("/admin/getAllData",(req,res) =>{
     res.send("All Data Sent");
});

app.get("/admin/deleteUser",(req,res) =>{
     res.send("Delete a user");
})

app.listen(7777,()=>{
    console.log("Server is successfully listening on port 7777....");
});




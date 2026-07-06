const express =require('express');

const {validateSignUpData}=require("../utils/validation");

const authrouter =express.Router();

const User=require("../models/user");

const bcrypt =require("bcrypt");
const validator = require("validator");


// const app=express();
// const router=express.Router();
// app.use and router.use() both are same 
// everyting work in the same way in terms of middleware 
// in terms of route as well
//express manage it internally the things 

// app.use()
// router.use();


authrouter.post("/signup",async(req,res)=>{
  // Validation of data is required in sign up
    validateSignUpData(req);

    const {firstName,lastName,emailId,password}=req.body;
  // Encrypt the password
  // it will create the hash salt should be applied 
  // the more salt will be the more  encrypted password would be 

  const passwordHash=await bcrypt.hash(password,10);
  console.log(passwordHash);
  //once you encrypt it you cant decrypt it 


  // creating a new instance of the User model 
  // only these fields are allowed
     const user=new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
     });

     try {
     await user.save();
     res.send("User Added successfully");
     }catch (err){
      res.status(400).send("Error:" + err.message);
     }
});

authrouter.post("/login",async(req,res)=>{
  try {
    const {emailId,password}=req.body;
     if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address");
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid=await user.validatePassword(password);
    if(isPasswordValid){
      const token=await user.getJWT();
      console.log(token);
      res.cookie("token",token,{
        expires: new Date(Date.now() + 8 *3600000),
      });
      res.send(user);
    }
    else {
      throw new Error("Password is not correct");
    }
  }catch(err){
    res.status(400).send("ERROR :" +err.message);
  }
});


authrouter.post("/logout",async(req,res)=>{
 // the logic is very Simple 
 res.cookie("token",null,{
  expires:new Date(Date.now())
 });

 res.send("Logout successful");

})

module.exports=authrouter;
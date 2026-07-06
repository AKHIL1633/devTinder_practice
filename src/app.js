const express=require("express");

const connectDB =require("./config/database")

const app=express();

const User=require("./models/user");

const {validateSignUpData}=require("./utils/validation");

const validator=require("validator");

const bcrypt =require("bcrypt");

const cookieParser=require("cookie-parser");

const jwt=require("jsonwebtoken");

const {userAuth}=require("./middlewares/auth");

const user = require("./models/user");

const cors=require("cors");
// cors option could whitelist some origin
// backend should know where your frontend is hosted 

// you are whitlisting this domain

app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}));

app.use(express.json());

app.use(cookieParser());

const authRouter= require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/requests");
const userRouter=require("./routes/user");
// Whenever a request is coming at / go to the authrouter
//see if there is a route matching 
// example login then response is send from here 
// it will not go further 


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
// to get the info of the Model.findByIdAndUpdate
// go to the Api then model

//in the option you will see the run validators 
// explictly allowed 
// run validators =true
//you can run custom validations

// Akshay@123
//you need a salt 
//dvdavadvsdvsdvsdvsd

// never disclose the email id and password is not present
// the attacker should not know these details 

// try to make the app more secure using jwt token 
//using cookie 

//How to expire the Jwt token 

// you can even sent the expiry time


// app.post("/login",async(req,res)=>{
//   try {
//     const {emailId,password}=req.body;
//      if (!validator.isEmail(emailId)) {
//       throw new Error("Invalid email address");
//     }
//     // it will return the one email id
//     // here user will be that particular user only

//     const user = await User.findOne({ emailId });
//     if (!user) {
//       throw new Error("Invalid credentials");
//     }
//     // bcrypt.compare is there to check the password 
    
//     // const isPasswordValid=bcrypt.compare("Elon@123",
//     //   "$2b$10$qic2i2xAN6DcRcJAEv39au/xd649scg05NegxJfl/WcnSczGo/9kS"
//     // )
//     const isPasswordValid=await user.validatePassword(password);
//     if(isPasswordValid){
//       // express give a good way to attch the cookie 
//       //res.cookies(name,value)
//       // There is a method for it 
//       // jwt.io website 
//       //it has some secret information is stored inside it 
//       //jwt contain special information inside it 
//       //jwt token has threee things - header ,payload ,signature 
//       // payloaf will contain the secret information hide inside the code 


//       // Create a JWT token 
//       // jsonwebtoken is the main one ,good package developed bi oauth 
//       //it will give you method to sign up as well
//       //userid of akshay will be hide out in the token 
//       //Cookie Hijacking -- i can access your private information
//       //Secret key 
//       //1 h is one hour 
//       //expire in 0d ,create the token and you will expire immediately
      
//       // in namaste dev ,they have expired the token in 1 day 

//       // in normal website ,the expirey is generally 1 week 

//       //you can expire the cookies as well 

//       // search as res.cookies() in expressjs.com


    
//       // whatever the current user will be  logged ,whose token will be 
//       // come back 
//       // we have offloaded those logic to the schema itself 
//       //it will make the schema reusuable


//       const token=await user.getJWT();

//       console.log(token);

//       // Add the token to cookie and send back to the user 
//       // in the postman you will get the token 
//       // to make only httpOnly only call used true
//       // httpOnly: true 
//       // but in production always used https 
//       //expires the token in 8 hr 

//       res.cookie("token",token,{
//         expires: new Date(Date.now() + 8 *3600000),
//       });
//       res.send("Login Successful!!!");

 
//     }
//     else {
//       throw new Error("Password is not correct");
//     }
//   }catch(err){
//     res.status(400).send("ERROR :" +err.message);
//   }
// });

// whenever the profile api is called i need to validate the cookie 

// app.get("/profile",userAuth,async(req,res)=> {
//   //First it will go to the userAuth
//   //you can change the middleware and request handler 
//   //according to the express js
//   //here in the request user will already be there due to the middleware 
//  // req.cookies search this in the documentation
// try{
//   const user=req.user;
//   res.send(user);
// // const cookies=req.cookies;

// // const{token}=cookies;
// // // Validate my token
// // if(!token){
// //   throw new Error("Invalid Token");
// // }

// // const decodeMessage=await jwt.verify(token,"DEV@Tinder$798");
// // // console.log(decodeMessage);
// // const{_id}=decodeMessage;
// // // console.log("Logged In user is: " +  _id);


// // const user=await User.findById(_id);
// // if(!user){
// //   throw new Error("User does not exit");
// // }
// // res.send(user);

// //we have atached the user in the request itself



// // console.log(cookies); // undefined


// }
// catch(err) {
//   res.status(400).send("ERROR : " + err.message);
// }

// // post adding the middleware it will work clearly
// //once you login then you hitthe profile,you can see the response clearly
// // to read the cookie we would need a middleware cookie parser 
// // npm install cookie-parser 

// })




// api creation then we 
// app.post("/signup",async(req,res)=>{
//   // Validation of data is required in sign up
//     validateSignUpData(req);

//     const {firstName,lastName,emailId,password}=req.body;
//   // Encrypt the password
//   // it will create the hash salt should be applied 
//   // the more salt will be the more  encrypted password would be 

//   const passwordHash=await bcrypt.hash(password,10);
//   console.log(passwordHash);
//   //once you encrypt it you cant decrypt it 


//   // creating a new instance of the User model 
//   // only these fields are allowed
//      const user=new User({
//       firstName,
//       lastName,
//       emailId,
//       password: passwordHash,
//      });

//      try {
//      await user.save();
//      res.send("User Added successfully");
//      }catch (err){
//       res.status(400).send("Error:" + err.message);
//      }
// });

// i want to use this api when user is logged in 
//add userAuth to make this api more secure 
//this api will be called when my api is valid 
//This is how you can authenticate the request 
// i will  always use this middleware whenever user login onces 




// app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
//   const user =req.user;
//   // Sending a connection Request 
//   console.log("Sending a connection request ");
  
//   res.send(user.firstName + "sent the connection request");
// })


//go to the documentation api>Model>Model.find()

// Get user by email 
//findbyid()--- if you have the id 

//findOne with the email of the user 

// app.get("/user",async(req,res)=>{
//   const userEmail =req.body.emailId;

//    try{
//     console.log(userEmail);
//     const user=await User.findOne({emailId:userEmail});
//     if(!user){
//       res.status(404).send("User not found");
//     }else{
//       res.send(user);
//     }
//      }catch(err){
//     res.status(400).send("Something went wrong")
//   }
//   });

// // Feed Api -Get/feed -get all the users from the database 
// app.get("/feed",async(req,res)=> {
//   try {
//        const users=await User.find({});
//        res.send(users);
//   }catch(err){
//     res.status(400).send("Something went wrong");
//   }   
// });

// //to delete the user --->findByIdAndDelete

// app.delete("/user",async(req,res)=>{
//   const userId=req.body.userId;
//   try{
//     // const user=await User.findByIdAndDelete({_id: userId});

//     const user =await User.findByIdAndDelete(userId);
//     res.send("User Deleted successfully");
//   }
//   catch(err){
//     res.status(400).send("Something went wrong");
//   }
// });


// Update data of the user
//findByIdAndUpdate
//post and patch api need strict checks 


app.patch("/user/:userId",async(req,res)=>{
  // we put the ? if the user id not present 
  const userId=req.params?.userId;
  //data means what are the things we need to update  
  // I  will validate my request body

  const data=req.body;
  // i am passing the whole data 
  //if you are passing skills suppose which is not present ,it will not be stored as it is not present in the Schema 
  console.log(data);
  try {

    const Allowed_UPDATES = [
    "photoUrl",
    "about",
    "gender",
    "age",
    "skills",
    ];
  // i will check if the respective key is present or not 
  // you cann't update the random things 
   
  const isUpdateAllowed=Object.keys(data).every((k)=>
  Allowed_UPDATES.includes(k)
  );
  if(!isUpdateAllowed){
    throw new Error("Update not allowed ")
  }
  if(data?.skills.length>10){
    throw  new Error ("Skills cannot be more than 10");
  }
  console.log(data);
  // looping through each key on it 
    // it will return the document before the update was applied 
    // options you can used Before and After 
    //You can tweak this option accordingly

    const user =await User.findByIdAndUpdate({_id:userId},data,
      {returnDocument: 'after',
       runValidators: true,   
      });
    console.log(user);
    res.send("User updated successfullly");
  } catch(err){
    res.status(400).send("Something went wrong: " + err.message)
  }
});


 
// Update the user with the email id 

app.patch("/user1", async (req, res) => {
  const { emailId, ...data } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { emailId },
      data,
      { returnDocument: "after" }
    );

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("User updated successfully");
    }

  } catch(err) {
    console.log(err.message);  // check terminal for exact error
    res.status(400).send("Something went wrong: " + err.message);
  }
});


connectDB()
.then(()=>{
    console.log("Database connection established....");
    app.listen(7777,()=>{
    console.log("Server is successfully listening on port 7777....");
});
})
.catch((err)=>{
  console.error("Database cannot be connected:", err.message)
});




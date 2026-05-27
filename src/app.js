const express=require("express");

const connectDB =require("./config/database")

const app=express();

const User=require("./models/user");

const {validateSignUpData}=require("./utils/validation");

const validator=require("validator");
const bcrypt =require("bcrypt");
app.use(express.json());

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



app.post("/login",async(req,res)=>{
  try {
    const {emailId,password}=req.body;
     if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address");
    }
    // it will return the one email id 
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    // bcrypt.compare is there to check the password 
    
    // const isPasswordValid=bcrypt.compare("Elon@123",
    //   "$2b$10$qic2i2xAN6DcRcJAEv39au/xd649scg05NegxJfl/WcnSczGo/9kS"
    // )
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(isPasswordValid){
      res.send("Login Successful!!!");
    }
    else {
      throw new Error("Password is not correct");
    }
  }catch(err){
    res.status(400).send("ERROR :" +err.message);
  }
});


// api creation then we 
app.post("/signup",async(req,res)=>{
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

//go to the documentation api>Model>Model.find()

// Get user by email 
//findbyid()--- if you have the id 

//findOne with the email of the user 

app.get("/user",async(req,res)=>{
  const userEmail =req.body.emailId;

   try{
    console.log(userEmail);
    const user=await User.findOne({emailId:userEmail});
    if(!user){
      res.status(404).send("User not found");
    }else{
      res.send(user);
    }
     }catch(err){
    res.status(400).send("Something went wrong")
  }
  });

// Feed Api -Get/feed -get all the users from the database 
app.get("/feed",async(req,res)=> {
  try {
       const users=await User.find({});
       res.send(users);
  }catch(err){
    res.status(400).send("Something went wrong");
  }   
});

//to delete the user --->findByIdAndDelete

app.delete("/user",async(req,res)=>{
  const userId=req.body.userId;
  try{
    // const user=await User.findByIdAndDelete({_id: userId});

    const user =await User.findByIdAndDelete(userId);
    res.send("User Deleted successfully");
  }
  catch(err){
    res.status(400).send("Something went wrong");
  }
});


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




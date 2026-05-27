const express=require("express");

const connectDB =require("./config/database")

const app=express();

const User=require("./models/user");

app.use(express.json());

// to get the info of the Model.findByIdAndUpdate
// go to the Api then model

//in the option you will see the run validators 
// explictly allowed 
// run validators =true
//you can run custom validations




// api creation then we 
app.post("/signup",async(req,res)=>{
  
  // creating a new instance of the User model 
     const user=new User (req.body);

     try {
     await user.save();
     res.send("User Added successfully");
     }catch (err){
      res.status(400).send("Error  saving the user:" + err.message);
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




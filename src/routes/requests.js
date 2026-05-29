const express=require("express");

const requestRouter=express.Router();

const {userAuth}=require("../middlewares/auth");
// this is intern level code 
// here the api doesnt have validation 
// if i put accept 
//but this api is for interested and ignored

const ConnectionRequest=require("../models/connectionRequest");
const User=require("../models/user");
// from User id is the person ,who is already logged in 
//First edgecase :status should be interested and ignored only
//Second Edgecase: they should not send the same request again 
//It will be a duplicate connection Request 

//Third EdgeCase:Akshay can send the request to the Akshay itself

// We have to check touserId should be present in th db 



requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
 try{
   const fromUserId=req.user._id;
   const toUserId=req.params.toUserId;
   const status=req.params.status;

   const allowedStatus=["ignore","interested"];
   if( !allowedStatus.includes(status)){
      return res.status(400).json({message:"Invalid status type"+status})
   }
   const toUser=await User.findById(toUserId);
   if(!toUser){
    return res.status(404).json({message:"User not found"});
   }

  // if there is an existing ConnectionRequest 
  const existingConnectionRequest=await ConnectionRequest.findOne({
    $or:[
      {fromUserId,  toUserId},
      {fromUserId:toUserId,toUserId:fromUserId},
    ],
    
  });
  if(existingConnectionRequest){
    return res
    .status(400)
    .send({message:"Connection Request Already Exists!!"});

  }

   // creating the new instances of the connection
   const connectionRequest=new ConnectionRequest({
    fromUserId,
    toUserId,
    status,
   });

   const data=await connectionRequest.save();

  //  res.json({
  //   message: "Connection Request Sent Successfully!",
  //   data
  //  });
  res.json({
    message: req.user.firstName + "is" +  status  + "in" +toUser.firstName,
    data
  })

 }  catch(err){
  res.status(400).send("ERROR: " + err.message);
 }
}
);

// {
//     "message": "Connection Request Sent Successfully!",
//     "data": {
//         "fromUserId": "6a170f95c11b0d05776ea117",
//         "toUserId": "6a17323a5dfed4e5de15cf01",
//         "status": "interested",
//         "_id": "6a193f2ee20aebd62af186fc",
//         "createdAt": "2026-05-29T07:24:30.421Z",
//         "updatedAt": "2026-05-29T07:24:30.421Z",
//         "__v": 0
//     }
// }

module.exports=requestRouter
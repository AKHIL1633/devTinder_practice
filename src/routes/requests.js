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

const {sendEMail}=require("../utils/sendEmail "); 



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
   
  //  const emailRes=await sendEmail.run();

  const emailRes=await sendEmail.run("A new friend  request from "
    + req.user.firstName + "is" + status + "in" + toUser.firstName
  );

   console.log(emailRes);

  // Whenever someone is sending the connection request  a email will be triggered 
  // First of all we have created the SES CLIENT 

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

// userAuth ,the token is valid or not in the cookie 
// if everything works fine we will move to the request handler 

requestRouter.post("/request/review/:status/:requestId",userAuth,
  async(req,res)=>{
    // you will get this with user.Auth
    // make sure you cover all corner cases 

    try{
    const loggedInUser=req.user;
    const{status,requestId}=req.params;

    const allowedStatus=["accepted","rejected"];
    if( !allowedStatus.includes(status)){
      return  res.status(400).json({
        message : "Status not allowed!"
      });
    }

    
    const connectionRequest=await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested"
    })
    if(!connectionRequest){
      return  res
      .status(404)
      .json({message:"Connect request not found"});
    }
    //Akshay ==> Elon Akshay is sending to Elon ,i should only work Elon 
    // should be loggined in 
    // Elon is authorise to approve the request 
    // if the connection state is ignored , you cant change it 
    // you cant send the request again  
    // the status should be interested 
     
    // Validate the status

    // Akshay ==> Elon
    // loggedInId  == toUserId
    // status = interested
    //request Id should be valid 

    connectionRequest.status=status;
    const data=await connectionRequest.save();
    res.json({message: "Connection request"+ status,data})

    }catch(err){
      res.status(400).send("ERROR: "+err.message);
    }
  }
)

module.exports=requestRouter
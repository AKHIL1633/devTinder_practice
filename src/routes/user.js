const express=require('express');
const userRouter=express.Router();

//Get all the pending connection request for the loggedIn user

const {userAuth}=require("../middlewares/auth")
const ConnectionRequest=require("../models/connectionRequest");

userRouter.get("/user/requests/received",userAuth,async(req,res)=>
{
    try{
        // FIND RETURNS YOU AN ARRAY
        // fIND ONE RETURN YOU ONE OBJECT

        // whatever connection request i have got 


        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",   
        }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","about","skills"])

        // if you dont put thearray ,it will populate all the things 
        // for the get ,you have to think you dont fetch all the data 
        //it is a kind of filter 
        // .populate("fromUserId","firstName lastName")


        res.json({message:"Data fetched successfully",
        data:connectionRequests,
        })

    }catch(err){
        req.statusCode(400).send("ERROR:" +err.message)
    }
})

const USER_SAFE_DATA="firstName lastName  photoUrl age gender about skills";
// to get all the user connected to me .i need thatinformation

//status is accepted 
//logined user is from and to userid 

// Akshay => Elon => accepted
// Elon => Mark == > accepted
// Elon can be from and to user 



userRouter.get("/user/connections",userAuth,async(req,res) => {
    try{
       const loggedInUser=req.user;
       const connectionRequests = await ConnectionRequest.find({
        $or : [
            {
                toUserId : loggedInUser._id,status:"accepted" 
            },
            {
                fromUserId:loggedInUser._id,status:"accepted"
            },
        ]
       }).populate("fromUserId",USER_SAFE_DATA)
         .populate("toUserId",USER_SAFE_DATA)

       const data = connectionRequests.map((row)=>{
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        return row.toUserId
        }
     return row.fromUserId;
      });
       res.json({data});
    }
    catch (err){
        res.status(400).send({message:err.message});
    }

})

module.exports=userRouter;

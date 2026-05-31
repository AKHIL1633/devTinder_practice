const express=require('express');
const userRouter=express.Router();

//Get all the pending connection request for the loggedIn user

const {userAuth}=require("../middlewares/auth")
const ConnectionRequest=require("../models/connectionRequest");

const User=require("../models/user");

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

// if i want to see the feed of Akshay
// There is no mean to show the card of whom who has not accepted
// interested one or ignored one ,he does not see 
//Akshay should not see his card of itself
// logic is complex 
//Can be the interview question as well



// if my database has million of users 
// We should add pagination ,my api should show 10 user in 1 page 


// userRouter.get("/feed",userAuth,async(req,res)=>{
//     try {
//          // user should avoid certain cards  , see all the user cards except
//          // his own card
//          // his connection
//          // ignored people he should not see
//          // already sent the connection request (also he doest not see)

//          // Example : Rahul=[Akshay,Elon,Mark,Donald,MsDhoni ,Virat]
//          // Rahul ==> Akshay , Rahul ==>Elon 
//          //Rahul =[Mark,Donald,MsDhoni,Virat]
//          //Rahul -> Akshay -> rejected Rahul ->Elon -> Accepted
//         // Akshay will not see Rahul 

//         const loggedInUser=req.user;
//         // Find all connection requests ( sent +received ) that i will not see in the feed
//         // send or recive the connection by me 

//         const connectionRequests = await ConnectionRequest.find({
//             $or: [
//                 {
//                     fromUserId:loggedInUser._id ,
//                 },
//                 {
//                     toUserId:loggedInUser._id,
//                 }
//             ]
//         }).select("fromUserId toUserId")



     
//     // it will  alwayscontain unique element


//     const hideUsersFromFeed=new Set();
//     connectionRequests.forEach((req) =>{
//         hideUsersFromFeed.add(req.fromUserId.toString());
//         hideUsersFromFeed.add(req.toUserId.toString());
//     })
//     // console.log(hideUsersFromFeed)
//     const users=await User.find({
//        $and: [ 
//         { _id: {$nin:Array.from(hideUsersFromFeed)}},
//         { _id: {$ne:loggedInUser._id}},
//        ]
//     }).select(USER_SAFE_DATA);

//       res.send(users);
//     }
//     catch(err){
//         res.status(400).json({message:err.message})
//     }
// })


// http://localhost:7777/feed?page=2&limit=2
//limit=100000 lots of cost

userRouter.get("/feed",userAuth,async(req,res)=>{
    try {
         //  /feed:skip  
         //  req.params

         //  /feed?limit=1
         //  req.query

         // user should avoid certain cards  , see all the user cards except
         // his own card
         // his connection
         // ignored people he should not see
         // already sent the connection request (also he doest not see)

         // Example : Rahul=[Akshay,Elon,Mark,Donald,MsDhoni ,Virat]
         // Rahul ==> Akshay , Rahul ==>Elon 
         //Rahul =[Mark,Donald,MsDhoni,Virat]
         //Rahul -> Akshay -> rejected Rahul ->Elon -> Accepted
        // Akshay will not see Rahul 


        const loggedInUser=req.user;
        const page=parseInt(req.query.page) //1
        let limit=parseInt(req.query.limit) //10
        limit=limit > 50 ? 50 : limit
        // we need to calculate the skip 

        const skip=(page-1)* limit ;

        // Find all connection requests ( sent +received ) that i will not see in the feed
        // send or recive the connection by me 

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {
                    fromUserId:loggedInUser._id ,
                },
                {
                    toUserId:loggedInUser._id,
                }
            ]
        }).select("fromUserId toUserId")



     
    // it will  alwayscontain unique element


    const hideUsersFromFeed=new Set();
    connectionRequests.forEach((req) =>{
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    })
    // console.log(hideUsersFromFeed)
    const users=await User.find({
       $and: [ 
        { _id: {$nin:Array.from(hideUsersFromFeed)}},
        { _id: {$ne:loggedInUser._id}},
       ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)

      res.json({data :users});
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})




module.exports=userRouter;

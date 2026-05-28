//  const adminAuth=(req,res,next)=>{
//     console.log("Admin auth is getting checked");
//     const token= "xyz";
//      const isAdminAuthorized =token ==="xyz";
//      if(!isAdminAuthorized){
//          res.status(401).send("Unauthorised request ");
//      }
//     else {
//         next();
//     }
// };
// const userAuth=(req,res,next)=>{
//     console.log("User  auth is getting checked");
//     const token= "xyz";
//      const isAdminAuthorized =token ==="xyz";
//      if(!isAdminAuthorized){
//          res.status(401).send("Unauthorised request ");
//      }
//     else {
//         next();
//     }
// };


const jwt=require('jsonwebtoken');
const User=require("../models/user");

//Job of the middleware is Read the token 

const userAuth =async(req,res,next)=>{
    // Read the token from the req cookies 
    try{
    const cookies =req.cookies ;
    const {token}=cookies;
    //if token exist or not
    if(!token) {
        throw new Error("Token is not valid!!!!!!!!!");

    }

    const decodedObj=await jwt.verify(token,"DEV@Tinder$798");

    const{_id }=decodedObj;

    const user=await User.findByIdAndUpdate(_id);
    if(!user){
        throw new Error("User not found");
    }
  // because this is a middleware we will call next ,
  // next is called to move the  request handler 
  //attaching the user to the request one 

  req.user=user;
  next();
}catch(err){
    res.status(400).send("ERROR:" + err.message);
  }

    //Validate the token 
    // Find the user 

}



module.exports={
    userAuth,
}
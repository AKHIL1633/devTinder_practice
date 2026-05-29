const express=require("express");

const profileRouter=express.Router();

const {userAuth}=require("../middlewares/auth");

const {validateEditProfileData}=require("../utils/validation");

const bcrypt=require("bcrypt");

profileRouter.get("/profile/view",userAuth,async(req,res)=> {
try{
  const user=req.user;
  res.send(user);
}
catch(err) {
  res.status(400).send("ERROR : " + err.message);
}
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
// pause a moment and think about the logic 
 try{
   if(!validateEditProfileData(req)){
    throw new Error("Invalid Edit Request");
    //return res.status(400).send("")
   }
   //auth middleware has attached to it 

   const loggedInUser=req.user;
  //  console.log(loggedInUser);

  //bad way of doing it 

  // loggedInUser.firstName=req.body.firstName;
  // you have to loop over all this fields

  Object.keys(req.body).forEach((key=>loggedInUser[key]=req.body[key]))
  await loggedInUser.save();
  // res.send(`${loggedInUser.firstName},  your Profile Updated successfully`);
  res.json({message:`${loggedInUser.firstName},your profile updated successfully`,
    data:loggedInUser,
  });

// output will come like this 

//   {
//     "message": "Akshay,your profile updated successfully",
//     "data": {
//         "_id": "6a170f95c11b0d05776ea117",
//         "firstName": "Akshay",
//         "lastName": "Saini",
//         "emailId": "akshay@gmail.com",
//         "password": "$2b$10$5y4aNBEx9HacGzlorhQyseifIddUf7DMts3XMaDZVMLQVgAwClGKa",
//         "photoUrl": "https://img.magnific.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?semt=ais_hybrid&w=740&q=80",
//         "createdAt": "2026-05-27T15:36:53.271Z",
//         "updatedAt": "2026-05-29T05:41:59.151Z",
//         "__v": 1,
//         "age": 29,
//         "gender": "male",
//         "about": "Software Engineer by profession and a teacher by heart",
//         "skills": [
//             "javascript",
//             "react",
//             "node"
//         ]
//     }
// }


  // res.send("Profile Updated Successfully");

 }catch(err){
  res.status(400).send("ERROR:"+ err.message)
 }


}
)
profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
  try{
    const {oldPassword,newPassword}=req.body;

    if(!oldPassword || !newPassword){
      throw new Error("Both oldPassword and newPassword are required");
    }

    const loggedInUser=req.user;

    const isOldPasswordValid=await loggedInUser.validatePassword(oldPassword);
    if(!isOldPasswordValid){
      throw new Error("Incorrect old password");
    }

    if(oldPassword===newPassword){
      throw new Error("New password must be different from old password");
    }

    const validator=require("validator");
    if(!validator.isStrongPassword(newPassword)){
      throw new Error("Please enter a strong new password");
    }

    const hashedNewPassword=await bcrypt.hash(newPassword,10);
    loggedInUser.password=hashedNewPassword;
    await loggedInUser.save();

    res.json({message:"Password updated successfully"});

  }catch(err){
    res.status(400).send("ERROR:"+err.message);
  }
});

module.exports=profileRouter;

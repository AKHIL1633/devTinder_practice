const validator=require('validator')

const validateSignUpData =(req)=>{
   const {firstName,lastName,emailId,password}=req.body; // destructuring this object 

   if(!firstName || !lastName){      // checking if the firstname and lastname exist or not ,also you can check the length as well 
                                     // you can rely on the check of the schema level as well to make your api as secure as possible
    throw new Error("Name is not valid");
   }
  else if(!validator.isEmail(emailId))   /// we have one library of validator  
   {
    throw new Error("Email is not valid ");
   }
   else if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a strong password!");
    }
};

const validateEditProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","emailId","photourl",
        "gender","age","about","skills"]
  // i will loop through this allowed fields
     const  isEditAllowed =Object.keys(req.body).every(field => allowedEditFields.includes(field));
     return isEditAllowed
}

module.exports ={
    validateSignUpData,
    validateEditProfileData,
}


//    else if (firstName.length<4 || firstName.length>50){
//     throw new Error("FirstName should be 4-50 characters");
//    }
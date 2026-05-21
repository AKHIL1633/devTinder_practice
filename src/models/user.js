const mongoose=require("mongoose");
const userSchema =new mongoose.Schema ({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
     type: String
    },
    password: {
        type: String
    },
    age: {
        type:Number
    },
    gender: {
        type:String
    }
});
// schema define the model 


//First argument will be the name of the model and second one will be schema type 
// const userModel =mongoose.model("User",userSchema);

// module.exports=userModel;

module.exports=mongoose.model("User",userSchema);


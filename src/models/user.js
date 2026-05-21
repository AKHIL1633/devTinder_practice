const mongoose=require("mongoose");
const userSchema =new mongoose.Schema ({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String
    },
    // there can be changes of space in the front and at the end,otherwise mongo db will treat it differently
    // to make your data more safe and clean
    emailId: {
     type: String,
     lowercase:true, // whatever the user is sending it is changed to the lower case 
     required:true,
     unique:true,
     trim:true
    },

    password: {
        type: String,
        required:true
    },
    age: {
        type:Number,
        min:18,

    },
    //custom function validation
    // as soon data is put into database ,the validation will run ,if it throw some error then it will not be validated
    //but then also it has been updatedin gender hello
    //by default it is called ,when new documents is created 
    // you have to make use of runvalidators  for findByIdAndUpdate

    gender: {
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
               throw new Error("Gender data is not valid");
            }
        }
    },

    photoUrl:{
        type:String,
        default:"https://img.magnific.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?semt=ais_hybrid&w=740&q=80",
    },
    about:{
        type: String,
        default:"This is a default about of the user",
    },
    skills:
    {
        type:[String],
    }
},{
    timestamps: true,
});
// schema define the model 


//First argument will be the name of the model and second one will be schema type 
// const userModel =mongoose.model("User",userSchema);

// module.exports=userModel;

module.exports=mongoose.model("User",userSchema);

// in the schema itself you can add createdAt 
// type:Date



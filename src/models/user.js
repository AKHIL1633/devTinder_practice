const mongoose=require("mongoose");

const validator=require("validator");

const bcrypt =require("bcrypt");


/// mongoose documention schema types 
/// you can read about the Schema Types 
// mongoose Schema Type Options 

// required field -- boolean value True and False 
// firstname , emailid ,password

// unique field 
// There must be one user with one emil id 
// other  value should not be there 

//Default Value 
// photoUrl --- dummy photo url link from google you have put
//about  = "This is a default about of the user "

//Whenever a new user ,registered withouth the about section

/// usecase of email id 
// Someone has added the random email id 
//email id will be stored automatically 
// i want my email -id in lowe case 
// Sometimes user enter the email id with space in fromt  and the end 
// i mean the whitespaces ,i dont want the whitespace of it 
// Make use of Trim 


// Minlength for the firstName 
// For the age - it is number 
// you can put min and max of it 

// custom validate function
// validate (value)
// if value is male ,female ,others includes 
 
// timestamps -- true
// mongodb will add created At and updated At

// you can add in the schema as well
// createdAt
// type : Date

// you can test it using the sign up 
// regesitering the user with the first name ,lastname 
// email id and password 

// you can add the skills in the form of Array 
//It is good to put the timestamp 

// Every field can have validation

// Explore schematype options from the documentation
// add required ,unique ,lowercase,min,minlength,trim
//Add default
//Create  a custom validate function for gender
//Improve The Db schema -Put all appropriate validations on each filed in SCHEMA
//Add timestamps to the userschema





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
     trim:true,
     validate(value){
       if(!validator.isEmail(value)){
        throw new Error("Invalid email address")
       }
     }
    },

    password: {
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password" +value);
            }
        }
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
        validate(value){
        if(!validator.isURL(value)){
        throw new Error("Invalid Photo Url: ",+ value);
       }
    },
    about:{
        type: String,
        default:"This is a default about of the user",
    },
    skills:
    {
        type:[String],
    }
}
},{
    timestamps: true,
});
// schema define the model 


// Akshay and Elon all are instances of the user  models
// So when i refer to the this over here 
//here this  will refer to that particular instances 

// this keyword will not work with arrow functions 



userSchema.methods.getJWT=async function(){
  const user=this
  const token=await jwt.sign({_id: user._id},"DEV@Tinder$798",{
    expiresIn:"7d",
  });
  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user =this ;
    const passwordHash=user.password;

    // 
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    return isPasswordValid;

}

//First argument will be the name of the model and second one will be schema type 
// const userModel =mongoose.model("User",userSchema);

// module.exports=userModel;

module.exports=mongoose.model("User",userSchema);

// in the schema itself you can add createdAt 
// type:Date



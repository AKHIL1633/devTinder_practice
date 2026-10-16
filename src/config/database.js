const mongoose=require("mongoose");

//mongoose.connect return you a promise 
// server should not listen the first ,it should connect to the database first 


const connectDB = async () => {
  await mongoose.connect(
   process.env.MONGODB_URI
  );
};

module.exports=connectDB;






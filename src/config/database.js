const mongoose=require("mongoose");

//mongoose.connect return you a promise 
// server should not listen the first ,it should connect to the database first 


const connectDB = async () => {
  await mongoose.connect(
   "mongodb://namsatedev:King1%40163@ac-f9zcq3a-shard-00-00.awsi177.mongodb.net:27017,ac-f9zcq3a-shard-00-01.awsi177.mongodb.net:27017,ac-f9zcq3a-shard-00-02.awsi177.mongodb.net:27017/devTinder?ssl=true&replicaSet=atlas-14ntx8-shard-0&authSource=admin&appName=NamasteNode"
  );
};

module.exports=connectDB;






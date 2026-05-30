const mongoose=require('mongoose');

// we use enum to restrict the user for some value
//mongoose :pre in schemas
//it is a middleware 

const connectionRequestSchema=new mongoose.Schema({
 fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
    // referencing to the user collection

    ref:"User",
    required:true,

 },
 toUserId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 status:{
type:String,
enum:{
    values:["ignore","interested","accepted","rejected"],
    message:`{VALUE} is incorrect status type`,
}
 }
},{
timestamps:true,
}
);
//before i savE this ,the function will be called whenever i am saving the connectionRequest
//it is not mandatory to write this 
//we can write the same logic in api level as well

//ConnectionRequest.find({fromUserId:2424242424242)
// this will very fast 
// for toUserId ,it will be fast
// 1 in increasing order 

connectionRequestSchema.index({fromUserId:1,toUserId:1});


connectionRequestSchema.pre("save", async function() {
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
      throw new Error("Cannot send connection request to yourself!");
    }
});

const ConnectionRequest=new mongoose.model("ConnectionRequest",
    connectionRequestSchema);
module.exports=ConnectionRequest;
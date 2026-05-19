// // console.log("Starting a new Project");

// const express=require("express");

// const app=express();

// // app.use("/",(req,res)=>{
// //     res.send("Namaste from the Akhil  dashboard ");
// // })

// app.use ("/hello",(req,res)=>{
//     res.send("Hello hello hello");
// })

// app.use("/test",(req,res)=>{
//   res.send("Hello from the server!");
// });

// app.listen(7777,()=>{
//     console.log("Server is successfully listening on port 3000 ......");
// });

// // the sequence of the code matters here 
// //the code will run start running from the top ,order is very important 

const express=require("express");

const app=express()

//use will match all the Http method Api calls 
//This will only handle Get call to /user


app.use("/user",(req,res)=>{
    res.send("Hahahaha");
})

app.get("/user",(req,res) =>{
    res.send({firstName: "Akshay", lastName: "Saini"});
})

//saving data to the db
app.post("/user",(req,res)=>{
    console.log("Save Data to the database");
    res.send("Data successfully saved to the database ");
})


app.delete("/user",(req,res)=>{
    res.send("Deleted successfully");
})

 
app.listen(7777,() => {
    console.log("Server is successfully listening on port 7777...");
})
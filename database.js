const { MongoClient } =  require("mongodb")



const url =
"mongodb+srv://namsatedev:King1@163@namastenode.awsi177.mongodb.net/?appName=NamasteNode"

const client=new MongoClient(url);

const dbName='HelloWorld';

async function main(){
    await client.connect();
    console.log("Connected successfully to server");
    const db=client.db(dbName);
    const  collection=db.collection("User");
    return 'done';
}


// npm package  npm mongodb
//npm is a repoistory which contain lot of packages ,modules 

// it is central repoistory
// first we install it in our project 
// npm install mongodb

// Notes
// Go to mongodb website
// Create a free M0 cluster 
//Create a user 
//Get the connection string
//Install Mongo DB compass

//you can go the api docs 





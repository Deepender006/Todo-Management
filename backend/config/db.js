const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
         console.log(process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connect");
    }catch(error){
        console.log("MongoDB Not Connected");
        console.log(error);
        process.exit(1);
    }
};
module.exports = connectDB;
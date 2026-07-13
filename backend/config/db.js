const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connect");
    }catch(error){
        console.log("MongoDB Not Connected");
        console.log(error.message);
        process.exit(1);
    }
};
module.exports = connectDB;
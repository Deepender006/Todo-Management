const express = require("express");
const dotenv = require("dotenv");
const cors=require("cors");
const connectDB=require("./config/db");
const todoRoutes=require("./routes/todoRoutes");
const authRoutes=require("./routes/authRoutes");
dotenv.config();
connectDB();
const app =express();
app.use(cors(
    {
    origin: [
        "https://todo-management-1-ue8f.onrender.com",
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
));
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/todos",todoRoutes);
app.get ('/',(req,res)=>{
    res.send("WELCOME TO TODO-MANAGEMENT");
});
const PORT=process.env.PORT||4000;
app.listen(PORT,()=>{
    console.log(`App server is running on Port:${PORT}`);
});

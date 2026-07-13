const mongoose=require("mongoose");
const todoSchema= new mongoose.Schema({
    taskName:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    priority:{
        type:String,
        enum:["Low","Medium","High"],
        default:"Medium"
    },
    status:{
        type:String,
        enum:[,"Not Started","In Progress","Completed"],
        default:"Not Started"
    },
    dueDate:{
        type:Date,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{timestamps:true});

module.exports=mongoose.model("Todo",todoSchema);
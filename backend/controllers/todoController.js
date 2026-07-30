const Todo = require("../models/Todo");
// CREATE TODOS
const createTodo = async (req, res) => {
  try {
    const todo = await Todo.create({
      taskName: req.body.taskName,
      status:req.body.status,
      priority: req.body.priority,
      user: req.user.id,
      
    });

    res.status(201).json({
      message: "Todo Created Successfully",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to create todo",
      error: error.message,
    });
  }
};
// GET ALL TODOS
const getTodos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const todos = await Todo.find({
            user: req.user.id
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
        
        const totalTodos = await Todo.countDocuments({
            user: req.user.id
        });

        res.status(200).json({
            message: "Todo received successfully",
            data: todos,
            currentPage: page,
            totalPages: Math.ceil(totalTodos / limit),
            totalTodos: totalTodos
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to receive Todo",
            error: error.message
        });
    }
}; 
// GET TODO BY ID
const getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo received successfully",
            data: todo
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to receive todo",
            error: error.message
        });
    }
};
// UPDATE TODO
const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
  taskName: req.body.taskName,
  status:req.body.status,
  priority: req.body.priority,
},
            {returnDocument: "after"}
        );

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo updated successfully",
            data: todo
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to update todo",
            error: error.message
        });
    }
};
// DELETE TODO
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to delete todo",
            error: error.message
        });
    }
};
module.exports = {
    createTodo,getTodos,getTodoById,updateTodo,deleteTodo
};   
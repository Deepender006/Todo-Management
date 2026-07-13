const Todo = require("../models/Todo");
// CREATE TODOS
const createTodo = async (req, res) => {
  try {
    const todo = await Todo.create({
      taskName: req.body.taskName,
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
        const todos = await Todo.find({
            user: req.user.id
        });

        res.status(200).json({
            message: "Todo received successfully",
            count: todos.length,
            data: todos
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
},
            { new: true }
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
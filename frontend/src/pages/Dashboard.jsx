import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const getTodos = async () => {
    try {
      const res = await API.get("/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodos(res.data.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const saveTodo = async () => {
    if (!taskName.trim()) return;

    try {
      if (editId) {
        await API.put(
          `/todos/${editId}`,
          { taskName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Todo Updated Successfully");
        setEditId(null);
      } else {
        await API.post(
          "/todos",
          { taskName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Todo Added Successfully");
      }

      setTaskName("");
      getTodos();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
  const editTodo = (todo) => {
    setTaskName(todo.taskName);
    setEditId(todo._id);
  };
  const deleteTodo = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Todo Deleted Successfully");
      getTodos();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">

        <div className="dashboard-header">
          <h2>Todo Dashboard</h2>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="todo-input">
          <input
            type="text"
            placeholder="Enter Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />

          <button className="add-btn" onClick={saveTodo}>
            {editId ? "Update Todo" : "Add Todo"}
          </button>
        </div>

        <div className="todo-list">
          <ul>
            {todos.length > 0 ? (
              todos.map((todo) => (
                <li key={todo._id}>
                  <span>{todo.taskName}</span>

                  <div>
                    <button onClick={() => editTodo(todo)}>
                      Edit
                    </button>

                    <button onClick={() => deleteTodo(todo._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No Todos Found</p>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
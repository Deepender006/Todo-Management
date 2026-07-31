import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import AppSnackbar from "../components/Snackbar";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [priority, setPriority] = useState("Medium");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const [search , setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalTodos, setTotalTodos] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const getTodos = async () => {
    try {
      const res = await API.get(`/todos?page=${page}&limit=${limit}&search=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (page !== res.data.currentPage) {
      setPage(res.data.currentPage);
      return;
    }
      setTodos(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalTodos(res.data.totalTodos);
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
          {
            taskName,
            status,
            priority,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSnackbar({
          open: true,
          message: "Todo Updated Successfully",
          severity: "success",
        });
      } else {
        await API.post(
          "/todos",
          {
            taskName,
            status,
            priority,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSnackbar({
          open: true,
          message: "Todo Added Successfully",
          severity: "success",
        });
      }
      setTaskName("");
      setStatus("Not Started");
      setPriority("Medium");
      setEditId(null);
      await getTodos();
    } catch (err) {
      console.log(err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  };

  const editTodo = (todo) => {
    setTaskName(todo.taskName);
    setStatus(todo.status);
    setPriority(todo.priority);
    setEditId(todo._id);
  };

  const deleteTodo = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this todo?");
    if (!confirmDelete) return;
    try {
      await API.delete(`/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbar({
        open: true,
        message: "Todo Deleted Successfully",
        severity: "success",
      });
      await getTodos();
    } catch (err) {
      console.log(err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: "Failed to delete todo",
        severity: "error",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    getTodos();
  }, [page,searchQuery]);

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
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <button className="add-btn" onClick={saveTodo}>
            {editId ? "Update Todo" : "Add Todo"}
          </button>
        </div>
        <div className="search-box">
         <input
            type="text"
            placeholder="Search Todo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        <button
         onClick={() => {
          setPage(1);
          setSearchQuery(search);
         }}
        >
          Search
        </button>
       </div>
        <div className="todo-list">
          <ul>
            {todos.length > 0 ? (
              todos.map((todo) => (
                <li key={todo._id}>
                  <div className="todo-details">
                    <span>{todo.taskName}</span>
                    <span>Status: {todo.status}</span>
                    <span>Priority: {todo.priority}</span>
                  </div>
                  <div>
                    <button onClick={() => editTodo(todo)}>Edit</button>
                    <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                  </div>
                </li>
              ))
            ) : (
              <p>No Todos Found</p>
            )}
          </ul>
        </div>
        {totalPages > 0 && (
  <div className="pagination">
    <button
      disabled={page === 1}
      onClick={() => {
      if (page > 1) {
     setPage(page - 1);
    }
}}
    >
      Previous
    </button>
    <span>
      Page {page} of {totalPages}
    </span>
    <button
      disabled={page >= totalPages}
      onClick={() => {
     if (page < totalPages) {
     setPage(page + 1);
    }
}}
      
    >
      Next
    </button>
  </div>
)}
        <AppSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
        />
      </div>
    </div>
  );
}
export default Dashboard;
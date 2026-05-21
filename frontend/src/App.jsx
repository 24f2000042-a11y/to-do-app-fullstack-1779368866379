import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/todos`);
      setTodos(res.data);
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/todos`, { text: newTodo });
      setTodos([...todos, res.data]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {error && <div className="error">{error}</div>}
      <h1 className="title">Todo List</h1>
      <form className="input-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a todo"
        />
        <button onClick={addTodo} disabled={loading}>Add</button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo._id} className="todo-item">
            {todo.text}
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
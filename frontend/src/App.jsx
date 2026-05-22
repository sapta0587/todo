import { useState, useEffect } from 'react';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import './App.css';

const API = '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);

  // Fetch all todos when the component first mounts
  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(setTodos)
      .catch(err => console.error('Failed to fetch todos:', err));
  }, []);

  // Add a new todo (optimistic insert)
  const addTodo = (title) => {
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
      .then(res => res.json())
      .then(newTodo => setTodos(prev => [newTodo, ...prev]));
  };

  // Toggle completed status
  const toggleTodo = (id) => {
    fetch(`${API}/${id}`, { method: 'PUT' })
      .then(res => res.json())
      .then(updated =>
        setTodos(prev => prev.map(t => (t.id === id ? updated : t)))
      );
  };

  // Delete a todo
  const deleteTodo = (id) => {
    fetch(`${API}/${id}`, { method: 'DELETE' }).then(() =>
      setTodos(prev => prev.filter(t => t.id !== id))
    );
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <AddTodo onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}

export default App;

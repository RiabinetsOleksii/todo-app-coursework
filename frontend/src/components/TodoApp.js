import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const API_URL = 'http://localhost:8080/api/todos';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // all | active | completed

  const loadTodos = async () => {
    const response = await axios.get(API_URL);
    setTodos(response.data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async (title) => {
    await axios.post(API_URL, { title, completed: false });
    loadTodos();
  };

  const deleteTodo = async (id) => {
    if (window.confirm('Видалити цю задачу?')) {
      await axios.delete(`${API_URL}/${id}`);
      loadTodos();
    }
  };

  const toggleTodo = async (id) => {
    await axios.put(`${API_URL}/${id}/toggle`);
    loadTodos();
  };

  const updateTodo = async (id, newTitle) => {
    const todo = todos.find((t) => t.id === id);
    await axios.post(API_URL, { title: newTitle, completed: todo.completed });
    await axios.delete(`${API_URL}/${id}`);
    loadTodos();
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div style={styles.container}>
      <TodoForm onAdd={addTodo} />

      <div style={styles.filters}>
        <button
          onClick={() => setFilter('all')}
          style={filter === 'all' ? styles.activeFilter : styles.filter}
        >
          Усі
        </button>
        <button
          onClick={() => setFilter('active')}
          style={filter === 'active' ? styles.activeFilter : styles.filter}
        >
          Активні
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={filter === 'completed' ? styles.activeFilter : styles.filter}
        >
          Виконані
        </button>
      </div>

      <TodoList
        todos={filteredTodos}
        onDelete={deleteTodo}
        onToggle={toggleTodo}
        onUpdate={updateTodo}
      />
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginTop: 30,
  },
  filters: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  filter: {
    backgroundColor: '#f0f0f0',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  activeFilter: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 8,
    cursor: 'pointer',
  },
};

export default TodoApp;

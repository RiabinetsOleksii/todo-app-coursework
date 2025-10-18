import React from 'react';

function TodoList({ todos, deleteTodo, toggleTodo }) {
  if (!todos.length) return <p style={{ textAlign: 'center' }}>Поки що задач немає</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map(todo => (
        <li key={todo.id} style={{
          background: '#fff', margin: '8px 0', padding: 12, borderRadius: 6,
          display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
          <span style={{
            marginLeft: 12, flexGrow: 1,
            textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#888' : '#111'
          }}>
            {todo.title}
          </span>
          <button onClick={() => deleteTodo(todo.id)} style={{
            background: '#ff6b6b', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 4
          }}>
            Видалити
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;

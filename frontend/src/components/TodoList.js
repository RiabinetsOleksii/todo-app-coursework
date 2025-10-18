import React, { useState } from 'react';

function TodoList({ todos, onDelete, onToggle, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setNewTitle(todo.title);
  };

  const saveEdit = (id) => {
    if (newTitle.trim() === '') return;
    onUpdate(id, newTitle);
    setEditingId(null);
    setNewTitle('');
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={{
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fafafa',
            padding: '12px 15px',
            borderRadius: 10,
            borderLeft: todo.completed ? '6px solid green' : '6px solid #007bff',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {editingId === todo.id ? (
            <>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{
                  flex: 1,
                  padding: 8,
                  fontSize: 16,
                  borderRadius: 6,
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={() => saveEdit(todo.id)}
                style={button('green')}
              >
                💾
              </button>
            </>
          ) : (
            <>
              <span
                onClick={() => onToggle(todo.id)}
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: 17,
                  color: todo.completed ? '#777' : '#333',
                }}
              >
                {todo.title}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => startEdit(todo)}
                  style={button('#ffc107')}
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  style={button('red')}
                >
                  🗑
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

const button = (color) => ({
  backgroundColor: color,
  border: 'none',
  color: 'white',
  padding: '6px 10px',
  borderRadius: 6,
  cursor: 'pointer',
});

export default TodoList;

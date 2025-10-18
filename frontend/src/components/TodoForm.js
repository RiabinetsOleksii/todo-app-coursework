import React, { useState } from 'react';

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') return;
    onAdd(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Введи задачу..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        ➕ Додати
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    padding: '10px',
    width: '70%',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    marginLeft: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default TodoForm;

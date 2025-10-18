import React from 'react';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <div className="App" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#007bff', marginTop: 30 }}>📝 To-Do List</h1>
      <TodoApp />
    </div>
  );
}

export default App;

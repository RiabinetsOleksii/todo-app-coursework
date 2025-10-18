import React from 'react';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <div className="App" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>To-Do List</h1>
      <TodoApp />
    </div>
  );
}

export default App;

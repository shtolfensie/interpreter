import React from 'react';
import './css/App.css';


import EditorArea from './components/EditorArea'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Simple interpreter
        </p>
      </header>
      <EditorArea />
    </div>
  );
}

export default App;

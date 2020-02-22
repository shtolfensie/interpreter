import React, { useState } from 'react';
import './css/App.css';


import Header from './components/Header';
import EditorContainer from './components/EditorContainer';

const App = () => {
  const [isInterpreterJSlike, setIsIetinterpreterJSlike] = useState(false)
  const [isEditorClassic, setIsEditorClassic] = useState(false)

  const handleInterpreterChange = e => setIsIetinterpreterJSlike(e.target.checked);
  const handleEditorChange = e => setIsEditorClassic(e.target.checked);
  return (
    <div className="App">
      <Header
        handleInterpreterChange={handleInterpreterChange}
        handleEditorChange={handleEditorChange}
        isInterpreterJSlike={isInterpreterJSlike}
        isEditorClassic={isEditorClassic}
      />
      <EditorContainer
        interpreter={isInterpreterJSlike ? 'jsl' : 'sch'}
        editor={isEditorClassic ? 'classic' : 'jupy'}
      />
    </div>
  );
}

export default App;

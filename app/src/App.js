import React, { useState } from 'react';
import './css/App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
// import { yellow, lightGreen, pink, teal } from '@material-ui/core/colors'


import Header from './components/Header';
import EditorContainer from './components/EditorContainer';

const theme = createMuiTheme({
  // palette: {
    // primary: pink,
    // secondary: teal,
  // },
})

const App = () => {
  const [isInterpreterJSlike, setIsIetinterpreterJSlike] = useState(false)
  const [isEditorClassic, setIsEditorClassic] = useState(true)

  const handleInterpreterChange = e => setIsIetinterpreterJSlike(e.target.checked);
  const handleEditorChange = e => setIsEditorClassic(e.target.checked);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </div>
  );
}

export default App;

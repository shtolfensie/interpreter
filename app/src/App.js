import React, { useState } from 'react';
import './css/App.css';
import '../node_modules/highlight.js/styles/railscasts.css'
// import '../node_modules/highlight.js/styles/arta.css'
// import '../node_modules/highlight.js/styles/tomorrow-night-blue.css'
// import '../node_modules/highlight.js/styles/monokai.css'
// import '../node_modules/highlight.js/styles/hybrid.css'
// import '../node_modules/highlight.js/styles/atom-one-dark-reasonable.css'
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

  const handleInterpreterChange = e => setIsIetinterpreterJSlike(e.target.checked);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header
          handleInterpreterChange={handleInterpreterChange}
          isInterpreterJSlike={isInterpreterJSlike}
        />
        <EditorContainer
          interpreter={isInterpreterJSlike ? 'jsl' : 'sch'}
        />
      </ThemeProvider>
    </div>
  );
}

export default App;

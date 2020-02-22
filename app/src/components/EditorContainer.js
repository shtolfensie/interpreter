import React, { useState } from 'react';
import { css, cx } from 'emotion'

const EditorContainer = ({editor, interpreter}) => {

  const [dataSCH, setDataSCH] = useState({'untitled1': {
    fileName: 'untitled1',
    cells: [
      { num: ' ',
        input: '(define x 10)',
        output: '',
        error: '',
        ast: '' }
    ]
  }});
  const [currentSCHFile, setCurrentSCHFile] = useState('untitled1');

  const [dataJSL, setDataJSL] = useState({'untitled1': {
    fileName: 'untitled1',
    cells: [
      { num: ' ',
        input: 'var num = 87;',
        output: '',
        error: '',
        ast: '' }
    ]
  }});
  const [currentJSLFile, setCurrentJSLFile] = useState('untitled1');

  let currentFile = interpreter === 'sch'
                    ? dataSCH[currentSCHFile]
                    : dataJSL[currentJSLFile]

  return (
    <div>
      {editor === 'jupy'
        ? <EditorJupy fileData={currentFile} />
        : <EditorClassic fileData={currentFile} />}
    </div>
  )
}


const EditorJupy = ({fileData}) => {
  const baseJupy = css`width: 80%;
  border: 1px solid black;
  border-radius: 4px;
  margin: 0 auto;
  `
  return (
    <div className={baseJupy}>
      Jupy here 
      <p>
        {fileData.cells[0].input}
      </p>
    </div>
  )
}
const EditorClassic = ({fileData}) => {
  const baseClassic = css`width: 80%;
  border: 1px solid blue;
  border-radius: 4px;
  background-color: #f7faf5;
  margin: 0 auto;
  `
  return (
    <div className={baseClassic}>
      Good ol' classic
      <p>
        {fileData.cells[0].input}
      </p>
    </div>
  )
}

export default EditorContainer;
import React, { useState } from 'react';
import { css, cx } from 'emotion'

import EditorJupy from './EditorJupy';

const EditorContainer = ({editor, interpreter}) => {

  const [dataSCH, setDataSCH] = useState({'untitled1': {
    fileName: 'untitled1',
    cells: [
      { num: ' ',
        input: '(define x 10)',
        output: '',
        error: '',
        ast: '' },
      { num: ' ',
        input: '(display x)',
        output: '10',
        error: '',
        ast: '' },
    ],
    wholeProgTxt: '(define x 10)\n(display x)'
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
    ],
    wholeProgTxt: 'var num = 87;'
  }});
  const [currentJSLFile, setCurrentJSLFile] = useState('untitled1');

  let currentFile = interpreter === 'sch'
                    ? dataSCH[currentSCHFile]
                    : dataJSL[currentJSLFile];
  let fileNameArray = interpreter === 'sch'
                    ? Object.keys(dataSCH)
                    : Object.keys(dataJSL);

  const baseContainer = css`${editor === 'jupy' ? 'min-' : ''}height: calc(100vh - 48px - 1rem);
  margin-top: 1rem;
  padding-bottom: 1rem;
  `
  return (
    <div className={baseContainer}>
      {editor === 'jupy'
        ? <EditorJupy fileData={currentFile} fileNameArray={fileNameArray}/>
        : <EditorClassic fileData={currentFile} fileNameArray={fileNameArray}/>}
    </div>
  )
}


const EditorClassic = ({fileData}) => {
  const baseClassic = css`width: 95%;
  height: 100%;
  border-radius: 4px;
  margin: 0 auto;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
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
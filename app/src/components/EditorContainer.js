import React, { useState } from 'react';
import { css, cx } from 'emotion';

import EditorJupy from './EditorJupy';
import EditorClassic from './EditorClassic';

const EditorContainer = ({editor, interpreter}) => {

  const [dataSCH, setDataSCH] = useState({'untitled1': {
    fileName: 'untitled1',
    cells: [
      { num: '1',
        input: '(define x 10)\n(display x)\n(define (func f g)\n\t(display f)\n\t(if (< f 10)\n\t\t"Hello"\n\t\t(+ 10 10)))',
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
  
  const handleCellChange = (newCellData, cellIndex) => {
    let newCellArr = dataSCH[currentSCHFile].cells;
    newCellArr[cellIndex] = newCellData;
    let newData = {
      [currentSCHFile]: {
        ...dataSCH[currentSCHFile],
        cells: newCellArr
      },
      ...dataSCH
    }
    setDataSCH(newData);
  }

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
        ? <EditorJupy fileData={currentFile} fileNameArray={fileNameArray} handleCellChange={handleCellChange}/>
        : <EditorClassic fileData={currentFile} fileNameArray={fileNameArray}/>}
    </div>
  )
}



export default EditorContainer;
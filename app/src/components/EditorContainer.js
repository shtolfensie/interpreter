import React, { useState } from 'react';
import { css, cx } from 'emotion';

import EditorJupy from './EditorJupy';
import EditorClassic from './EditorClassic';

import SchInterpreter from '../interpreters/schemy.js';

const schinter1 = new SchInterpreter('untitled1');


const EditorContainer = ({editor, interpreter}) => {

  const baseContainer = css`${editor === 'jupy' ? 'min-' : ''}height: calc(100vh - 48px - 1rem);
    margin-top: 1rem;
    padding-bottom: 1rem;
  `

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
  },
  'untitled2': {
    fileName: 'untitled2',
    cells: [
      { num: '1',
        input: '(define (gr g) (+ g 10))',
        output: '',
        error: '',
        ast: '' },
      { num: ' ',
        input: '(gr 5)',
        output: '10',
        error: '',
        ast: '' },
    ],
    wholeProgTxt: '(define x 10)\n(display x)'
  },
});
  const [currentSCHFile, setCurrentSCHFile] = useState('untitled1');
  const [schEnvs, setSchEnvs] = useState({'untitled1': schinter1.emptyEvn, 'untitled2': schinter1.emptyEvn})
  
  const handleCellChange = (newCellData, cellIndex) => {
    let data = interpreter === 'sch' ? dataSCH : dataJSL;
    let currFile = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    let newCellArr = data[currFile].cells;
    console.log(newCellData, newCellArr)
    newCellArr[cellIndex] = newCellData;
    let newData = {...data};
    newData[currFile] = { ...data[currFile], cell: newCellArr }
    interpreter === 'sch' ? setDataSCH(newData) : setDataJSL(newData);
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
  // let fileNameArray = interpreter === 'sch'
  //                   ? Object.keys(dataSCH)
  //                   : Object.keys(dataJSL);
  let files = interpreter === 'sch'
              ? dataSCH
              : dataJSL;
  let fileNameArray = Object.keys(files);

  const handleInterpreter = input => {
    // let currInterpreter = interpreter === 'sch' ? schInterpreters[currentFile.fileName] : null;
    let currEnv = interpreter === 'sch' ? schEnvs[currentFile.fileName] : null;
    console.log(currEnv);
    let currInterpreter = interpreter === 'sch' ? new SchInterpreter(currentFile.fileName, currEnv) : null;
    console.log(currInterpreter.interpretedFile, currInterpreter.env)
    let res = currInterpreter.interpret(input);
    console.log(res);
    setSchEnvs({
      ...schEnvs,
      [currentFile.fileName]: currInterpreter.env
    });
    // console.log(SchInterpreter(input));
  }
  const handleChangeFile = name => {
    if (!files.hasOwnProperty(name)) return;
    interpreter === 'sch' ? setCurrentSCHFile(name) : setCurrentJSLFile(name);
  }

  return (
    <div className={baseContainer}>
      {editor === 'jupy'
        ? <EditorJupy fileData={currentFile} fileNameArray={fileNameArray} handleCellChange={handleCellChange} handleInterpreter={handleInterpreter} handleChangeFile={handleChangeFile}/>
        : <EditorClassic fileData={currentFile} fileNameArray={fileNameArray}/>}
      {/* {fileNameArray.map((fileName, i) => (
      <FileContainer
      key={i}
      editor={editor}
      interpreter={interpreter}
      fileName={fileName}
      fileData={currentFile}
      fileNameArray={fileNameArray}
      handleCellChange={handleCellChange}
      handleChangeFile={handleChangeFile}
      />
      ))} */}
    </div>
  )
}



export default EditorContainer;
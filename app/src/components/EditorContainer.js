import React, { useState } from 'react';
import { css, cx } from 'emotion';

import EditorJupy from './EditorJupy';
import EditorClassic from './EditorClassic';

import SchInterpreter from '../interpreters/schemy.js';

const schinter1 = new SchInterpreter('untitled1');


function useAsyncState(initialValue) {
  const [value, setValue] = useState(initialValue);
  const setter = x =>
    new Promise(resolve => {
      setValue(x);
      resolve(x);
    });
  return [value, setter];
}

const EditorContainer = ({editor, interpreter}) => {

  const baseContainer = css`${editor === 'jupy' ? 'min-' : ''}height: calc(100vh - 48px - 1rem);
    margin-top: 1rem;
    padding-bottom: 1rem;
  `

  const [dataSCH, setDataSCH] = useState({'untitled1': {
    fileName: 'untitled1',
    cells: [
      { num: ' ',
        input: '(define x 10)\n(display x)\n(define (func f g)\n\t(display f)\n\t(if (< f 10)\n\t\t"Hello"\n\t\t(+ 10 10)))',
        output: [],
        result: '',
        error: '',
        ast: '' },
      { num: ' ',
        input: '(display x)',
        output: [],
        result: '',
        error: '',
        ast: '' },
    ],
    totalNumber: 0,
    wholeProgTxt: '(define x 10)\n(display x)'
  },
  'untitled2': {
    fileName: 'untitled2',
    cells: [
      { num: ' ',
        input: '(define (gr g) (+ g 10))',
        output: [],
        result: '',
        error: '',
        ast: '' },
      { num: ' ',
        input: '(gr 5)',
        output: [],
        result: '',
        error: '',
        ast: '' },
    ],
    totalNumber: 0,
    wholeProgTxt: '(define x 10)\n(display x)'
  },
});
  const [currentSCHFile, setCurrentSCHFile] = useState('untitled1');
  const [schEnvs, setSchEnvs] = useState({'untitled1': schinter1.emptyEvn, 'untitled2': schinter1.emptyEvn})

  const [dataJSL, setDataJSL] = useState({'untitled1': {
    fileName: 'untitled1',
    cells: [
      { num: ' ',
        input: 'var num = 87;',
        output: '',
        result: '',
        error: '',
        ast: '' }
    ],
    totalNumber: 0,
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

  function handleCellChange(newCellData, cellIndex) {
    let data = interpreter === 'sch' ? dataSCH : dataJSL;
    let currFile = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    let newCellArr = [...data[currFile].cells];
    newCellArr[cellIndex] = {...newCellArr[cellIndex], ...newCellData};
    console.log(newCellData, newCellArr)
    let newData = {...data};
    newData[currFile] = { ...data[currFile], cells: newCellArr };
    if (newCellData.hasOwnProperty('num')) newData[currFile] = {...newData[currFile], totalNumber: newData[currFile].totalNumber+1}
    console.log(newData);
    // interpreter === 'sch' ? setDataSCH(newData) : setDataJSL(newData);
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    return setData(newData);
  }

  const createNewCell = (currentCellIndex, newCellIndex) => {
    let data = interpreter === 'sch' ? dataSCH : dataJSL;
    console.log(data)
    let currFile = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    let emptyCellObj = { num: ' ', input: '', output: '', result: '', error: '', ast: '' };
    let newCellArr = [...data[currFile].cells];
    newCellArr.splice(newCellIndex, 0 , emptyCellObj);
    let newData = {...data};
    newData[currFile] = { ...data[currFile], cells: newCellArr }
    interpreter === 'sch' ? setDataSCH(newData) : setDataJSL(newData);
  }

  function handleInterpreter(input, cellIndex) {
    // let currInterpreter = interpreter === 'sch' ? schInterpreters[currentFile.fileName] : null;
    input = input.trim();
    if (input === '') return;
    let currEnvs = interpreter === 'sch' ? schEnvs : null; 
    if (currEnvs === null) return;
    let currEnv = interpreter === 'sch' ? currEnvs[currentFile.fileName] : null;
    let currInterpreter = interpreter === 'sch' ? new SchInterpreter(currentFile.fileName, currEnv) : null;
    let setEnvs = interpreter === 'sch' ? setSchEnvs : null;
    let currNumber = interpreter === 'sch' ? dataSCH[currentSCHFile].totalNumber : dataJSL[currentJSLFile].totalNumber;
    console.log(currEnv);
    console.log(currInterpreter.interpretedFile, currInterpreter.env)
    let result = currInterpreter.interpret(input);
    console.log(result);
    setEnvs({
      ...currEnvs,
      [currentFile.fileName]: currInterpreter.env
    });
    console.log('before', dataSCH);
    let newState = handleCellChange({num: currNumber+1,output: result.output, result: result.res}, cellIndex);
    // const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    // newState[currentFile.fileName] = {...newState[currentFile.fileName], totalNumber: newState[currentFile.fileName].totalNumber+1}
    // const dd = await setData(newState);
  }
  const handleChangeFile = name => {
    if (!files.hasOwnProperty(name)) return;
    interpreter === 'sch' ? setCurrentSCHFile(name) : setCurrentJSLFile(name);
  }

  return (
    <div className={baseContainer}>
      {editor === 'jupy'
        ? <EditorJupy
          fileData={currentFile}
          fileNameArray={fileNameArray}
          handleCellChange={handleCellChange}
          handleInterpreter={handleInterpreter}
          handleChangeFile={handleChangeFile}
          createNewCell={createNewCell}
        />
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
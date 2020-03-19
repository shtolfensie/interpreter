import React, { useState, useEffect } from 'react';
import { css, cx } from 'emotion';
import { FirebaseContext } from './Firebase';

import EditorJupy from './EditorJupy';
import EditorClassic from './EditorClassic';
import FileExplorer from './FileExplorer';

import autoId from '../utils/autoId';

import SchInterpreter from '../interpreters/schemy.js';

const schinter1 = new SchInterpreter('untitled1');
const emptyEvn = schinter1.emptyEvn;


function useAsyncState(initialValue) {
  const [value, setValue] = useState(initialValue);
  const setter = x =>
    new Promise(resolve => {
      setValue(x);
      resolve(x);
    });
  return [value, setter];
}

const id1 = '5ZNt1S2nrWKqDBtpvAaI';
const id2 = autoId();
const id3 = autoId();

const EditorContainer = ({editor, interpreter, firebase}) => {

  const baseContainer = css`${editor === 'jupy' ? 'min-' : ''}height: calc(100vh - 48px - 1rem);
    margin-top: 1rem;
    padding-bottom: 1rem;
  `
  const [authUser, setAuthUser] = useState(false);
  useEffect(() => {
    let unSub = firebase.auth.onAuthStateChanged(user => user ? setAuthUser(user) : setAuthUser(false));

    return () => {
      unSub();
    };
  }, []) // emty array -> works like comp. did mount

  const [dataSCH, setDataSCH] = useState({[id1]: {
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
    wholeProgTxt: '(define x 10)\n(display x)',
    fileType: 'sch',
    editor: 'jupy',
    isSaved: false,
    id: id1
  },
  [id2]: {
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
    wholeProgTxt: '(define x 10)\n(display x)',
    isSaved: true,
    fileType: 'sch',
    editor: 'jupy',
    id: id2
  },
});
  const [currentSCHFile, setCurrentSCHFile] = useState(id1);
  const [schEnvs, setSchEnvs] = useState({[id1]: schinter1.emptyEvn, [id2]: schinter1.emptyEvn})

  const [dataJSL, setDataJSL] = useState({[id3]: {
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
    wholeProgTxt: 'var num = 87;',
    id: id3,
    editor: 'jupy',
    fileType: 'jsl',
    isSaved: false
  }});
  const [currentJSLFile, setCurrentJSLFile] = useState(id3);

  const [jslEnvs, setJslEnvs] = useState({[id3]: {}});

  let currentFile = interpreter === 'sch'
                    ? dataSCH[currentSCHFile]
                    : dataJSL[currentJSLFile];
  // let fileNameArray = interpreter === 'sch'
  //                   ? Object.keys(dataSCH)
  //                   : Object.keys(dataJSL);
  let files = interpreter === 'sch'
              ? dataSCH
              : dataJSL;
  let fileNameArray = Object.keys(files).map(fileId => [files[fileId].fileName, files[fileId].id]);
  let savedArray = Object.keys(files).map(fileId => files[fileId].isSaved);

  function handleCellChange(newCellData, cellIndex) {
    let data = interpreter === 'sch' ? dataSCH : dataJSL;
    let currFile = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    let newCellArr = [...data[currFile].cells];
    newCellArr[cellIndex] = {...newCellArr[cellIndex], ...newCellData};
    console.log(newCellData, newCellArr)
    let newData = {...data};
    newData[currFile] = { ...data[currFile], cells: newCellArr, isSaved: false };
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
    newData[currFile] = { ...data[currFile], cells: newCellArr, isSaved: false }
    interpreter === 'sch' ? setDataSCH(newData) : setDataJSL(newData);
  }

  function handleInterpreter(input, cellIndex) {
    // let currInterpreter = interpreter === 'sch' ? schInterpreters[currentFile.fileName] : null;
    input = input.trim();
    if (input === '') return;
    const fileId = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    let currEnvs = interpreter === 'sch' ? schEnvs : jslEnvs; 
    if (currEnvs === null) return;
    let currEnv = currEnvs[fileId];
    let currInterpreter = interpreter === 'sch' ? new SchInterpreter(currentFile.fileName, currEnv) : null;
    let setEnvs = interpreter === 'sch' ? setSchEnvs : setJslEnvs;
    let currNumber = interpreter === 'sch' ? dataSCH[fileId].totalNumber : dataJSL[fileId].totalNumber;
    console.log(currEnv);
    console.log(currInterpreter.interpretedFile, currInterpreter.env)
    let result = currInterpreter.interpret(input);
    console.log(result);
    setEnvs({
      ...currEnvs,
      [fileId]: currInterpreter.env
    });
    console.log('before', dataSCH);
    let newState = handleCellChange({num: currNumber+1,output: result.output ? result.output : '', result: result.res ? result.res : ''}, cellIndex);
    // const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    // newState[currentFile.fileName] = {...newState[currentFile.fileName], totalNumber: newState[currentFile.fileName].totalNumber+1}
    // const dd = await setData(newState);
  }
  const handleChangeFile = id => {
    if (!files.hasOwnProperty(id)) return;
    interpreter === 'sch' ? setCurrentSCHFile(id) : setCurrentJSLFile(id);
  }
  
  const handleFileImport = fileId => {
    firebase.db.collection(authUser.uid).doc(fileId).get().then(doc => {
      if (!doc.exists) {
        console.log(`Document with id ${fileId} doesn't exist.`);
        return null;
      }
      else {
        const file = doc.data();
        file.id = fileId;
        const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
        const data = interpreter === 'sch' ? dataSCH : dataJSL;
        const newData = { ...data };
        newData[fileId] = file;
        setData(newData);
      }
    })
  }

  const handleFileSave = () => {
    const fileId = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    const data = interpreter === 'sch' ? dataSCH : dataJSL;
    const file = data[fileId];
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    file.isSaved = true;
    setData({...data, [fileId]: file});
    console.log(file)
    firebase.db.collection(authUser.uid).doc(fileId).set(file);
  }

  const handleFileClose = fileId => {
    const data = interpreter === 'sch' ? dataSCH : dataJSL;
    delete data[fileId];
    const newData = { ...data };
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    const setEnv = interpreter === 'sch' ? setSchEnvs : setJslEnvs;
    const envs = interpreter === 'sch' ? schEnvs : jslEnvs;
    delete envs[fileId];
    const newEnvs = { ...envs };
    setData(newData);
    setEnv(newEnvs);
  }

  return (
    <>
      <FileExplorer firebase={firebase} interpreter={interpreter} handleFileSelect={handleFileImport}/>
      <div className={baseContainer}>
        {editor === 'jupy'
          ? <EditorJupy
            fileData={currentFile}
            fileNameArray={fileNameArray}
            savedArray={savedArray}
            handleCellChange={handleCellChange}
            handleInterpreter={handleInterpreter}
            handleChangeFile={handleChangeFile}
            createNewCell={createNewCell}
            handleFileSave={handleFileSave}
            handleFileClose={handleFileClose}
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
    </>
  )
}

const EditorContainerWithFirebase = (props) => (
  <FirebaseContext.Consumer>
    {firebase => <EditorContainer firebase={firebase} {...props}/>}
  </FirebaseContext.Consumer>
)

export default EditorContainerWithFirebase;
import React, { useState, useEffect } from 'react';
import { css, cx } from 'emotion';
import { FirebaseContext } from './Firebase';

import EditorJupy from './EditorJupy';
import FileExplorer from './FileExplorer';

import autoId from '../utils/autoId';

import SchInterpreter from '../interpreters/schemy.js';

import { emptySchFile, emptyJslFile, emptySchFileEditorData, emptyJslFileEditorData } from '../utils/emptyfiles.js';

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

const EditorContainer = ({interpreter, firebase, exampleFile}) => {

  const baseContainer = css`
    height: calc(100vh - 48px - 1rem);
    margin-top: 1rem;
    /* padding-bottom: 1rem; */
  `
  const [authUser, setAuthUser] = useState(false);
  useEffect(() => {
    let unSub = firebase.auth.onAuthStateChanged(user => user ? setAuthUser(user) : setAuthUser(false));

    return () => {
      unSub();
    };
  }, []) // emty array -> works like comp. did mount

  useEffect(() => {
    if (exampleFile) importFile(exampleFile);
  }, [exampleFile])

  const [dataSCH, setDataSCH] = useState({
    [id1]: {
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
    wholeProgTxt: '',
    fileType: 'sch',
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
    wholeProgTxt: '',
    isSaved: true,
    fileType: 'sch',

    id: id2
  },
});
  const [currentSCHFile, setCurrentSCHFile] = useState(id1);
  const [schFileEditorData, setSchFileEditorData] = useState({[id1]: {
    cells: [
    { outputCollapse: false },
    { outputCollapse: false }
  ]},
  [id2]: {
    cells: [
      { outputCollapse: false },
      { outputCollapse: false }
    ]
  }})
  const [schEnvs, setSchEnvs] = useState({[id1]: schinter1.emptyEvn, [id2]: schinter1.emptyEvn})
  const [schClipboard, setSchClipboard] = useState(null);

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
    fileType: 'jsl',
    isSaved: false
  }});
  const [currentJSLFile, setCurrentJSLFile] = useState(id3);
  const [jslFileEditorData, setJslFileEditorData] = useState({[id3]: emptyJslFileEditorData})
  const [jslEnvs, setJslEnvs] = useState({[id3]: {}});
  const [jslClipboard, setJslClipboard] = useState(null);

  let currentFile = interpreter === 'sch'
                    ? dataSCH[currentSCHFile]
                    : dataJSL[currentJSLFile];
  // let fileNameArray = interpreter === 'sch'
  //                   ? Object.keys(dataSCH)
  //                   : Object.keys(dataJSL);
  let files = interpreter === 'sch'
              ? dataSCH
              : dataJSL;

  // useEffect(() => {
  //   alert('alksjdf')
  //   const currentFile = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
  //   if (typeof currentFile === 'object' && currentFile !== null) {
  //     if (!currentFile.active) return;
  //     const setCurrentFile = interpreter === 'sch' ? setCurrentSCHFile : setCurrentJSLFile;
  //     const data = interpreter === 'sch' ? dataSCH : dataJSL;
  //     if (Object.keys(data).length === 0) {
  //       // !!! handle no open files
  //     }
  //     else if (currentFile.oldIndex === 0) setCurrentFile(data[Object.keys(data)[0]]);
  //     else setCurrentFile(data[Object.keys(data)[currentFile.oldIndex - 1]]);
  //   }
  // }, [currentJSLFile, currentSCHFile])

  let activeFilesArray = Object.keys(files).map(fileId => [files[fileId].fileName, files[fileId].id, files[fileId].isSaved]);
  // useEffect(() => {
  //   activeFilesArray = Object.keys(files).map(fileId => [files[fileId].fileName, files[fileId].id, files[fileId].isSaved]);
  //   console.log(activeFilesArray)
  // }, [dataSCH, dataJSL])

  function handleCellChange(newCellData, cellIndex) {
    let data = interpreter === 'sch' ? dataSCH : dataJSL;
    let currFile = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    let newCellArr = [...data[currFile].cells];
    newCellArr[cellIndex] = {...newCellArr[cellIndex], ...newCellData};
    console.log(newCellData, newCellArr)
    let newData = {...data};
    newData[currFile] = { ...data[currFile], cells: newCellArr, isSaved: false };
    if (newCellData.hasOwnProperty('num')) newData[currFile] = {...newData[currFile], totalNumber: newData[currFile].totalNumber+1}
    // console.log(newData);
    // interpreter === 'sch' ? setDataSCH(newData) : setDataJSL(newData);
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    return setData(newData);
  }

  const createNewCell = (newCellIndex) => {
    let data = interpreter === 'sch' ? dataSCH : dataJSL;
    let fileEditorData = interpreter === 'sch' ? {...schFileEditorData} : {...jslFileEditorData};
    const setFileEditorData = interpreter === 'sch' ? setSchFileEditorData : setJslFileEditorData;
    console.log(data)
    let currFile = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    let currFileEditorCells = fileEditorData[currFile].cells;
    let emptyCellObj = { num: ' ', input: '', output: '', result: '', error: '', ast: '' };
    let newCellArr = [...data[currFile].cells];
    newCellArr.splice(newCellIndex, 0, emptyCellObj);
    currFileEditorCells.splice(newCellIndex, 0, {outputCollapse: false});
    fileEditorData[currFile].cells = currFileEditorCells;
    let newData = {...data};
    newData[currFile] = { ...data[currFile], cells: newCellArr, isSaved: false }
    interpreter === 'sch' ? setDataSCH(newData) : setDataJSL(newData);
    setFileEditorData(fileEditorData);
  }

  const handleInterpreter = (input, cellIndex) => {
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
    console.log(result.ast);
    setEnvs({
      ...currEnvs,
      [fileId]: currInterpreter.env
    });
    if (result.error && result.res === "'") result.res = '';
    handleCellChange({num: currNumber+1,output: result.output ? result.output : '', result: result.res ? result.res : '', error: result.error ? result.error : ''}, cellIndex);
  }
  const handleChangeFile = id => {
    if (!files.hasOwnProperty(id)) return;
    interpreter === 'sch' ? setCurrentSCHFile(id) : setCurrentJSLFile(id);
  }

  const handleFileRename = (newName, id) => {
    const data = interpreter === 'sch' ? dataSCH : dataJSL;
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    const newData = { ...data };
    newName = newName.replace(/^&nbsp;|&nbsp;$/g, '');
    if (typeof newName !== 'string' || newName.length === 0) return true;
    else if (/[ ]/.test(newName)) return true;
    else if (Object.keys(newData).map(id => newData[id].fileName).includes(newName)) return true;
    newData[id].fileName = newName;
    newData[id].isSaved = false;
    setData(newData);
  }
  
  const handleFileImport = fileId => {
    firebase.db.collection(authUser.uid).doc(fileId).get().then(doc => {
      if (!doc.exists) {
        console.log(`Document with id ${fileId} doesn't exist.`);
        return null;
      }
      else {
        const file = doc.data();
        importFile(file, fileId, true);
      }
    })
  }
  
  const importFile = (file, fileId=autoId(), fromFirebase=false) => {
    file.id = fileId;
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    const data = interpreter === 'sch' ? dataSCH : dataJSL;
    const fileEditorData = interpreter === 'sch' ? {...schFileEditorData} : {...jslFileEditorData};
    const setFileEditorData = interpreter === 'sch' ? setSchFileEditorData : setJslFileEditorData;
    const emptyFileEditorData = interpreter === 'sch' ? {...emptySchFileEditorData} : {...emptyJslFileEditorData};
    const setCurrentFile = interpreter === 'sch' ? setCurrentSCHFile : setCurrentJSLFile;
    const newData = { ...data };
    if (!Object.keys(newData).includes(fileId)) {
      newData[fileId] = file;
      setData(newData);
      fileEditorData[fileId] = emptyFileEditorData;
      fileEditorData[fileId].cells = file.cells.map(() => emptyFileEditorData.cells[0]);
      setFileEditorData(fileEditorData);
    }
    setCurrentFile(fileId);
  }
  const handleFileDelete = fileId => { // this is called when deleting file from firebase to change the isSaved to false, so that users are reminded that the file is no longer saved
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    const newData = interpreter === 'sch' ? {...dataSCH} : {...dataJSL};
    if (Object.keys(newData).includes(fileId)) {
      newData[fileId].isSaved = false;
      setData(newData);
    }
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

  const createNewFile = (fileType, fileName) => {
    let newFile = fileType === 'sch' ? {...emptySchFile} : {...emptyJslFile};
    let newId = autoId();
    newFile.fileName = fileName;
    newFile.id = newId;
    return {id: newId, data: newFile};
  }

  const handleCreateNewFile = () => {
    const data = interpreter === 'sch' ? dataSCH : dataJSL;
    const newData = {...data};
    const fileEditorData = interpreter === 'sch' ? {...schFileEditorData} : {...jslFileEditorData};
    const setFileEditorData = interpreter === 'sch' ? setSchFileEditorData : setJslFileEditorData;
    const emptyFileEditorData = interpreter === 'sch' ? {...emptySchFileEditorData} : {...emptyJslFileEditorData};
    let newName = 'untitled1';
    for(let i = 2; i < 25; i++) {
      if (i === 20) {
        newName = `untitled${Math.floor(Math.random()*i)}${Math.floor(Math.random()*i)}`
        break;
      }
      else if (Object.keys(data).reduce((acc, id) => acc = acc || (data[id].fileName === newName), false)) newName = `untitled${i}`;
      else break;
    }
    let newFile = createNewFile(interpreter, newName);
    console.log(newFile)
    newData[newFile.id] = newFile.data;
    console.log(newData)
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    const setCurrentFile = interpreter === 'sch' ? setCurrentSCHFile : setCurrentJSLFile;
    fileEditorData[newFile.id] = emptyFileEditorData;
    setFileEditorData(fileEditorData);
    setData(newData);
    setCurrentFile(newFile.id);
  }

  const handleFileClose = fileId => {
    const data = interpreter === 'sch' ? dataSCH : dataJSL;
    const oldIndex = Object.keys(data).indexOf(fileId);
    const currentFileId = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    delete data[fileId];
    const newData = { ...data };
    if (fileId === currentFileId) {
      const setCurrentFile = interpreter === 'sch' ? setCurrentSCHFile : setCurrentJSLFile;
      let newId;
      if (Object.keys(newData).length === 0) {
        let newFile = createNewFile(interpreter, 'untitled1'); // !!! will be used by handleCreateNewFile, that will also update the state
        newData[newFile.id] = newFile.data;
        newId = newFile.id;
      }
      else if (oldIndex === 0) newId = Object.keys(newData)[0];
      else newId = Object.keys(newData)[oldIndex-1];
      setCurrentFile(newId);
    }
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    const setEnvs = interpreter === 'sch' ? setSchEnvs : setJslEnvs;
    const envs = interpreter === 'sch' ? schEnvs : jslEnvs;
    delete envs[fileId];
    const newEnvs = { ...envs };
    const fileEditorData = interpreter === 'sch' ? {...schFileEditorData} : {...jslFileEditorData};
    const setFileEditorData = interpreter === 'sch' ? setSchFileEditorData : setJslFileEditorData;
    delete fileEditorData[fileId]
    console.log(newData)
    console.log(newEnvs)
    setFileEditorData(fileEditorData);
    setData(newData);
    setEnvs(newEnvs);
  }

  const handleResetEnv = () => {
    const fileId = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    const envs = interpreter === 'sch' ? schEnvs : jslEnvs;
    const setEnvs = interpreter === 'sch' ? setSchEnvs : setJslEnvs;
    const data = interpreter === 'sch' ? dataSCH : dataJSL;
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    const newEnvs = { ...envs };
    newEnvs[fileId] = schinter1.emptyEvn;
    data[fileId].isSaved = false;
    setEnvs(newEnvs);
    setData(data);
  }

  const handleResetFile = () => {
    const fileId = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    const envs = interpreter === 'sch' ? schEnvs : jslEnvs;
    const setEnvs = interpreter === 'sch' ? setSchEnvs : setJslEnvs;
    const data = interpreter === 'sch' ? dataSCH : dataJSL;
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    const newEnvs = { ...envs };
    newEnvs[fileId] = schinter1.emptyEvn;
    data[fileId].isSaved = false;
    data[fileId].totalNumber = 0;
    data[fileId].cells = data[fileId].cells.map(cell => ({ ...cell, num: " ", ast:"", error:"", num:" ", output:[], result:""}))
    setEnvs(newEnvs);
    setData(data);
  }

  const handleRerunEnv = () => {
    const fileId = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    const envs = interpreter === 'sch' ? schEnvs : jslEnvs;
    const data = interpreter === 'sch' ? dataSCH : dataJSL;
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    let currInterpreter = interpreter === 'sch' ? new SchInterpreter(currentFile.fileName, false) : null;
    const setEnvs = interpreter === 'sch' ? setSchEnvs : setJslEnvs;
    const newEnvs = { ...envs };
    delete newEnvs[fileId];
    let newEnv = false;
    const currentCells = data[fileId].cells;
    data[fileId].isSaved = false;
    data[fileId].totalNumber = 0;
    for (let i = 0; i < currentCells.length; i++) {
      let result = currInterpreter.interpret(currentCells[i].input)
      newEnv = currInterpreter.env;
      data[fileId].cells[i] = {...data[fileId].cells[i],
        num: data[fileId].totalNumber+1,
        output: result.output ? result.output : '',
        result: result.res ? result.res : '',
        error: result.error ? result.error : ''
      }
      data[fileId].totalNumber++;
      currInterpreter = interpreter === 'sch' ? new SchInterpreter(currentFile.fileName, newEnv) : null;
    }
    newEnvs[fileId] = newEnv;
    setData(data);
    setEnvs(newEnvs);
  }

  const handleClipboard = (operation, cellIndex) => {
    const fileId = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    const data = interpreter === 'sch' ? dataSCH : dataJSL;
    const setData = interpreter === 'sch' ? setDataSCH : setDataJSL;
    const fileEditorData = interpreter === 'sch' ? {...schFileEditorData} : {...jslFileEditorData};
    const setFileEditorData = interpreter === 'sch' ? setSchFileEditorData : setJslFileEditorData;
    const emptyFileEditorData = interpreter === 'sch' ? {...emptySchFileEditorData} : {...emptyJslFileEditorData};
    const clipboard = interpreter === 'sch' ? schClipboard : jslClipboard;
    const setClipboard = interpreter === 'sch' ? setSchClipboard : setJslClipboard;
    let toClipboard = null;
    let newData = null;

    if (operation === 'copy') {
      toClipboard = data[fileId].cells[cellIndex];
    }
    else if (operation === 'cut') {
      toClipboard = data[fileId].cells.splice(cellIndex, 1)[0];
      fileEditorData[fileId].cells.splice(cellIndex, 1);
    }
    else if (operation === 'paste' && clipboard !== null) {
      data[fileId].cells.splice(cellIndex, 0, clipboard);
      newData = { ...data };
      fileEditorData[fileId].cells.splice(cellIndex, 0, emptyFileEditorData.cells[0]);
    }
    else if (operation === 'delete' && data[fileId].cells.length > 1)  {
      data[fileId].cells.splice(cellIndex, 1);
      newData = { ...data };
      fileEditorData[fileId].cells.splice(cellIndex, 1);
    }
    if (toClipboard !== null) setClipboard(toClipboard);
    if (newData !== null) {
      newData[fileId].isSaved = false;
      setData(newData);
      setFileEditorData(fileEditorData);
    }
    if (operation === 'cut') setFileEditorData(fileEditorData);
  }

  const handleFileEditorDataChange = (cellIndex, newCellData) => {
    const fileId = interpreter === 'sch' ? currentSCHFile : currentJSLFile;
    const editorData = interpreter === 'sch' ? {...schFileEditorData} : {...jslFileEditorData};
    const setEditorData = interpreter === 'sch' ? setSchFileEditorData : setJslFileEditorData;
    editorData[fileId].cells[cellIndex] = newCellData;
    setEditorData(editorData);
  }

  return (
    <>
      <FileExplorer firebase={firebase} interpreter={interpreter} handleFileSelect={handleFileImport} handleFileDelete={handleFileDelete}/>
      <div className={baseContainer}>
        <EditorJupy
          interpreter={interpreter}
          fileData={interpreter === 'sch'
          ? dataSCH[currentSCHFile]
          : dataJSL[currentJSLFile]}
          fileEditorData={interpreter === 'sch'
          ? schFileEditorData[currentSCHFile]
          : jslFileEditorData[currentJSLFile]}
          activeFilesArray={activeFilesArray}
          handleCellChange={handleCellChange}
          handleInterpreter={handleInterpreter}
          handleChangeFile={handleChangeFile}
          createNewCell={createNewCell}
          handleFileRename={handleFileRename}
          handleFileSave={handleFileSave}
          handleFileClose={handleFileClose}
          handleResetEnv={handleResetEnv}
          handleResetFile={handleResetFile}
          handleRerunEnv={handleRerunEnv}
          handleClipboard={handleClipboard}
          handleAddFileBtn={handleCreateNewFile}
          handleFileEditorDataChange={handleFileEditorDataChange}
          />
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
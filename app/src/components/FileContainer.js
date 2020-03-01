import React, { useState } from 'react';
import EditorJupy from './EditorJupy';
import EditorClassic from './EditorClassic';
import SchInterpreter from '../interpreters/schemy.js';

const FileContainer = ({editor, interpreter, fileName, fileData, fileNameArray, handleCellChange, handleChangeFile }) => {

  const handleInterpreter = (input, cellIndex) => {
    console.log(SchInterpreter(input));
  }

  return (
    fileData.fileName === fileName ?
      editor === 'jupy'
          ? <EditorJupy fileData={fileData} fileNameArray={fileNameArray} handleCellChange={handleCellChange} handleInterpreter={handleInterpreter} handleChangeFile={handleChangeFile}/>
          : <EditorClassic fileData={fileData} fileNameArray={fileNameArray}/>
    : null
  )
}

export default FileContainer;
import React, { useState } from 'react';
import { css, cx } from 'emotion';
import CloseIcon from '@material-ui/icons/CloseRounded';
import CircleIcon from '@material-ui/icons/FiberManualRecord';

import TextareaAutosize from 'react-autosize-textarea';


const baseJupy = css`width: 80%;
  height: 900px;
  // border: 1px solid black;
  // border-radius: 4px;
  margin: 0 auto;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`
const fileSelector = css`width: 100%;
  height: 45px;
  overflow-x: hidden;
  padding-bottom: 6px;
  :hover {
    overflow-x: scroll;
    padding-bottom: 0;
  }
  overflow-y: hidden;
  display: flex;
  ::-webkit-scrollbar-track {
    display: none;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
    border-radius: 6px;
  }

  ::-webkit-scrollbar {
    height: 6px;
    // background-color: #F5F5F5;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #3F51B5;
  }
`
const fileTab = css`min-width: 110px;
  max-width: 220px;
  height: 100%;
  padding-left: 10px;
  padding-right: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-right: 10px;
  // position: relative;
  flex-shrink: 0;
  cursor: pointer;
  :hover {
    background-color: #F1F1F1;
  }
`

const handleClick = e => alert('its fucking late');
const handleCloseClick = e => alert('close');
const handleChange = e => console.log(e.target, e)

const EditorJupy = ({fileData, fileNameArray}) => {
  fileNameArray = ["untitled1", "a;sdkfjf;d", "fsadfasdfasdfsadf", "fsadfasdf","fsadfasdf","fsadfasdf", "fsadfasdfasdfsadf",];
  let selectedFileIndex = fileNameArray.indexOf(fileData.fileName);
  return (
    <div className={baseJupy}>
      <div className={fileSelector}>
        {fileNameArray.map((fileName, i) => (
        <FileTab
          key={i}
          isNotSaved={false}
          isSelected={i === selectedFileIndex}
          handleClick={handleClick}
          handleCloseClick={handleCloseClick}
          fileName={fileName}/>))}
      </div>
      <div className='cell-container'>
        {fileData.cells.map((cell, i) => <div key={i}>{cell.input}<Cell /></div>)}
      </div>

    </div>
  )
}

const selectedFileTab = css`
  background-color: rgba(33, 150, 243, 0.71);
`

const FileTab = ({fileName, handleClick, handleCloseClick, isNotSaved, isSelected}) => (
  <div className={css`${fileTab} ${isSelected ? selectedFileTab : ''}`} onClick={handleClick}>
    <div>{fileName}</div>
    <div style={{height: '16px', width: '16px'}}>{isNotSaved && <CircleIcon color='secondary' style={{fontSize: '16px', height: '16px'}}/>}</div>
    <div onClick={handleCloseClick} style={{height: '16px', width: '16px'}}>
      <CloseIcon style={{fontSize: '16px', height: '16px'}}/>
    </div>
  </div>
);


const Cell = () => {
  const [cellValue, setCellValue] = useState('')
  
  const handleKeyDown = (e) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      let start = e.target.selectionStart;
      let end = e.target.selectionEnd;
      setCellValue(cellValue.slice(0,start) + '\t' + cellValue.slice(end));
      e.target.selectionStart = start + 1; // !!! this doesn't work. duh. need to get a ref to the text area
    }
  }
  return (
    <TextareaAutosize
      selectionStart={0}
      style={{lineHeight: '20px', resize: 'none', padding: '5px', width: '300px', tabSize: '4'}}
      value={cellValue}
      onChange={e => setCellValue(e.currentTarget.value)}
      onKeyDown={handleKeyDown}
    />
  )
}


export default EditorJupy;
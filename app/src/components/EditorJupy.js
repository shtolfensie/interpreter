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
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); */
    /* box-shadow: inset 0 0 6px rgba(0,0,0,0.3); */
    /* background-color: #F5F5F5; */
    /* border-radius: 6px; */
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
  const [activeCell, setActiveCell] = useState(0);
  const handleCellClick = (key) => setActiveCell(key);

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
        {fileData.cells.map((cell, i) => <Cell setActive={handleCellClick} isActive={i == activeCell} key={i} cellIndex={i} cellData={cell}/>)}
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

const baseCell = css`
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 0 auto;
  padding: 5px;
  border: 1px solid rgba(0,0,0,0);
  position: relative;
`
const activeCell = css`
  border: 1px solid #66BB6A;
  ::before {
    position: absolute;
    display: block;
    top: -1px;
    left: -1px;
    width: 5px;
    height: calc(100% + 2px);
    background: #66BB6A;
    content: '';
  }
`
const inOutContainer = css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
`
const promptContainer = css`
  width: 100px;
  height: 100%;
`
const prompt = css`
  font-family: monospace;
  font-size: 14px;
  text-align: right;
  padding: 0.4em;
  line-height: 1.21429em;
  cursor: default;
  min-width: 10ex;

`
const inputPrompt = css`
  color: #303F9F;
`
const inputArea = css`
  flex-grow: 1;
  
`
const outputPrompt = css`
  color: #D84315;
`
const outputArea = css`
  flex-grow: 1;
  padding: 0.4em;
  font-size: 14px;
  line-height: 1.21429em;
  font-family: monospace;
`

const Cell = ({cellIndex, cellData, setInputValue, setActive, isActive}) => {
  const {num, input, output, error, ast} = cellData;
  
  // const handleKeyDown = (e) => {
  //   if (e.keyCode === 9) {
  //     e.preventDefault();
  //     let start = e.target.selectionStart;
  //     let end = e.target.selectionEnd;
  //     console.log(start, end);
  //     setInputValue(input.slice(0,start) + '\t' + input.slice(end));
  //     e.target.setSelectionRange(start + 1, start + 1); // !!! this (((might))) work. might need to get a ref to the text area
  //   }
  // }
  const handleCellClick = () => setActive(cellIndex);
  return (
    <div className={css`${baseCell} ${isActive && activeCell}`} onClick={handleCellClick}>
      <div className={inOutContainer}>
        <div className={promptContainer}>
          <div className={cx(prompt, inputPrompt)}>In [ ]:</div>
        </div>
        <TextareaAutosize
          selectionStart={0}
          className={inputArea}
          style={{lineHeight: '20px', resize: 'none', padding: '5px', width: '300px', tabSize: '4', outline: 'none'}}
          value={input}
          onFocus={handleCellClick}
          // onChange={e => setCellValue(e.currentTarget.value)}
          // onKeyDown={handleKeyDown}
        />
      </div>
      <div className={inOutContainer}>
        <div className={promptContainer}>
          <div className={cx(prompt, outputPrompt)}>Out[ ]:</div>
        </div>
        <div className={outputArea}>
          texty text
        </div>
      </div>
    </div>
  )
}


export default EditorJupy;
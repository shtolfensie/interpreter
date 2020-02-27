import React, { useState, useRef } from 'react';
import { css, cx } from 'emotion';
import CloseIcon from '@material-ui/icons/CloseRounded';
import CircleIcon from '@material-ui/icons/FiberManualRecord';

import TextareaAutosize from 'react-autosize-textarea';

const TAB = '    ';

//#region base css
const baseJupy = css`width: 80%;
  height: 900px;
  // border: 1px solid black;
  // border-radius: 4px;
  margin: 0 auto;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`
//#endregion
//#region fileselector css
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
//#endregion

const handleClick = e => alert('its fucking late');
const handleCloseClick = e => alert('close');
const handleChange = e => console.log(e.target, e)

const EditorJupy = ({fileData, fileNameArray, handleCellChange}) => {
  const [activeCell, setActiveCell] = useState(0);
  const [isEdit, setIsEdit] = useState(true)
  // const handleCellClick = (key) => setActiveCell(key);
  const handleCellInputChange = newCellData => {
    handleCellChange(newCellData, activeCell)
  }
  const handleActiveCellChange = (oldCellIndex, newCellIndex, isEdit) => {
    if (newCellIndex < 0 || newCellIndex > fileData.cells.length-1) return;
    setActiveCell(newCellIndex);
    setIsEdit(isEdit);
  }

  // fileNameArray = ["untitled1", "a;sdkfjf;d", "fsadfasdfasdfsadf", "fsadfasdf","fsadfasdf","fsadfasdf", "fsadfasdfasdfsadf",];
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
        {fileData.cells.map((cell, i) => (
          <Cell 
            handleCellInputChange={handleCellInputChange}
            setActive={setActiveCell}
            isActive={i === activeCell}
            isEdit={isEdit}
            handleActiveCellChange={handleActiveCellChange}
            key={i}
            cellIndex={i}
            cellData={cell}
          />
        ))}
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
//#region Cell css
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
  tab-size: 4;
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
//#endregion

const Cell = ({handleCellInputChange, cellIndex, cellData, setActive, isActive, isEdit, handleActiveCellChange}) => { // !!! need to decide if one function or mmultiple to set active and so on
  const {num, input, output, error, ast} = cellData;
  const textArea = useRef();
  
  const handleChange = e => {
    handleCellInputChange({
      num,
      input: e.target.value,
      output,
      error,
      ast
    });
  }
  const handleKeyDown = (e) => {
    console.log(e.keyCode);
    if (e.key === 'x') {e.preventDefault(); console.log(e.target.selectionStart, e.target.selectionEnd, e.persist(), e);}
    // if (e.key === 'x') console.log(getRowNumber(e.target.selectionStart, 0), "<-- row");
    let start = e.target.selectionStart;
    let end = e.target.selectionEnd;
    let value = input;
    const rowArray = input.split('\n');
    const currentStartRowIndex = getRowNumber(start, 0);
    const currentEndRowIndex = getRowNumber(end, 0);
    if (e.altKey) e.preventDefault();
    if (e.keyCode === 9) { // handle tab
      e.preventDefault();
      let isFirstRowModified = false;
      let isLastRowModified = false;
      let numOfChanges = 0;
      if (e.shiftKey) {
        for (let i = currentStartRowIndex; i < currentEndRowIndex+1; i++) {
          if (rowArray[i][0] === '\t') {
            if (i === currentStartRowIndex) isFirstRowModified = true;
            if (i === currentEndRowIndex) isLastRowModified = true;
            rowArray[i] = rowArray[i].slice(1);
            numOfChanges++;
          }
        }
        value = rowArray.join('\n');
        // if ((currentStartRowIndex !== currentEndRowIndex) && (start === end) && (input[start-1] !== '\n' && start -1 >= 0) && value !== input) end = start = start - 1
        if ((input[start-1] !== '\n' && start -1 >= 0)) {
        }
        if (isFirstRowModified) start -= 1;
        end -= numOfChanges;
      }
      else if (currentStartRowIndex !== currentEndRowIndex) {
        for (let i = currentStartRowIndex; i < currentEndRowIndex+1; i++) {
          rowArray[i] = '\t' + rowArray[i];
          numOfChanges++;
        }
        value = rowArray.join('\n');
        if (start !== 0) start += 1;
        end += numOfChanges;
      }
      else {
        value = input.slice(0,start) + '\t' + input.slice(end);
        end = start = start + 1;
      }
    }
    if (e.keyCode === 38) { // up-arrow
      if (e.altKey) {
        if (currentStartRowIndex === 0) return;
        const toBeMoved = rowArray.splice(currentStartRowIndex, (currentEndRowIndex-currentStartRowIndex)+1);
        const aboveRowLength = rowArray[currentStartRowIndex-1].length;
        rowArray.splice(currentStartRowIndex-1, 0, ...toBeMoved);
        console.log(aboveRowLength);
        value = rowArray.join('\n');
        start -= aboveRowLength+1;
        end -= aboveRowLength+1;
      }
      if (start === 0) {
        handleActiveCellChange(cellIndex, cellIndex-1, true);
      }
    } // 38 40
    if (e.keyCode === 40) { // down-arrow
      if (e.altKey) {
        if (currentEndRowIndex === rowArray.length-1) return;
        const belowRowLength = rowArray[currentEndRowIndex+1].length;
        const toBeMoved = rowArray.splice(currentStartRowIndex, (currentEndRowIndex-currentStartRowIndex)+1);
        console.log(toBeMoved, rowArray)
        rowArray.splice(currentStartRowIndex+1, 0, ...toBeMoved);
        value = rowArray.join('\n');
        start += belowRowLength+1; // !!! eh i dont know
        end += belowRowLength+1;
      }
      if (input.length === end) {
        handleActiveCellChange(cellIndex, cellIndex+1, true);
      }
    }
    if (e.keyCode === 13 && e.shiftKey) {
      e.preventDefault();
      alert('booo'+cellIndex)
    }

    if (value !== input) {
      handleChange({target: { value }});
      if (textArea.current) {
        textArea.current.value = value;
        textArea.current.selectionStart = start
        textArea.current.selectionEnd = end;
      }
    }
  }

  const getRowNumber = (index, row) => {
    const previousNewline = input.lastIndexOf('\n', index-1);
    if (previousNewline < 0) return row;
    return getRowNumber(previousNewline, row+1);
  }
  const handleCellClick = () => setActive(cellIndex);
  return (
    <div className={css`${baseCell} ${isActive && activeCell}`} onClick={handleCellClick}>
      <div className={inOutContainer}>
        <div className={promptContainer}>
          <div className={cx(prompt, inputPrompt)}>In [{num}]:</div>
        </div>
        <TextareaAutosize
          ref={textArea}
          selectionStart={0}
          className={inputArea}
          style={{lineHeight: '20px', resize: 'none', padding: '5px', width: '300px', outline: 'none'}}
          value={input}
          onFocus={handleCellClick}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
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
import React, { useState, useRef, useEffect } from 'react';
import { css, cx } from 'emotion';
import { Button, ButtonGroup } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/CloseRounded';
import CircleIcon from '@material-ui/icons/FiberManualRecord';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import RunIcon from '@material-ui/icons/SkipNext';
import StopIcon from '@material-ui/icons/Stop';
import ReloadIcon from '@material-ui/icons/Replay';
import ReloadAndRunIcon from '@material-ui/icons/FastForward';

import TextareaAutosize from 'react-autosize-textarea';

const TAB = '    ';

//#region base css
const baseJupy = css`
  width: 80%;
  /* border: 1px solid black; */
  /* border-radius: 4px; */
  margin: 0 auto;
  /* box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12); */
`
//#endregion
//#region fileselector css
const fileSelectorBorderRadius = '5px';
const fileSelector = css`
  width: 100%;
  height: 45px;
  overflow-x: hidden;
  padding-bottom: 6px;
  cursor: grab;
  /* cursor: pointer; */
  :hover {
    overflow-x: scroll;
    padding-bottom: 0;
  }
  overflow-y: hidden;
  display: flex;
  border-top-left-radius: ${fileSelectorBorderRadius};
  border-top-right-radius: ${fileSelectorBorderRadius};
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
    border-radius: 0px;
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
  border-bottom: 2px solid rgba(255, 255, 255, 0);
  cursor: pointer;
  :hover {
    background-color: #F1F1F1;
    border-bottom: 2px #485ece solid;

  }
`
const selectedFileTab = css`
  /* background-color: rgba(33, 150, 243, 0.71); */
  background-color: #3f51b5;
  color: #fff;
  border-bottom: 2px #212c63 solid;
  :hover {
    background-color: #314191;
  }
`
//#endregion

const toolbar = css`
  padding: 0.2rem 0.5rem 0.5rem 0.5rem;
`

const cellContainer = css`
  width: 100%;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  padding: 1rem 0;
`
//#region topBarContainer css
const topBarContainer = css`
  width: 100%;
  /* box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12); */
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  border: 1px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 1.5rem;
  border-top-left-radius: ${fileSelectorBorderRadius};
  border-top-right-radius: ${fileSelectorBorderRadius};
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`
//#endregion

const EditorJupy = ({fileData, fileNameArray, handleCellChange, handleInterpreter, handleChangeFile, createNewCell}) => {
  const [activeCell, setActiveCell] = useState(0);
  const [isEdit, setIsEdit] = useState(true)
  const [shouldCreateNewCell, setShouldCreateNewCell] = useState(false);

  useEffect(() => {
    console.log('new cell: ', shouldCreateNewCell);
    if (shouldCreateNewCell) handleCreateNewCell(shouldCreateNewCell)
  }, [shouldCreateNewCell, fileData])
  // const handleCellClick = (key) => setActiveCell(key);
  const handleCellInputChange = newCellData => {
    handleCellChange(newCellData, activeCell)
  }
  const handleActiveCellChange = (oldCellIndex, newCellIndex, isEdit) => {
    console.log(newCellIndex, isEdit)
    if (newCellIndex < 0 || newCellIndex > fileData.cells.length-1) return;
    setActiveCell(newCellIndex);
    setIsEdit(isEdit);
  }

  const handleTabClick = name => handleChangeFile(name);
  const handleTabCloseClick = name => alert('close');

  const handleCreateNewCell = (newCellIndex, cellIndex = 0) => {
    createNewCell(cellIndex, newCellIndex);
    setActiveCell(newCellIndex);
    setIsEdit(true);
    setShouldCreateNewCell(false);
  }

  const handleNewFileAdd = () => {alert('new file')}

  // fileNameArray = ["untitled1", "a;sdkfjf;d", "fsadfasdfasdfsadf", "fsadfasdf","fsadfasdf","fsadfasdf", "fsadfasdfasdfsadf",];
  let selectedFileIndex = fileNameArray.indexOf(fileData.fileName);
  return (
    <div className={baseJupy}>
      <div className={topBarContainer}>
        <div className={fileSelector} onDoubleClick={e => {e.preventDefault(); handleNewFileAdd();}}>
          {fileNameArray.map((fileName, i) => (
            <FileTab
              key={i}
              isNotSaved={false}
              isSelected={i === selectedFileIndex}
              handleClick={handleTabClick}
              handleCloseClick={handleTabCloseClick}
              fileName={fileName}/>))}
        </div>
        <Toolbar />
      </div>
      <div className={cellContainer}>
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
            isLast={i === fileData.cells.length-1}
            handleInterpreter={handleInterpreter}
            createNewCell={setShouldCreateNewCell}
          />
        ))}
      </div>

    </div>
  )
}

const FileTab = ({fileName, handleClick, handleCloseClick, isNotSaved, isSelected}) => (
  <div className={css`${fileTab} ${isSelected ? selectedFileTab : ''}`} onClick={e => {e.stopPropagation(); handleClick(fileName)}}>
    <div>{fileName}</div>
    <div style={{height: '16px', width: '16px'}}>{isNotSaved && <CircleIcon color='secondary' style={{fontSize: '16px', height: '16px'}}/>}</div>
    <div onClick={() => handleCloseClick(fileName)} style={{height: '16px', width: '16px'}}>
      <CloseIcon style={{fontSize: '16px', height: '16px'}}/>
    </div>
  </div>
);

const toolbarIcon = css`
  font-size: 22px !important;
`
const toolbarBtnGroup = css`
  margin-left: 0.4rem;
`

const Toolbar = () => {

  const SquareButton = withStyles({
    root: {
      minWidth: '22px',
      padding: '1px'
    }
  })(Button);

  const btnVariant = 'outlined';
  const btnThemeColor = 'primary';

  return (
    <div className={toolbar}>
      <ButtonGroup className={toolbarBtnGroup}>
        <SquareButton title='save file' color={btnThemeColor} variant={btnVariant}><SaveIcon className={toolbarIcon} /></SquareButton>
      </ButtonGroup>
      <ButtonGroup className={toolbarBtnGroup}>
        <SquareButton title='insert cell bellow' color={btnThemeColor} variant={btnVariant}><AddIcon className={toolbarIcon} /></SquareButton>
      </ButtonGroup>
      <ButtonGroup className={toolbarBtnGroup}>
        <SquareButton title='run selected cell' color={btnThemeColor} variant={btnVariant}><RunIcon className={toolbarIcon}/></SquareButton>
        <SquareButton title='reload interpreter (all variables will be lost)' color={btnThemeColor} variant={btnVariant}><ReloadIcon className={toolbarIcon}/></SquareButton>
        <SquareButton title='reload interpreter and run all cells' color={btnThemeColor} variant={btnVariant}><ReloadAndRunIcon className={toolbarIcon} /></SquareButton>
      </ButtonGroup>
    </div>
  )
}

//#region Cell css
const baseCell = css`
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 0 auto;
  padding: 5px;
  border: 1px solid rgba(0,0,0,0);
  position: relative;
  outline: none;
`
const activeCell = css`
  border: 1px solid #ababab;
  ::before {
    position: absolute;
    display: block;
    top: -1px;
    left: -1px;
    width: 5px;
    height: calc(100% + 2px);
    background: #42A5F5;
    content: '';
  }
`
const editCell = css`
  border: 1px solid #66BB6A;
  ::before {
    background: #66BB6A;
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
  overflow-x: auto !important;
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

const Cell = ({handleCellInputChange, cellIndex, cellData, isLast, isActive, isEdit, handleActiveCellChange, handleInterpreter, createNewCell}) => {
  const {num, input, output, result, error, ast} = cellData;
  const textArea = useRef();
  const cellDiv = useRef();

  useEffect(() => {    
    if (isActive && isEdit) textArea.current.focus(); // !!! when you click on the text area, this is why the cursos is not moved to where you clicked
    else if (isActive && !isEdit) {
      // textArea.current.blur();
      cellDiv.current.focus();
    }
  }, [isActive, isEdit])
  
  const handleChange = e => {
    handleCellInputChange({ input: e.target.value });
  }
  const handleCellKeyDown = e => {
    console.log('cell key');
    e.preventDefault();
    if (e.keyCode === 38 && !isEdit) handleActiveCellChange(cellIndex, cellIndex-1, false);
    if (e.keyCode === 40 && !isEdit) handleActiveCellChange(cellIndex, cellIndex+1, false);
    if (e.keyCode === 13 && e.shiftKey) {
      e.preventDefault();
      handleInterpreter(input, cellIndex);
      if (isLast) createNewCell(cellIndex+1);
      else handleActiveCellChange(cellIndex, cellIndex+1, false);
    }
  }
  const handleCellInputKeyDown = e => {
    e.stopPropagation();
    console.log(e.keyCode);
    // if (e.key === 'x') {e.preventDefault(); console.log(e.target.selectionStart, e.target.selectionEnd, e.persist(), e);}
    // if (e.key === 'x') console.log(getRowNumber(e.target.selectionStart, 0), "<-- row");
    let start = e.target.selectionStart;
    let end = e.target.selectionEnd;
    if (start !== end && input[end-1] === '\n') end--; // to fix moving of rows - when the newlin at the end is selected, the end row number is bigger by one
    let value = input;
    const rowArray = input.split('\n');
    const currentStartRowIndex = getRowNumber(start, 0);
    const currentEndRowIndex = getRowNumber(end, 0);
    if (e.altKey) e.preventDefault();
    if (e.keyCode === 9) { // handle tab
      console.log('tab', currentStartRowIndex, currentEndRowIndex);
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
        if (isFirstRowModified && start !== 0) start -= 1;
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
        console.log('tab2');
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
      else if ((start === 0 && end === start) && isEdit) {
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
      else if ((input.length === end && start === end) && isEdit) {
        handleActiveCellChange(cellIndex, cellIndex+1, true);
      }
    }
    if (e.keyCode === 13 && e.shiftKey) {
      e.preventDefault();
      handleInterpreter(input, cellIndex);
      if (isLast) createNewCell(cellIndex+1);
      else handleActiveCellChange(cellIndex, cellIndex+1, true);
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
    if (row > 500) return 500;
    return getRowNumber(previousNewline, row+1);
  }
  const handleCellClick = () => handleActiveCellChange(cellIndex, cellIndex, false);
  const handleCellInputClick = e => {
    e.stopPropagation();
    handleActiveCellChange(cellIndex, cellIndex, true);
  }
  const handleInputBlur = e => {
    if (isEdit && isActive) handleActiveCellChange(cellIndex, cellIndex, false);
  }
  return (
    <div className={cx(baseCell,{ [activeCell]: isActive}, { [editCell]: (isEdit && isActive)})}
      onMouseDown={handleCellClick}
      onKeyDown={handleCellKeyDown}
      tabIndex='0'
      ref={cellDiv}
    >
      <div className={inOutContainer}>
        <div className={promptContainer}>
          <div className={cx(prompt, inputPrompt)}>In [{num}]:</div>
        </div>
        <TextareaAutosize
          ref={textArea}
          selectionStart={0}
          wrap='off'
          spellCheck='false'
          className={inputArea}
          style={{lineHeight: '20px', resize: 'none', padding: '5px', width: '300px', outline: 'none'}}
          value={input}
          // onFocus={handleCellClick}
          onMouseDown={handleCellInputClick}
          onChange={handleChange}
          onKeyDown={handleCellInputKeyDown}
          onBlur={handleInputBlur}
        />
      </div>
      {Array.isArray(output) && output.map((out, i) => (
        <div className={inOutContainer} key={i}>
          <div className={promptContainer} />
          <div className={outputArea}>
            {out}
          </div>  
        </div>
      ))}
      {result && <div className={inOutContainer}>
        <div className={promptContainer}>
          <div className={cx(prompt, outputPrompt)}>Out[{num}]:</div>
        </div>
        <div className={outputArea}>
          {result}
        </div>
      </div>}
    </div>
  )
}


export default EditorJupy;
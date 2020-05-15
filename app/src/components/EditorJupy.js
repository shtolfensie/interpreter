import React, { useState, useRef, useEffect } from 'react';
import { css, cx } from 'emotion';
import { Button, ButtonGroup, SvgIcon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/CloseRounded';
import CircleIcon from '@material-ui/icons/FiberManualRecord';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import RunIcon from '@material-ui/icons/SkipNext';
import StopIcon from '@material-ui/icons/Stop';
import ReloadIcon from '@material-ui/icons/Replay';
import ReloadAndRunIcon from '@material-ui/icons/FastForward';
import ResetFileIcon from '@material-ui/icons/SettingsBackupRestore';
import EditIcon from '@material-ui/icons/Edit';
// import CopyIcon from '@material-ui/icons/FileCopy';

import TextareaAutosize from 'react-autosize-textarea';

import KeyboardEventHandler from 'react-keyboard-event-handler';

import highlightInput from '../utils/inputCodeHighlight.js';
import autoId from '../utils/autoId.js';

const TAB = '    ';
const CutIcon = <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cut" class="svg-inline--fa fa-cut fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M278.06 256L444.48 89.57c4.69-4.69 4.69-12.29 0-16.97-32.8-32.8-85.99-32.8-118.79 0L210.18 188.12l-24.86-24.86c4.31-10.92 6.68-22.81 6.68-35.26 0-53.02-42.98-96-96-96S0 74.98 0 128s42.98 96 96 96c4.54 0 8.99-.32 13.36-.93L142.29 256l-32.93 32.93c-4.37-.61-8.83-.93-13.36-.93-53.02 0-96 42.98-96 96s42.98 96 96 96 96-42.98 96-96c0-12.45-2.37-24.34-6.68-35.26l24.86-24.86L325.69 439.4c32.8 32.8 85.99 32.8 118.79 0 4.69-4.68 4.69-12.28 0-16.97L278.06 256zM96 160c-17.64 0-32-14.36-32-32s14.36-32 32-32 32 14.36 32 32-14.36 32-32 32zm0 256c-17.64 0-32-14.36-32-32s14.36-32 32-32 32 14.36 32 32-14.36 32-32 32z"></path></svg>;
const PasteIcon = <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clipboard" class="svg-inline--fa fa-clipboard fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M384 112v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h80c0-35.29 28.71-64 64-64s64 28.71 64 64h80c26.51 0 48 21.49 48 48zM192 40c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24m96 114v-20a6 6 0 0 0-6-6H102a6 6 0 0 0-6 6v20a6 6 0 0 0 6 6h180a6 6 0 0 0 6-6z"></path></svg>;
const CopyIcon = <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="copy" class="svg-inline--fa fa-copy fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path></svg>;

//#region base css
const baseJupy = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* border: 1px solid black; */
  /* border-radius: 4px; */
  /* margin: 0 auto; */
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
  /* border-top-left-radius: ${fileSelectorBorderRadius}; */
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
  max-width: 240px;
  height: 100%;
  padding-left: 7px;
  padding-right: 11px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 2px;
  // position: relative;
  flex-shrink: 0;
  background-color: #F8F7F7;
  border-bottom: 2px solid rgba(255, 255, 255, 0);
  cursor: pointer;
  :hover {
    background-color: #F1F1F1;
    border-bottom: 2px #485ece solid;
  }
`
const fileTabCE = css`
  min-width: 60px;
  margin-right: 3px;
  padding: 0 4px;
  outline-color: #2196F3;
  white-space: nowrap;  
  overflow: inherit;
  text-overflow: unset; 
`
const fileTabNameHolder = css`
  min-width: 60px;
  max-width: 200px;
  margin-right: 3px;
  padding: 0 4px;
  white-space: nowrap;  
  overflow: hidden;
  text-overflow: ellipsis; 
`
const fileTabCloseIcon = css`
 :hover {
   color: #ff6666;
 }
`
//#endregion

const toolbar = css`
  padding: 0.2rem 0.5rem 0.5rem 0.5rem;
  display: flex;
  align-items: center;
`
const ccBottomMargin = 100;
const cellContainer = css`
  width: 70%;
  margin: 0 auto ${ccBottomMargin}px auto;
  /* box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12); */
  padding: 1rem 0;
`
const cellScrollContainer = css`
  height: 100%;
  position: relative;
  overflow: overlay;
  ::-webkit-scrollbar-track {
    display: none;
  }

  ::-webkit-scrollbar {
    width: 8px;
    // background-color: #F5F5F5;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(58, 62, 74, 0.55);
  }
`
const cellScrollMainContainer = css`
  height: 100%;
  width: 100%;
  flex-grow: 1;
  position: relative;
  padding-top: 10px;
  overflow: hidden;
`
const cellScrollShadow = css`
  position: absolute;
  /* height: 50px; */
  width: 70%;
  top: 10px;
  left: 15%;
  /* box-shadow: 0px -2px 8px -3px rgba(145,145,145,1); */
  /* box-shadow: 0px -7px 11px -11px rgba(0,0,0,0.75); */
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`
//#region topBarContainer css
const topBarContainer = css`
  width: 70%;
  margin: 0 auto;
  /* box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12); */
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  border: 1px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 0.5rem;
  border-top-right-radius: ${fileSelectorBorderRadius};
  border-top-left-radius: ${fileSelectorBorderRadius};
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`
const topBarFilesRow = css`
  width: 100%;
  display: flex;
  border-top-left-radius: ${fileSelectorBorderRadius};
`
//#endregion

//#region addFileBtn
const addFileBtnContainer = css`
  width: 30px;
  padding-bottom: 8px;
  height: 100%;
`
const addFileBtn = css`
  /* padding: 6px 7px 5px 4px; */
  padding: 1px 7px 2px 4px;
  height: 100%;
  /* background-color: #2196f3; */
  color: #e0e5ea;
  /* border-bottom: 2px #376599 solid; */
  border-top-left-radius: ${fileSelectorBorderRadius};
  cursor: pointer;
  height: 100%;
`
//#endregion

const EditorJupy = ({
  interpreter,
  fileData,
  activeFilesArray,
  handleCellChange,
  handleInterpreter,
  handleChangeFile,
  createNewCell,
  handleAddFileBtn,
  handleFileRename,
  handleFileSave,
  handleFileClose,
  handleResetEnv,
  handleResetFile,
  handleRerunEnv,
  handleClipboard }) => {
  const [activeCell, setActiveCell] = useState(0);
  const [isEdit, setIsEdit] = useState(true)
  const [shouldCreateNewCell, setShouldCreateNewCell] = useState(false);
  const [shouldSetActive, setShouldSetActive] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [shouldBeRenaming, setShouldBeRenaming] = useState(false);
  const [shadowHeight, setShadowHeight] = useState(0);

  useEffect(() => {
    handleShadowHeightChange();
  });

  useEffect(() => {
    if (shouldCreateNewCell !== false) {
      handleCreateNewCell(shouldCreateNewCell);
    }
  }, [fileData, shouldCreateNewCell]);

  useEffect(() => {
    if (shouldSetActive !== false) {
      setActiveCell(shouldSetActive);
      setShouldSetActive(false);
    }
  }, [fileData, shouldSetActive]);

  useEffect(() => {
    if (shouldBeRenaming) setShouldBeRenaming(false);
  }, [shouldBeRenaming]);

  useEffect(() => {
    const acEl = document.querySelector('#ac');
    const cont = document.querySelector('#cont');
    if (acEl.getBoundingClientRect().bottom > window.innerHeight - (ccBottomMargin+16)) cont.scrollBy(0, acEl.getBoundingClientRect().bottom - (window.innerHeight - (ccBottomMargin+16)));
    else if (acEl.getBoundingClientRect().top < cont.getBoundingClientRect().top + 16) cont.scrollBy(0, -1*(cont.getBoundingClientRect().top - acEl.getBoundingClientRect().top + 16) )
    // if (acEl.getBoundingClientRect().bottom > 900) cont.scroll({letf:  0, top: 900 + acEl.getBoundingClientRect().height, behavior: 'smooth'})
    // else if (acEl.getBoundingClientRect().top < cont.getBoundingClientRect().top) cont.scroll({letf: 0, top: -1 * (cont.getBoundingClientRect().top + 16 + acEl.getBoundingClientRect().height), behavior: 'smooth'})
  }, [activeCell])

  //#region topBar css depending on interpreter
  const addFileBtnColor = css`
    background-color: ${interpreter === 'sch' ? '#2196f3' : '#cd5ee0'};
    border-bottom: 2px ${ interpreter === 'sch' ? '#376599' : '#7e1d8f'} solid;
    :hover {
      background-color: '#1a75bd';
      border-bottom: 2px ${ interpreter === 'sch' ? '#75aceb' : '#ef91ff'} solid;
  }
  `
  const selectedFileTabColor = css`
    background-color: ${interpreter === 'sch' ? '#3f51b5' : '#9c27b0'};
    border-bottom: 2px ${interpreter === 'sch' ? '#212c63' : '#61166e'} solid;
    color: #fff;
    :hover {
      background-color: ${interpreter === 'sch' ? '#314191' : '#751b85'};
    }
  `
  const fileTabColor = css`
    :hover {
      border-bottom: 2px ${interpreter === 'sch' ? '#485ece' : '#bd49d1'} solid;
    }
  `
  const toolbarBtnColor = css`
    color: ${interpreter === 'sch' ? '#3f51b5' : '#9c27b0'} !important;
  `
  //#endregion
  const handleCellInputChange = newCellData => {
    handleCellChange(newCellData, activeCell)
  }
  const handleActiveCellChange = (oldCellIndex, newCellIndex, isEdit) => {
    console.log(newCellIndex, isEdit)
    if (newCellIndex < 0 || newCellIndex > fileData.cells.length-1) return;
    if (oldCellIndex < newCellIndex) setSelectionStart(0);
    else if (oldCellIndex > newCellIndex) setSelectionStart(fileData.cells[newCellIndex].input.length);
    else if (oldCellIndex === newCellIndex) setSelectionStart(-1);
    setActiveCell(newCellIndex);
    setIsEdit(isEdit);
  }

  const handleKeyDown = (key, e) => {
    if (!isEdit) {
      if (e.keyCode === 82 && e.ctrlKey) {
        if (window.confirm("All unsaved files and all envs will be lost. Do you want to reload?")) return;
      }
      e.preventDefault();
      if (e.keyCode === 38) handleActiveCellChange(activeCell, activeCell-1, false); // up-arrow
      else if (e.keyCode === 40) handleActiveCellChange(activeCell, activeCell+1, false); // down-arrow
      else if (e.keyCode === 13 && e.shiftKey) { // interpret cell and move selected cell below or add new if there is no cell below
        handleInterpreter(fileData.cells[activeCell].input, activeCell);
        if (fileData.cells.length-1 === activeCell) setShouldCreateNewCell(activeCell+1);
        else handleActiveCellChange(activeCell, activeCell+1, false);
      }
      else if (e.keyCode === 13 && e.ctrlKey) { // interpret cell, don't change selected cell
        handleInterpreter(fileData.cells[activeCell].input, activeCell);
      }
      else if (e.keyCode === 13 && e.altKey) { // interpret cell, add new cell below
        handleInterpreter(fileData.cells[activeCell].input, activeCell);
        setShouldCreateNewCell(activeCell+1);
      }
      else if (e.keyCode === 13) {
        setIsEdit(true);
      }
      else if (e.keyCode === 83 && e.ctrlKey) handleFileSave();
      else if (e.keyCode === 67 && e.ctrlKey) handleClipboard('copy', activeCell); // ctrl+c
      else if (e.keyCode === 86 && e.ctrlKey) handleClipboard('paste', activeCell+1); // ctrl+v
      else if (e.keyCode === 88 && e.ctrlKey) { // ctrl+x
        handleClipboard('cut', activeCell);
        let cellIndex = activeCell;
        if (cellIndex > fileData.cells.length-1) cellIndex-=1;
        setShouldSetActive(cellIndex);
      }
      else if (e.keyCode === 46)  { // delete
        handleClipboard('delete', activeCell);
        let cellIndex = activeCell;
        if (cellIndex > fileData.cells.length-1 && fileData.cells.length !== 1) cellIndex-=1;
        setShouldSetActive(cellIndex);
      }
      else if (e.keyCode === 65) handleCreateNewCell(activeCell, false); // a
      else if (e.keyCode === 66) handleCreateNewCell(activeCell+1, false); // b 
    }
  }

  const handleKeysArr = ['all'];

  const handleTabClick = id => {
    handleChangeFile(id);
    setActiveCell(0); // to ensure that the cell isn't out of range in the new file
  }

  const handleCreateNewCell = (newCellIndex, edit = true) => {
    createNewCell(newCellIndex);
    setActiveCell(newCellIndex);
    setIsEdit(edit);
    setShouldCreateNewCell(false);
  }

  const handleShadowHeightChange = () => {
    const el = document.querySelector('#cc');
    const cont = document.querySelector('#cont')
    const newHeight = el.getBoundingClientRect().bottom - cont.getBoundingClientRect().top;
    if (newHeight !== shadowHeight) setShadowHeight(newHeight);
  }


  // fileNameArray = ["untitled1", "a;sdkfjf;d", "fsadfasdfasdfsadf", "fsadfasdf","fsadfasdf","fsadfasdf", "fsadfasdfasdfsadf",];
  // let selectedFileIndex = fileNameArray.indexOf(fileData.fileName);
  let selectedFileIndex = 0;
  // console.log(activeFilesArray)
  // console.log(fileData)
  activeFilesArray.forEach((file, i) => {
    if (file[1] === fileData.id) selectedFileIndex = i;
  })
  return (
    <div className={baseJupy}>
      <KeyboardEventHandler
        handleKeys={handleKeysArr}
        onKeyEvent={handleKeyDown} />
      <div className={topBarContainer}>
        <div className={topBarFilesRow}>
          <div className={addFileBtnContainer}>
            <div className={cx(addFileBtn, addFileBtnColor)} onClick={() =>  handleAddFileBtn()} >
              <AddIcon style={{marginTop: '6px'}}/>
            </div>
          </div>
          <div className={fileSelector} onDoubleClick={e => {e.preventDefault(); handleAddFileBtn();}}>
            {activeFilesArray.map((file, i) => (
              <FileTab
                key={i}
                isNotSaved={false}
                isSelected={i === selectedFileIndex}
                handleClick={handleTabClick}
                handleCloseClick={handleFileClose}
                handleFileRename={handleFileRename}
                fileName={file[0]}
                fileId={file[1]}
                isSaved={file[2]}
                startRenaming={shouldBeRenaming}
                cssColors={[selectedFileTabColor, fileTabColor]}
              />

            ))}
          </div>
        </div>
        <Toolbar
          saveFile={handleFileSave}
          handleCreateNewCell={handleCreateNewCell}
          handleInterpreter={handleInterpreter}
          handleResetEnv={handleResetEnv}
          handleRerunEnv={handleRerunEnv}
          handleResetFile={handleResetFile}
          handleClipboard={handleClipboard}
          setShouldSetActive={setShouldSetActive}
          setShouldBeRenaming={setShouldBeRenaming}
          fileData={fileData}
          activeCell={activeCell}
          cssColor={toolbarBtnColor}
        />
      </div>
      <div className={cellScrollMainContainer}>
        <ScrollShadow height={shadowHeight}/>
        <div className={cellScrollContainer} id='cont'>
          <div className={cellContainer} id='cc'>
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
                selectionStart={selectionStart}
                isLast={i === fileData.cells.length-1}
                handleInterpreter={handleInterpreter}
                createNewCell={setShouldCreateNewCell}
                handleFileSave={handleFileSave}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

const ScrollShadow = ({height}) => {

  const [shadowHeight, setShadowHeight] = useState(0);
  useEffect(() => {
    console.log(height)
    if (height !== shadowHeight) setShadowHeight(height);
  }, [height]);
  useEffect(() => {
    document.querySelector('#cont').addEventListener('scroll', handleScroll);
    return () => {
      document.querySelector('#cont').removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleScroll = () => {
    const el = document.querySelector('#cc');
    const cont = document.querySelector('#cont')
    const newHeight = el.getBoundingClientRect().bottom - cont.getBoundingClientRect().top;
    if ((newHeight !== shadowHeight) && (cont.offsetHeight > shadowHeight || newHeight < shadowHeight)) {
      setShadowHeight(newHeight);
    }
  }

  return (
    <div className={cellScrollShadow} style={{height: `${shadowHeight}px`}}></div>
  )
}

const FileTab = ({fileName, fileId, handleFileRename, handleClick, handleCloseClick, isSaved, isSelected, cssColors, startRenaming}) => {

  const [isRenaming, setIsRenaming] = useState(false);
  const nameDiv = useRef();

  useEffect(() => {
    if (startRenaming && isSelected) setIsRenaming(true);
  }, [startRenaming])

  useEffect(() => {
    if (nameDiv.current && isRenaming) {
      let range = document.createRange();
      let selection = window.getSelection();
      range.setStart(nameDiv.current.childNodes[0],0);
      range.setEnd(nameDiv.current.childNodes[0], fileName.length);
      selection.removeAllRanges();
      selection.addRange(range);
      nameDiv.current.focus();
    }
    else if (!isRenaming) {
      let selection = window.getSelection();
      selection.removeAllRanges();
    }
    return () => {
      if (nameDiv.current) nameDiv.current.blur();
    };
  }, [isRenaming]);
  useEffect(() => {
    if (!isSelected && isRenaming) {
      const didntRename = handleFileRename(nameDiv.current.innerHTML, fileId);
      if (didntRename) nameDiv.current.innerHTML = fileName;
      setIsRenaming(false);
    }
  }, [isSelected])
  const handleKeyDown = e => {
    console.log(fileName, nameDiv.current.innerHTML)
    if (e.keyCode === 13 && isRenaming) {
      e.preventDefault();
      const didntRename = handleFileRename(nameDiv.current.innerHTML, fileId);
      if (didntRename) nameDiv.current.innerHTML = fileName;
      setIsRenaming(false);
    }
    else if (e.keyCode === 27 && isRenaming) {
      e.preventDefault();
      nameDiv.current.innerHTML = fileName;
      setIsRenaming(false);
    }
    else if (e.keyCode === 9 && isRenaming) e.preventDefault();
  }
  const handleBlur = e => {
    const didntRename = handleFileRename(nameDiv.current.innerHTML, fileId);
    if (didntRename) nameDiv.current.innerHTML = fileName;
    setIsRenaming(false);
  }
  return (
    <div className={cx(fileTab, cssColors[1], {[cssColors[0]]: isSelected})}
      onMouseDown={e => { // mouseUp doesnt really help with not renaming if doubleclicking on notactive tab
        e.stopPropagation();
        if (e.button === 1) handleCloseClick(fileId);
        else handleClick(fileId);
        }
      }
      onDoubleClick={e => {
        if (isSelected) setIsRenaming(true);
        e.stopPropagation();
      }}
    >
      {isRenaming && <div contentEditable={isRenaming} ref={nameDiv} onKeyDown={handleKeyDown} onBlur={handleBlur} className={fileTabCE}>{fileName}</div>}
      <div style={!isRenaming ? {display: 'block'} : {display: 'none'}} className={fileTabNameHolder}>{fileName}</div>
      <div title={!isSaved && 'file not saved'} style={{height: '16px', width: '16px'}}>{!isSaved && <CircleIcon color='secondary' style={{fontSize: '16px', height: '16px'}}/>}</div>
      <div onMouseUp={(e) => {
        e.stopPropagation();
        handleCloseClick(fileId)}} style={{height: '16px', width: '16px'}}
        onMouseDown={e => e.stopPropagation()} // this prevents the selection of the tab by blocking the main onMouseDown e, just before the tab closes
      >
        <CloseIcon style={{fontSize: '16px', height: '16px'}} className={fileTabCloseIcon}/>
      </div>
    </div>
  )
};

const toolbarIcon = css`
  font-size: 22px !important;
`
const toolbarBtnGroup = css`
  margin-left: 0.4rem;
  height: 100%;
`

const Toolbar = ({
  saveFile,
  cssColor,
  handleCreateNewCell,
  handleInterpreter,
  handleResetEnv,
  handleResetFile,
  handleRerunEnv,
  handleClipboard,
  setShouldSetActive,
  setShouldBeRenaming,
  fileData,
  activeCell }) => {

  const SquareButton = withStyles({
    root: {
      minWidth: '22px',
      padding: '1px'
    }
  })(Button);

  const btnVariant = 'outlined';
  const btnThemeColor = 'default';

  const doClipboard = (operation, cellIndex = activeCell) => {
    handleClipboard(operation, cellIndex);
    if (operation === 'cut') {
      if (cellIndex > fileData.cells.length-1) cellIndex-=1;
      setShouldSetActive(cellIndex);
    }
  }

  return (
    <div className={toolbar} onClick={() => alert('click')}>
      <ButtonGroup className={toolbarBtnGroup}>
        <SquareButton title='save file' onMouseUp={saveFile} className={cssColor} variant={btnVariant}><SaveIcon className={toolbarIcon} /></SquareButton>
      </ButtonGroup>
      <ButtonGroup className={toolbarBtnGroup}>
        <SquareButton title='rename file' onMouseUp={() => setShouldBeRenaming(true)} className={cssColor} variant={btnVariant}><EditIcon className={toolbarIcon} /></SquareButton>
      </ButtonGroup>
      <ButtonGroup className={toolbarBtnGroup}>
        <SquareButton title='insert cell bellow' onMouseUp={() => handleCreateNewCell(activeCell+1)} className={cssColor} variant={btnVariant}><AddIcon className={toolbarIcon} /></SquareButton>
      </ButtonGroup>
      <ButtonGroup className={toolbarBtnGroup}>
        <SquareButton title='cut selected cell' onMouseUp={() => doClipboard('cut')} className={cssColor} variant={btnVariant} style={{padding: 3}}><SvgIcon style={{fontSize: 16}}>{CutIcon}</SvgIcon></SquareButton>
        <SquareButton title='copy selected cell' onMouseUp={() => doClipboard('copy')} className={cssColor} variant={btnVariant} style={{padding: 3}}><SvgIcon style={{fontSize: 16}}>{PasteIcon}</SvgIcon></SquareButton>
        <SquareButton title='paste cells below' onMouseUp={() => doClipboard('paste', activeCell+1)} className={cssColor} variant={btnVariant} style={{padding: 3}}><SvgIcon style={{fontSize: 16}}>{CopyIcon}</SvgIcon></SquareButton>
      </ButtonGroup>
      <ButtonGroup className={toolbarBtnGroup}>
        <SquareButton title='run selected cell' onMouseUp={() => handleInterpreter(fileData.cells[activeCell].input, activeCell)} className={cssColor} variant={btnVariant}><RunIcon className={toolbarIcon}/></SquareButton>
        <SquareButton title='reload interpreter (all variables will be lost)' onMouseUp={handleResetEnv} className={cssColor} variant={btnVariant}><ReloadIcon className={toolbarIcon}/></SquareButton>
        <SquareButton title='reload interpreter and run all cells' onMouseUp={handleRerunEnv} className={cssColor} variant={btnVariant}><ReloadAndRunIcon className={toolbarIcon} /></SquareButton>
        <SquareButton title='reload interpreter and reset all output (all variables and output data will be lost)' onMouseUp={handleResetFile} className={cssColor} variant={btnVariant}><ResetFileIcon className={toolbarIcon} /></SquareButton>
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
  user-select: none;

`
const inputPrompt = css`
  color: #303F9F;
`
const inputArea = css`
  position: relative;
  z-index: 123;
  flex-grow: 1;
  tab-size: 4;
  overflow-x: auto !important;
  /* background-color: #f7f7f7; */
  border-radius: 2px;
  width: 100%;
  color: rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
  caret-color: white;
  font-size: 13.3333px;
  ::selection {
    background: rgba(61, 163, 245, 0.6);
  }
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
const errorPrompt = css`
  color: red;
`
const errorArea = css`
  flex-grow: 1;
  padding: 0.4em;
  font-size: 14px;
  line-height: 1.21429em;
  font-family: monospace;
  font-weight: bold;
  color: red;
`

const textAreaHighlightContainer = css`
  position: relative;
  flex-grow: 1;
`
const inputHighlighted = css`
  line-height: 20px;
  tab-size: 4;
  padding: 5px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  font-size: 13.3333px;
  font-family: monospace;
  border: 1px solid rgb(169, 169, 169);
  border-radius: 2px;
  pointer-events: none;
  /* background: rgba(0,0,0,0); */
  .bracket-0 {
    color: gold;
  }
  .bracket-1 {
    color: orchid;
    /* color: #ffa2fb; */
    /* color: #a5d6a7; */
  }
  .bracket-2 {
    color: lightskyblue;
  }
  .bracket-3 {
    color: white;
  }
  .bracket-error {
    color: darkviolet;
    border-bottom: 1px solid red;
  }
  .bracket-active {
    outline: 1px #e01f49 solid;
    background-color: rgba(224, 31, 73, 0.3);
  }
  .hljs-number {
    /* color: #C52246; */
  }
    background: #3f475c;
    /* background: #4b587b; */
`
//#endregion

const Cell = ({
  handleCellInputChange,
  cellIndex,
  selectionStart,
  cellData,
  isLast,
  isActive,
  isEdit,
  handleActiveCellChange,
  handleInterpreter,
  createNewCell,
  handleFileSave}) => {
  const {num, input, output, result, error, ast} = cellData;
  const textArea = useRef();
  const [cellHeight, setCellHeight] = useState(32);
  const [caretPos, setCaretPos] = useState(-1);

  useEffect(() => {    
    if (isActive && isEdit) textArea.current.focus(); // !!! it works now? when you click on the text area, this is why the cursos is not moved to where you clicked
    else if (!isEdit) textArea.current.blur();
    if (!isActive || !isEdit) setCaretPos(-1);
    if (textArea.current) {
      textArea.current.style.caretColor = 'rgba(0,0,0,0)';
      setTimeout(() => {
        if (selectionStart !== -1) {
          if (textArea.current) {
            textArea.current.selectionStart = selectionStart;
            textArea.current.selectionEnd = selectionStart;
          }
        }
        if (textArea.current) textArea.current.style.caretColor = 'white';
      }, 0);
      console.log(textArea.current.selectionStart, textArea.current.selectionEnd)
    }
  }, [isActive, isEdit]);
  // useEffect(() => {
  //   setCellHeight(textArea.current.offsetHeight)
  // }, [])
  useEffect(() => {
    setCellHeight(textArea.current.offsetHeight)
  }, [input])
  
  const handleChange = e => {
    handleCellInputChange({ input: e.target.value });
    if (cellHeight !== e.target.offsetHeight) setCellHeight(e.target.offsetHeight);
  }

  const handleCellInputKeyDown = e => {
    e.stopPropagation();
    const bracketMap = {'[':']','{':'}','(':')'};
    const bracketMapReverse = {']':'[','}':'{',')':'('};
    if (e.keyCode === 82 && e.ctrlKey) {
      if (!window.confirm("All unsaved files and all envs will be lost. Do you want to reload?")) {
        e.preventDefault();
        return;
      };
    }
    if (e.location === 0
      && e.keyCode !== 38
      && e.keyCode !== 27
      && e.keyCode !== 40
      && e.keyCode !== 13
      && e.keyCode !== 9
      && !Object.keys(bracketMap).includes(e.key) 
      && !Object.keys(bracketMapReverse).includes(e.key)) return;
    console.log('hejo');
    
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
    if (e.keyCode === 27) { // esc
      textArea.current.blur();
      handleActiveCellChange(cellIndex, cellIndex, false);
    }
    else if (e.keyCode === 9) { // handle tab
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
    else if (e.keyCode === 38) { // up-arrow
      if (e.altKey && e.shiftKey) {
        let toBeCopied = rowArray.slice(currentStartRowIndex, currentEndRowIndex+1);
        rowArray.splice(currentEndRowIndex+1, 0, ...toBeCopied);
        value = rowArray.join('\n');
      }
      else if (e.altKey) {
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
    }
    else if (e.keyCode === 40) { // down-arrow
      if (e.altKey && e.shiftKey) {
        let toBeCopied = rowArray.slice(currentStartRowIndex, currentEndRowIndex+1);
        rowArray.splice(currentEndRowIndex+1, 0, ...toBeCopied);
        for (let i = 0; i < toBeCopied.length; i++) {
          start += toBeCopied[i].length + 1;
          end += toBeCopied[i].length + 1;
        }
        value = rowArray.join('\n');
      }
      else if (e.altKey) {
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
    else if (e.keyCode === 13 && e.shiftKey) { // ctrl+enter
      e.preventDefault();
      handleInterpreter(input, cellIndex);
      if (isLast) createNewCell(cellIndex+1);
      else handleActiveCellChange(cellIndex, cellIndex+1, true);
    }
    else if (e.keyCode === 13 && e.ctrlKey) { // interpret cell, don't change selected cell
      handleInterpreter(input, cellIndex);
    }
    else if (e.keyCode === 13 && e.altKey) { // interpret cell, add new cell below
      handleInterpreter(input, cellIndex);
      createNewCell(cellIndex+1);
    }
    else if (e.keyCode === 83 && e.ctrlKey) { // ctrl+s
      e.preventDefault();
      handleFileSave();
    }

    // moved bracket array to the top
    else if (Object.keys(bracketMap).includes(e.key)) { // autobrackets
      e.preventDefault();
      value = value.slice(0, start) + e.key + value.slice(start, end) + bracketMap[e.key] + value.slice(end);
      start++;
      end++;
    }
    // autobrackets move cursor if closing bracket already exists
    else if (Object.keys(bracketMapReverse).includes(e.key) && start === end && value[start] === e.key && value[start-1] === bracketMapReverse[e.key]) {
      e.preventDefault();
      start++;
      end++;
      textArea.current.selectionStart = start
      textArea.current.selectionEnd = end;
    }

    else if (e.keyCode === 191 && e.ctrlKey) { // ctrl+/  - comments
      let toBeCommented = rowArray.slice(currentStartRowIndex, currentEndRowIndex+1);
      let toUnComment = toBeCommented.reduce((acc, cur) => acc = acc && cur.trim().slice(0,2) === '; ', true)
      console.log(toBeCommented, toUnComment)
      for (let i = currentStartRowIndex; i < currentEndRowIndex+1; i++) {
        if (toUnComment) {
          let commentIndex = [rowArray[i].indexOf('; '), 2];
          if (commentIndex[0] === -1) commentIndex = [rowArray[i].indexOf(';'), 1];
          console.log(commentIndex)
          rowArray[i] = rowArray[i].slice(0, commentIndex[0]) + rowArray[i].slice(commentIndex[0]+commentIndex[1]);
        }
        else rowArray[i] = '; ' + rowArray[i];
      }
      start = end;
      value = rowArray.join('\n');
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

  const handleCellInputKeyUp = e => {
    console.log(e.target.selectionStart, e.target.selectionEnd)
    if (e.target.selectionStart === e.target.selectionEnd) {
      if (caretPos !== e.target.selectionStart) setCaretPos(e.target.selectionStart);
    }
    else if (caretPos !== -1) setCaretPos(-1);
  }

  const getRowNumber = (index, row, inputText = input) => {
    const previousNewline = inputText.lastIndexOf('\n', index-1);
    if (previousNewline < 0) return row;
    if (row > 500) return 500;
    return getRowNumber(previousNewline, row+1);
  }
  const handleCellClick = () => handleActiveCellChange(cellIndex, cellIndex, false);
  const handleCellInputClick = e => {
    e.stopPropagation();
    handleActiveCellChange(cellIndex, cellIndex, true);
  }
  const handleCellInputMouseUp = e => {
    if (e.target.selectionStart === e.target.selectionEnd) setCaretPos(e.target.selectionStart);
    else setCaretPos(-1);
  }
  const handleInputBlur = e => {
    if (isEdit && isActive) handleActiveCellChange(cellIndex, cellIndex, false);
  }
  return (
    <div
      className={cx(baseCell,{ [activeCell]: isActive}, { [editCell]: (isEdit && isActive)})}
      onMouseDown={handleCellClick}
      id={isActive && 'ac'}
    >
      <div className={inOutContainer}>
        <div className={promptContainer}>
          <div className={cx(prompt, inputPrompt)}>In [{num}]:</div>
        </div>
        <div className={textAreaHighlightContainer}>
          <TextareaAutosize
            ref={textArea}
            selectionStart={0}
            wrap='off'
            spellCheck='false'
            className={cx(inputArea, 'hljs')}
            style={{lineHeight: '20px', resize: 'none', padding: '5px', outline: 'none'}}
            value={input}
            // onFocus={handleCellClick}
            onMouseDown={handleCellInputClick}
            onMouseUp={handleCellInputMouseUp}
            onChange={handleChange}
            onKeyDown={handleCellInputKeyDown}
            onKeyUp={handleCellInputKeyUp}
            onBlur={handleInputBlur}
          />
          <pre  className={cx(inputHighlighted, 'hljs')} style={{height: cellHeight}}>{highlightInput(input, caretPos)}</pre>
        </div>
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
      {(error && typeof error === 'string') && <div className={inOutContainer}>
        <div className={promptContainer}>
          <div className={cx(prompt, errorPrompt)}>Error[{num}]:</div>
        </div>
        <div className={errorArea}>
          {error}
        </div>
      </div>}
    </div>
  )
}


export default EditorJupy;
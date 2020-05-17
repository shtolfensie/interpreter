import React, { useState, useEffect } from 'react'
import { css, cx } from 'emotion';
import { Modal, Button, Collapse } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {exampleFiles, sectionArray} from '../utils/examples.js';

const modalContainer = css`
  width: 85%;
  height: 70%;
  background-color: #fff;
  outline: none;
  border-radius: 4px;
  padding: 1rem;
  overflow-y: scroll;
  ::-webkit-scrollbar-track {
    display: none;
  }
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: rgba(58, 62, 74, 0.55);
  }
`

const ExamplesMenu = ({ setExampleFile, isInterpreterJSlike }) => {

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => { // to blur the examples button, focus the document and make the keyevent listener work. Needs to be in an effect to jire after the focus is shifted to the button after closing
    if (!isOpen) {
      window.focus();
      setTimeout(() => { // timeout here helps with the animation of the focussed button not getting stuck. I think
        if (document.activeElement) document.activeElement.blur();
      }, 50);
    }
  }, [isOpen])

  const handleOpen = e => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button color='inherit' variant='outlined' onClick={handleOpen}>Examples</Button>
      <Modal
        open={isOpen}
        onClose={handleClose}
        keepMounted={true} // makes the sections remember their state. don't have to store the state in the main component
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div className={modalContainer}>
          {sectionArray.map((section, i) => <Section key={i} sectionData={section} setExampleFile={setExampleFile}/>)}
        </div>
      </Modal>
    </>
  )
}

//#region section css
const sectionContainer = css`
  border: 1px solid rgba(68, 60, 101, 0.4);
  /* box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12); */
  border-radius: 5px;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin-bottom: 1rem;
`
const header = css`
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
const arrow = css`
  width: 2rem;
  height: 100%;
  transform: none;
  transition: transform 0.5s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
const arrowOpen = css`
  transform: rotate(90deg);
`
const title = css`
 font-size: 1.5rem;
 cursor: pointer;
 user-select: none;
`
const collapseContainer = css`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  background: #f5f5f5;
  padding: 5px;
`
const exampleButton = css`
  cursor: pointer;
  user-select: none;
  width: 150px;
  height: 150px;
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  /* box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.56); */
  /* box-shadow: 0px 0px 5px -2px rgba(0,0,0,0.3); */
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
  background: #fff;
  :hover {
    background: #fbfbfb;
  }
`
const examplePicutre = css``
const exampleTitle = css`
  font-weight: 400;
`
//#endregion

const Section = ({sectionData, setExampleFile}) => {

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className={sectionContainer}>
      <div className={header}>
        <div className={cx(arrow, {[arrowOpen]: isOpen})} onMouseUp={handleClick}><PlayArrowIcon/></div>
    <div className={title} onMouseUp={handleClick}>{sectionData.sectionTitle}</div>
      </div>
      <Collapse in={isOpen}>
        <div className={collapseContainer}>
          {sectionData.examples.map((example, i) => (
            <div className={exampleButton} onMouseUp={() => setExampleFile(exampleFiles[example.eId])} key={i}>
              <div className={examplePicutre}></div>
            <div className={exampleTitle}>{example.eTitle}</div>
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  )
}


export default ExamplesMenu;
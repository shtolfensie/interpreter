import React, { useState, useEffect } from 'react'
import { css, cx } from 'emotion';

import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Icon } from '@material-ui/core';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';

const fileExplorerArrow = css`
  position: absolute;
  top: 150px;
  left: -8px;
  /* border: 2px solid black; */
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  border-radius: 10px;
  /* padding: 0.6rem; */
  /* padding-left: 1rem; */
  /* font-size: 1.1rem; */
  /* text-align: center; */
  /* vertical-align: middle; */
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  :hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`
const fileExplorerArrowHidden = css`
  left: -75px;
  background-color: rgba(0, 0, 0, 0.3);
  :hover {
  background-color: rgba(0, 0, 0, 0.3);
  }
`
const fileExplorerWidth = 230;
const fileExplorerBase = css`
  z-index: 1000;
  position: absolute;
  top: 100px;
  left: -${fileExplorerWidth+10}px;
  width: ${fileExplorerWidth}px;
  height: calc(100vh - 100px - 20px);
  background-color: #ffffff;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  transition: all 0.4s ease-in-out;
`
const fileExplorerActive = css`
  left: -4px;
`

const useStyles = makeStyles({
  listIcon: {
    minWidth: '35px'
  }
})

const FileExplorer = ({firebase, handleFileSelect, interpreter}) => {
  const classes = useStyles();

  const [files, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([])
  const [authUser, setAuthUser] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {

    let unSub = firebase.auth.onAuthStateChanged(user => user ? setAuthUser(user) : setAuthUser(false));

    return () => {
      unSub();
    };
  }, []) // emty array -> works like comp. did mount
  useEffect(() => {
    let unSub = () => {}
    if (authUser) unSub = firebase.db.collection(authUser.uid).onSnapshot(snapshot => handleSetFiles(snapshot));
    return () => {
      unSub();
    };
  }, [authUser]);
  useEffect(() => {
    handleSetFiles(null, allFiles);
  }, [interpreter])

  const handleSetFiles = (snapshot, fileArr = []) => {
    if (snapshot) {
      snapshot.forEach(doc => fileArr.push([doc.data().fileName, doc.id, doc.data().fileType]));
      setAllFiles(fileArr);
    }
    fileArr = fileArr.filter(file => file[2] === interpreter);
    setFiles(fileArr);
  }

  return (
    authUser
    ? <>
      <div className={cx(fileExplorerArrow, {[fileExplorerArrowHidden]: isActive})} onClick={() => setIsActive(true)}><ListItem><ListItemIcon className={classes.listIcon}><ArrowForwardIcon/></ListItemIcon><ListItemText primary='Files'/></ListItem></div>
      <div className={cx(fileExplorerBase, {[fileExplorerActive]: isActive})}>
        <List>
          <ListItem button key={0} onClick={() => setIsActive(false)}><ListItemIcon><ArrowBackIcon/></ListItemIcon><ListItemText primary='Close' /></ListItem>
          <Divider />
          {files.map((file, i) => <ListItem onClick={() => handleFileSelect(file[1])} button key={i+1}><ListItemIcon className={classes.listIcon}><FileIcon /></ListItemIcon><ListItemText primary={file[0]}/></ListItem>)}
        </List>
      </div>
    </>
    : null
  )
}


export default FileExplorer;
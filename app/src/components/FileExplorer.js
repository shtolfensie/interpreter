import React, { useState, useEffect } from 'react'
import { css, cx } from 'emotion';

import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Icon } from '@material-ui/core';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';
import DeleteIcon from '@material-ui/icons/DeleteForever';

import ConfirmModal from './ConfirmModal.js';

const fileExplorerArrow = css`
  position: absolute;
  z-index: 999;
  top: 150px;
  left: -8px;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
  border-radius: 10px;
  user-select: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  background-color: #fff;
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
const fileExplorerWidth = 250;
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
const fileExplorerFiles = css`
  overflow-y: auto;
  padding-bottom: 8px;
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
const fileExplorerActive = css`
  left: -4px;
`
const listIconDelete = css`
  min-width: 24px !important;
  :hover {
    color: #f50057;
  }
`

const useStyles = makeStyles({
  listIcon: {
    minWidth: '35px'
  }
})

const FileExplorer = ({firebase, handleFileSelect, handleFileDelete, interpreter}) => {
  const classes = useStyles();

  const [files, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([])
  const [authUser, setAuthUser] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

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

  const handleDeleteFileClick = (id) => setDeleteConfirm(id);
  const handleDeleteFileConfirm = () => {
    const id = deleteConfirm;
    let deleteDoc = firebase.db.collection(authUser.uid).doc(id).delete();
    setDeleteConfirm(false);
    deleteDoc.then(() => handleFileDelete(id)).catch(err => console.log(`Error removing file: ${id}; ${err}`))
  }
  const handleDeleteModalClose = () => setDeleteConfirm(false);

  return (
    authUser
    ? <>
      <div className={cx(fileExplorerArrow, {[fileExplorerArrowHidden]: isActive})} onClick={() => setIsActive(true)}><ListItem><ListItemIcon className={classes.listIcon}><ArrowForwardIcon/></ListItemIcon><ListItemText primary='Files'/></ListItem></div>
      <div className={cx(fileExplorerBase, {[fileExplorerActive]: isActive})}>
        <List style={{display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: 0}}>
          <ListItem button key={0} onClick={() => setIsActive(false)}><ListItemIcon><ArrowBackIcon/></ListItemIcon><ListItemText primary='Close' /></ListItem>
          <Divider />
          <div className={fileExplorerFiles}>
          {files.map((file, i) => (
            <ListItem title={file[0]} style={{height: 42}} onClick={() => handleFileSelect(file[1])} button key={i+1}>
              <ListItemIcon className={classes.listIcon}><FileIcon /></ListItemIcon>
              <ListItemText style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} primaryTypographyProps={{variant: 'body2'}} primary={file[0]}/>
              <ListItemIcon title='Delete this file from the database' className={cx(listIconDelete, classes.listIcon)} onMouseUp={() => handleDeleteFileClick(file[1])}><DeleteIcon /></ListItemIcon>
            </ListItem>
          ))}
          </div>
        </List>
      </div>
      <ConfirmModal
        open={deleteConfirm ? true : false}
        buttons={[{text: 'Cancel', function: handleDeleteModalClose}, {text: 'Delete', function: handleDeleteFileConfirm, color: 'secondary', variant: 'outlined'}]}
        title='Delete this file permanently?'
        text="Deleting this file can't be undone."
        handleClose={handleDeleteModalClose}
      />
    </>
    : null
  )
}


export default FileExplorer;
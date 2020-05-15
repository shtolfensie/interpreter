import React, { useState } from 'react';

import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';

const ConfirmModal = ({open, title, text, buttons, handleClose}) => {


  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
      {text && <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>}
      <DialogActions>
        {buttons.map((button) => (
          <Button key={button.text} onMouseUp={button.function} color={button.color ? button.color : "default"} variant={button.variant ? button.variant : 'text'}>
            {button.text}
          </Button>

        ))}
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmModal;
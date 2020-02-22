import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { Menu, MenuItem, IconButton } from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle';

import AorBSwitch from './AorBSwitch.js';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
}));

const Header = ({handleInterpreterChange, handleEditorChange, isEditorClassic, isInterpreterJSlike}) => {
  const classes = useStyles();
  const [auth, setAuth] = useState(true);
  

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <AorBSwitch a='Schemy' b='JS-Like' handleChange={handleInterpreterChange} isChecked={isInterpreterJSlike}/>
          <AorBSwitch a='jupy' b='classic' handleChange={handleEditorChange} isChecked={isEditorClassic}/>
          <div className={classes.grow}/>
          {auth ? <AccountAvatarAndMenu /> : <Button color='inherit'>Login</Button>}
        </Toolbar>
      </AppBar>
    </div>
  );
}

const AccountAvatarAndMenu = () => {
  const [anchorElement, setAnchorElement] = useState(null);
  const isMenuOpen = Boolean(anchorElement);

  const handleMenuOpen = e => setAnchorElement(e.currentTarget);
  const handleMenuClose = () => setAnchorElement(null);

  return (
    <div>
      <IconButton
        color='inherit'
        onClick={handleMenuOpen}
      >
        <AccountCircle/>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      </Menu>
    </div>
  )
}

export default Header;
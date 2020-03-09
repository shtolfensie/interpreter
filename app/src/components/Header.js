import React, { useState, useEffect } from 'react';
import { FirebaseContext } from './Firebase';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Avatar } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Menu, MenuItem, IconButton } from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle';

import AorBSwitch from './AorBSwitch.js';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    cursor: 'pointer'
  }
}));

const Header = ({handleInterpreterChange, handleEditorChange, isEditorClassic, isInterpreterJSlike}) => {
  const classes = useStyles();
  const [user, setUser] = useState(false);
  

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <AorBSwitch a='Schemy' b='JS-Like' handleChange={handleInterpreterChange} isChecked={isInterpreterJSlike}/>
          <AorBSwitch a='jupy' b='classic' handleChange={handleEditorChange} isChecked={isEditorClassic}/>
          <div className={classes.grow}/>
          <FirebaseContext.Consumer>
            {firebase => <Login firebase={firebase}/>}

          </FirebaseContext.Consumer>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const AccountAvatarAndMenu = ({handleSignOut, userPhotoURL}) => {
  const classes = useStyles();
  const [anchorElement, setAnchorElement] = useState(null);
  const isMenuOpen = Boolean(anchorElement);

  const handleMenuOpen = e => setAnchorElement(e.currentTarget);
  const handleMenuClose = () => setAnchorElement(null);
  // userPhotoURL = false;
  return (
    <div>
      { userPhotoURL
      ? <Avatar onClick={handleMenuOpen} className={classes.small} src={userPhotoURL}/>
      : <IconButton
          color='inherit'
          onClick={handleMenuOpen}
        >
          <AccountCircle/>
        </IconButton>
      }
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
        <MenuItem onClick={handleMenuClose} onClick={handleSignOut}>Sign Out</MenuItem>
        {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
      </Menu>
    </div>
  )
}

const Login = ({firebase}) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    console.log('user effect')
    console.log(authUser)
    firebase.auth.onAuthStateChanged(user => user ? setAuthUser(user) : setAuthUser(null));
  })

  const handleSignOut = () => {
    firebase.doSignOut();
  }

  return (
    authUser
      ? <AccountAvatarAndMenu handleSignOut={handleSignOut} userPhotoURL={authUser.photoURL}/>
      : <Button color='inherit' onClick={firebase.doSignInWithGoogle}>Login</Button>
  )
}

export default Header;
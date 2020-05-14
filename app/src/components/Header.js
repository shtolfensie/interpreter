import React, { useState, useEffect } from 'react';
import { FirebaseContext } from './Firebase';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Avatar } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Menu, MenuItem, IconButton } from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExamplesMenu from './ExamplesMenu';
import AorBSwitch from './AorBSwitch.js';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 3,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    cursor: 'pointer'
  }
}));

const Header = ({handleInterpreterChange, isInterpreterJSlike, setExampleFile}) => {
  const classes = useStyles();
  const [user, setUser] = useState(false);
  

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <AorBSwitch a='Schemy' b='JS-Like' handleChange={handleInterpreterChange} isChecked={isInterpreterJSlike}/>
          <div style={{flexGrow: 0.1}}/>
          <ExamplesMenu isInterpreterJSlike={isInterpreterJSlike} setExampleFile={setExampleFile}/>
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
      ? <Avatar style={{float: 'right'}} onClick={handleMenuOpen} className={classes.small} src={userPhotoURL}/>
      : <IconButton
          style={{float: 'right'}}
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
      ? <div style={{minWidth: 64}}><AccountAvatarAndMenu handleSignOut={handleSignOut} userPhotoURL={authUser.photoURL}/></div>
      : <Button color='inherit' onClick={firebase.doSignInWithGoogle}>Login</Button>
  )
}

export default Header;
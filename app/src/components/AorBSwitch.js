import React from 'react';
import { Typography, Grid, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { purple, blue } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    marginRight: theme.spacing(3),
  },
  switchRoot: {
    padding: 0
  },
  switchBase: {
    color: blue[500],
    '&$checked': {
      color: purple[500],
    },
    '&$checked + $track': {
      backgroundColor: purple[500],
    },
  },
  checked: {},
  track: {
    backgroundColor: blue[500],
  }
}))

const AorBSwitch = ({a, b, isChecked, handleChange}) => {
  const classes = useStyles();
  return (
    <Typography component="div" className={classes.root}>
      <Grid component="label" container alignItems="center" spacing={1}>
        <Grid item>{a}</Grid>
        <Grid item>
          <Switch
            classes={{
              root: classes.switchRoot,
              switchBase: classes.switchBase,
              track: classes.track,
              checked: classes.checked
            }}
            checked={isChecked}
            onChange={handleChange}
            value="isChecked"
          />
        </Grid>
        <Grid item>{b}</Grid>
      </Grid>
    </Typography>
  )
}

export default AorBSwitch;

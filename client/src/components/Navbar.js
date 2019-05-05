import React from 'react';
import { Link } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

require('typeface-roboto');

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  appBar: {
    position: 'relative',
  },
  toolbarTitle: {
    flex: 1,
  }
});

const NavBar = (props) => {
  const { classes } = props;

  return(
    <div>
    <AppBar position="static" color="default" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
          Example Forms
        </Typography>
        <Button href="/">Home</Button>
        <Button component={Link} to="/checkout">Checkout</Button>
        <Button component={Link} to="/post">POST</Button>
        <Button component={Link} to="/put">PUT</Button>
        <Button component={Link} to="/delete">DELETE</Button>
        <Button color="primary" variant="outlined">
          Login
        </Button>
      </Toolbar>
    </AppBar>
    </div>
  )
}
export default withStyles(styles)(NavBar);




import React from 'react';
import { Link } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import NavBarStyles from '../styles/NavBar.js'
import { useAdmin } from '../utils/user-role-hooks.js';

const NavBar = (props) => {
  const { classes } = props;

  // GET information on whether current user is an admin
  const { admin } = useAdmin({});

  if (admin) {
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
          <Button component={Link} to="/companiesadmin">Admin View</Button>
          <Button component={Link} to="/events">EVENTS</Button>
          <Button component={Link} to="/registerbasic">PROFILE</Button>
          <Button component={Link} to="/registerEWI">PROFILE(EWI)</Button>
          <Button component={Link} to="/users/admin">PROFILE SUMMARY(ADMIN)</Button>
          <Button component={Link} to="/login" color="primary" variant="outlined">Login</Button>
        </Toolbar>
      </AppBar>
      </div>
    )
  } else {
    return (
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
          <Button component={Link} to="/companies">Companies</Button>
          <Button component={Link} to="/events">EVENTS</Button>
          <Button component={Link} to="/registerbasic">PROFILE</Button>
          <Button component={Link} to="/registerEWI">PROFILE(EWI)</Button>
          <Button component={Link} to="/login" color="primary" variant="outlined">Login</Button>
        </Toolbar>
      </AppBar>
      </div>
    )
  }
}
export default withStyles(NavBarStyles)(NavBar);

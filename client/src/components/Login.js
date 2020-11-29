import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import ExamplePutFormStyles from '../styles/ExamplePutForm.js';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      email:'',
      password:''
    }
  }
  render() {
    const { classes } = this.props;
    return (
        <main className={classes.main}>
        <Paper className={classes.paper}>
           <TextField
             className={classes.textField}
             label="Email"
             floatingLabelText="Email"
             onChange = {this.handleChange('email')}
             />
             <TextField
               className={classes.textField}
               type="password"
               label="Password"
               floatingLabelText="Password"
               onChange = {this.handleChange('password')}
               />
             <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
               onClick={(event) => this.handleClick(event)}
              >
              Submit
              </Button>
        </Paper>
      </main>
    );
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClick(event) {
    let body = {
      email: this.state.email,
      password: this.state.password
    }
    axios.post('/users/login', body)
      .then(result => {
        window.location.href = '/registerbasic';
      })
      .catch(err => {
        // TODO: use user-friendly error message
        console.log(err.response.data)
        this.setState({
          errorMessage: err.response.data.message,
        })
      });
  }
}
const style = {
 margin: 15,
};
export default withStyles(ExamplePutFormStyles)(Login);
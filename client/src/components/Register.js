import React, { Component } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

import ExamplePostFormStyles from '../styles/ExamplePostForm.js';
import ExampleGet from '../components/ExampleGet.js';


const GOOGLE_BUTTON_ID = 'google-sign-in-button';

let first_name = '';
let last_name = '';
let email = '';


class Register extends Component {

  handleSuccess(googleUser) {
      //console.log();
      console.log("hello");
      const profile = googleUser.getBasicProfile();
      console.log("Email: " + profile.getEmail());
      console.log("Name: " + profile.getName());
      
      let first_and_last = profile.getName();
      email = profile.getEmail();
      let namearr = first_and_last.split(" ");
      first_name = namearr[0];
      last_name = namearr[1];
      //if this email can be found then redirect to events page
      //redirect to register page ok?
      //axios.put('/majors/' + this.state.major_id, diffBody)
  }

  componentDidMount() {
    window.gapi.load('auth2', function() {
        window.auth2 = window.gapi.auth2.init({
          client_id: '*****',
          // Scopes to request in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });
    });
    window.gapi.signin2.render(
      GOOGLE_BUTTON_ID,
      {
        scope: 'email',
        width: 400,
        height: 50,
        longtitle: true,
        theme: 'dark',
        onsuccess: this.handleSuccess,
        onfailure: this.handleFailure
      },
    );
    //window.auth2.grantOfflineAccess().then(window.signInCallback);
    /*
    
    */
  }
  
  constructor() {
    super();

    // Initiate state
    this.state = { 
      phone_number: '',
      ucla_id: null,
      check1: true,
      check2: false,
      check3: false,
      errorMessage: ''
    };
  }




  addUser = () => {
    if (!this.state.phone_number) {
      // Do not add major if no name specified
      console.log('ERROR: fill out phone number field.');
      return;
    }

    let body = {
      first_name: first_name,
      last_name: last_name,
      password: "",
      email: email,
      phone: this.state.phone_number,
      university_id: this.state.ucla_id ? this.state.ucla_id : null,
      is_admin: false
    };

    // Make POST request to add major
    axios.post('/users/register', body)
      .then(result => {
        // Update displayed major names
        //this.users.getUsers();

        
        // Clear form values 
        this.setState({
          phone_number: '',
          ucla_id: null,
          check1: true,
          check2: false,
          check3: false,
          errorMessage: ''
        });
      })
      .catch(err => {
        // TODO: use user-friendly error message
        console.log(err.response.data)
        this.setState({
          errorMessage: err.response.data.message,
        })
      })
  }

  handleSubmit = (event) => {
    this.addUser();
    // Prevent site refresh after submission
    event.preventDefault();
  }

  handleChange = phone_number => event => {
    this.setState({
      [phone_number]: event.target.value,
    });
  };

  handleCheckChange = phone_number => event => {
    this.setState({ [phone_number]: event.target.checked });
  };

  render() {
    const { classes } = this.props;
    const { check1, check2, check3 } = this.state;
    const error = [check1, check2, check3].filter(v => v).length !== 2;

    return (
      
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Add User
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <div id={GOOGLE_BUTTON_ID}/>
            <TextField
              required fullWidth
              id='phone_number'
              label='Phone Number'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.phone_number || ''}
              onChange={this.handleChange('phone_number')}
              margin='normal'
            />
            <TextField 
              required fullWidth
              id='ucla_id'
              label='UCLA ID'
              className={classes.textField}
              placeholder='e.g. 605105555'
              value={this.state.ucla_id || ''}
              onChange={this.handleChange('ucla_id')}
              margin='normal'
            />
            <FormControl required error={error} component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Pick Two Options</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={check1} 
                      onChange={this.handleCheckChange('check1')} 
                      value="check1" 
                    />
                  }
                  label="Check 1"
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={check2} 
                      onChange={this.handleCheckChange('check2')} 
                      value="check2" 
                    />
                  }
                  label="Check 2"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={check3}
                      onChange={this.handleCheckChange('check3')}
                      value="check3"
                    />
                  }
                  label="Check 3"
                />
              </FormGroup>
            </FormControl>
            <FormHelperText error className={classes.formHelperText}>
              {this.state.errorMessage}
            </FormHelperText>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Add Major
            </Button>
          </form>
        </Paper>
        <ExampleGet onRef={ref => (this.users = ref)}/>
      </main>
    );
  }
}

export default withStyles(ExamplePostFormStyles)(Register);

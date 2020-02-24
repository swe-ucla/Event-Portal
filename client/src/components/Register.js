
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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


import ExamplePostFormStyles from '../styles/ExamplePostForm.js';
import ExampleGet from '../components/ExampleGet.js';


const GOOGLE_BUTTON_ID = 'google-sign-in-button';

let first_name = '';
let last_name = '';
let email = '';


class Register extends Component {
  
  componentDidMount ()
  {
    this.getMajors();
    this.getOccupations();
  }

  constructor() {
    super();

    // Initiate state
    this.state = { 
      year_mids: [],
      occupation_mids: [],
      phone_number: '',
      major_name: '',
      major_id: '',
      ucla_id: null,
      check1: true,
      check2: false,
      check3: false,
      errorMessage: '',
      swe_id: '',
      email: ''
    };
  }

  getMajors = () => {
    axios.get('/majors')
      .then(result => {
        let mids = result.data.map(function(major) { return major.name });
        this.setState({ occupation_mids: mids });
      })
      .catch(err => console.log(err));
  }

  getOccupations = () => {
    axios.get('/occupations')
      .then(result => {
        let mids = result.data.map(function(occupation) { return occupation.name });
        this.setState({ year_mids : mids });
      })
      .catch(err => console.log(err));
  }


  addUser = () => {
    if (!this.state.phone_number) {
      // Do not add major if no name specified
      console.log('ERROR: fill out phone number field.');
      return;
    }

    console.log(this.state.mids)

    this.state.mids.forEach(function(mid){ 
      if (mid.name == this.state.major_name){
        this.state.major_id = mid.major_id
      }
    })


    let body = {
      first_name: first_name,
      last_name: last_name,
      password: "",
      email: email,
      phone: this.state.phone_number,
      university_id: this.state.ucla_id ? this.state.ucla_id : null,
      is_admin: false,
      major_id: this.state.major_id
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

/*
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    if (name === 'major_id') {
      this.getMajorByID(event.target.value);
    }
  };
  */

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  
  render() {
    const { classes } = this.props;
    const { check1, check2, check3 } = this.state;
    const error = [check1, check2, check3].filter(v => v).length !== 2;
    var occupation_mids = this.state.occupation_mids.map(mid => {
      return <MenuItem key={mid} value={mid}>{mid}</MenuItem>
    })
    var year_mids = this.state.year_mids.map(mid => {
      return <MenuItem key={mid} value={mid}>{mid}</MenuItem>
    })
   
    

    return (
      
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <div id={GOOGLE_BUTTON_ID}/>
            <TextField
              fullWidth
              id='first_name'
              label='First Name'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.first_name || ''}
              onChange={this.handleChange('first_name')}
              margin='normal'
            />
            <TextField
              required fullWidth
              id='last_name'
              label='Last Name'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.last_name || ''}
              onChange={this.handleChange('last_name')}
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
            <FormLabel component="legend">Enter your major</FormLabel>
            <Select
              required fullWidth
              className={classes.select}
              value={this.state.major_name || ''}
              onChange={this.handleChange('major_name')}
              inputProps={{
                    name: 'Major ID',
                    id: 'major_id',
              }}
              margin='normal'
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {occupation_mids}
            </Select>
            <FormLabel component="legend">Enter your year</FormLabel>
            <Select
              required fullWidth
              className={classes.select}
              value={this.state.occupation_name || ''}
              onChange={this.handleChange('occupation_name')}
              inputProps={{
                    name: 'Occupation ID',
                    id: 'occupation_id',
              }}
              margin='normal'
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {year_mids}
            </Select>
            <FormHelperText error className={classes.formHelperText}>
              {this.state.errorMessage}
            </FormHelperText>
            <TextField
              fullWidth
              id='email'
              label='Email'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.email || ''}
              onChange={this.handleChange('email')}
              margin='normal'
            />
            <TextField
              fullWidth
              id='swe_id'
              label='SWE ID'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.swe_id || ''}
              onChange={this.handleChange('swe_id')}
              margin='normal'
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create Your Account
            </Button>
          </form>
        </Paper>
        <ExampleGet onRef={ref => (this.users = ref)}/>
      </main>
    );
  }
}

export default withStyles(ExamplePostFormStyles)(Register);



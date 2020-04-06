
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
      occupation_ids: [],
      occupation_names: [],
      phone_number: '',
      major_name: '',
      major_id: '',
      ucla_id: null,
      check1: true,
      check2: false,
      check3: false,
      errorMessage: '',
      swe_id: '',
      email: '',

      //user values
      occupation_id: null, //occupation name is really year
      occupation_name: null,
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
        let onames = result.data.map(function(occupation) { return occupation.name });
        this.setState({ occupation_names : onames });
        let oids = result.data.map(function(occupation) { return occupation.id });
        this.setState({ occupation_ids : oids });
      })
      .catch(err => console.log(err));
  }

  handleCheckChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  addUser = () => {
    if (!this.state.phone_number) {
      // Do not add major if no name specified
      console.log('ERROR: fill out phone number field.');
      //return;
    }



    if (this.state.occupation_name) {
      let index = this.state.occupation_names.indexOf(this.state.occupation_name)
      this.state.occupation_id = this.state.occupation_ids[index]
      console.log(this.state.occupation_id)
    }
    
    let body = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      password: "",
      email: this.state.email,
      phone: this.state.phone_number ? this.state.phone_number : null,
      university_id: this.state.ucla_id,
      is_admin: false,
      major_id: this.state.major_id,
      swe_id: this.state.swe_id ? this.state.swe_id : null,
      gpa: this.state.gpa ? this.state.gpa : null,
      occupation_id: this.state.occupation_id
    };

    // Make POST request to add major
    axios.post('/users/register', body)
      .then(result => {

        
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

  
  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
  };

  
  render() {
    const { classes } = this.props;
    const { check1, check2, check3 } = this.state;

    var occupation_names = this.state.occupation_names.map(name => {
      return <MenuItem key={name} value={name}>{name}</MenuItem>
    })


    return (
      
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Your Profile
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <div id={GOOGLE_BUTTON_ID}/>
            <TextField
              required fullWidth
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
              {occupation_names}
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
              id='phone_number'
              label='Phone Number'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.phone_number || ''}
              onChange={this.handleChange('phone_number')}
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
            <TextField
              fullWidth
              id='swe_id'
              label='GPA'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.gpa || ''}
              onChange={this.handleChange('gpa')}
              margin='normal'
            />
            <Typography component="h2" variant="h5">
              Evening with Industry
            </Typography>
             <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Select your major(s)</FormLabel>
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



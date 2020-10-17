import React, { Component } from 'react';
import axios from 'axios';
import diff from 'object-diff';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import ExamplePutFormStyles from '../styles/ExamplePutForm.js';
import ExampleGet from '../components/ExampleGet.js';

class ExamplePutForm extends Component {
  constructor() {
    super();

    // Initiate state
    this.state = { 
      mids: [],
      user_id: 1,
      major_id: null,
      name: '',
      
      initial_name: '',

      ucla_id: null,
      initial_ucla_id: null,

      initial_first_name: null,
      first_name: null,

      initial_last_name: null,
      last_name: null,

      initial_phone_number: null,
      phone_number: null,

      errorMessage: ''
    };
  }

  // Called when component has been initialized
  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    var options = {
      
    }
    axios.get('/users/'+ this.state.user_id + '/id', options)
      .then(result => {
        let user_university_id = result.data.map(function(user) {return user.university_id })
        this.setState(
        {
          ucla_id : user_university_id,
          initial_ucla_id : user_university_id

        })
        let user_first_name = result.data.map(function(user) {return user.first_name })
        this.setState(
        {
          first_name : user_first_name,
          initial_first_name : user_first_name
          
        })
        let user_last_name = result.data.map(function(user) {return user.last_name })
        this.setState(
        {
          last_name : user_last_name,
          initial_last_name : user_last_name
          
        })
        let user_phone_number = result.data.map(function(user) {return user.phone })
        this.setState(
        {
          phone_number : user_phone_number,
          initial_phone_number : user_phone_number
          
        })
      })
      .catch(err => console.log(err));
  }

  getMajorByID = (mid) => {
    if (!mid) {
      this.setState({
        name: '',
        ucla_id: null,
        initial_name: '',
        initial_ucla_id: null,
      });
      console.log('ERROR: fill out Major ID field.');
      return;
    }

    axios.get('/majors/' + mid + '/id')
      .then(result => {
        this.setState({
          name: result.data.name,
          ucla_id: result.data.ucla_id,
          initial_name: result.data.name,
          initial_ucla_id: result.data.ucla_id,
          errorMessage: '',
        });
      })
      .catch(err => console.log(err));
  }

  // Update major of specified ID
  updateMajor = () => {
  
    let initialBody = {
      //name: this.state.initial_name,
      university_id: this.state.initial_ucla_id,
      first_name: this.state.initial_first_name,
      last_name: this.state.initial_last_name,
      phone: this.state.initial_phone_number
    }
    let newBody = {
      university_id: this.state.ucla_id ? this.state.ucla_id : null,
      first_name: this.state.first_name ? this.state.first_name : null,
      last_name: this.state.last_name ? this.state.last_name : null,
      phone: this.state.phone_number ? this.state.phone_number : null
    };

    const diffBody = diff(initialBody, newBody);
    console.log(diffBody)

    if (!Object.keys(diffBody).length) {
      console.log('ERROR: no values to update.');
      this.setState({
        errorMessage: 'ERROR: no values to update.',
      })
      return;
    }

    // Make PUT request to update major
    axios.put('/users/' + this.state.user_id, diffBody)
      .then(result => {
        // Update displayed major names
        this.getUsers();
      })
      .catch(err => {
        // TODO: use user-friendly error message
        console.log(err.response.data)
        this.setState({
          errorMessage: err.response.data.message,
        })
      });
  }

  // On submit, update major in database
  handleSubmit = (event) => {
    this.updateMajor();
    // Prevent site refresh after submission
    event.preventDefault();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    if (name === 'major_id') {
      this.getMajorByID(event.target.value);
    }
  };

  render() {
    const { classes } = this.props;
    var mids = this.state.mids.map(mid => {
      return <MenuItem key={mid} value={mid}>{mid}</MenuItem>
    })

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Edit Profile
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>


            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='ucla_id'
                  label='UCLA ID'
                  className={classes.textField}
                  value={this.state.ucla_id || ''}
                  onChange={this.handleChange('ucla_id')}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='first_name'
                  label='First Name'
                  className={classes.textField}
                  value={this.state.first_name || ''}
                  onChange={this.handleChange('first_name')}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='last_name'
                  label='Last Name'
                  className={classes.textField}
                  value={this.state.last_name || ''}
                  onChange={this.handleChange('last_name')}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id='phone_number'
                  label='Phone Number'
                  className={classes.textField}
                  value={this.state.phone_number || ''}
                  onChange={this.handleChange('phone_number')}
                  margin='normal'
                />
              </Grid>

            </Grid>
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
              Update Profile
            </Button>
          </form>
        </Paper>
        
      </main>
    );
  }
}

export default withStyles(ExamplePutFormStyles)(ExamplePutForm);
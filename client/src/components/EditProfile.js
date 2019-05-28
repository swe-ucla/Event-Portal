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
      ucla_id: null,
      initial_name: '',
      initial_ucla_id: null,
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
      })
      .catch(err => console.log(err));
    /*
    axios.get('/majors/ids')
      .then(result => {
        let mids = result.data.map(function(major) { return major.id });
        this.setState({ mids: mids });
      })
      .catch(err => console.log(err));
      */
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
      university_id: this.state.initial_ucla_id
    }
    let newBody = {
      //name: this.state.name ? this.state.name : null,
      university_id: this.state.ucla_id ? this.state.ucla_id : null
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
        this.majors.getMajors();
      })
      .catch(err => {
        // TODO: use user-friendly error message
        console.log(err.response.data)
        this.setState({
          errorMessage: err.response.data.message,
        })
      });

      this.getUsers();
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
            Update Major
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
              Update Major
            </Button>
          </form>
        </Paper>
        <ExampleGet onRef={ref => (this.majors = ref)}/>
      </main>
    );
  }
}

export default withStyles(ExamplePutFormStyles)(ExamplePutForm);
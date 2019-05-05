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

import logo from '../logo.svg';
import appStyles from '../styles/App.js';
import '../css/App.css';

require('typeface-roboto');

class ExamplePostForm extends Component {
  constructor() {
    super();

    // Initiate state
    this.state = { 
      majors: [],
      name: '',
      ucla_id: null,
      check1: true,
      check2: false,
      check3: false,
    };
  }

  // Called when component has been initialized
  componentDidMount() {
    this.getMajors();
  }

  // Call GET function for major names
  getMajors = () => {
    axios.get('/majors')
      .then(result => {
        // console.log(result.data);
        let majors = result.data.map(function(major){ return { id: major.id, name: major.name, ucla_id: major.ucla_id}});
        // console.log(majors);
        this.setState({ 
          majors: majors,
        });
      })
      .catch(err => console.log(err));
  }

  addMajor = () => {
    if (this.state.name !== '') {
      let body = {
        name: this.state.name,
        ucla_id: this.state.ucla_id
      };
      // Make POST request to update major
      axios.post('/majors', body)
        .then(result => {
          // Update displayed major names
          this.getMajors();
          // TODO: Clear form values/body list
          this.setState({
            name: '',
            ucla_id: null,
            check1: true,
            check2: false,
            check3: false
          });
        })
        .catch(err => console.log(err));
    } else {
      // Do not update major if no field to update
      // TODO: should print error on form view
      console.log('NO MAJOR TO ADD');
    }
  }

  handlePostSubmit = (event) => {
    this.addMajor();
    // Prevent site refresh after submission
    event.preventDefault();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleCheckChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;
    const { check1, check2, check3 } = this.state;
    const error = [check1, check2, check3].filter(v => v).length !== 2;

    var names = this.state.majors.map(major => {
      return <p key={major.id}>{major.id}, {major.name}, {major.ucla_id}</p>
    });

    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <Typography variant="h6" gutterBottom>
          Add Major
        </Typography>
        <form className={classes.container} onSubmit={this.handlePostSubmit}>
          {/* TODO: required fields, form validation*/}
          <TextField
            required
            id='major_name'
            label='Major Name'
            className={classes.textField}
            placeholder='Add Major Name'
            value={this.state.name || ''}
            onChange={this.handleChange('name')}
            margin='normal'
          />
          <TextField
            id='ucla_id'
            label='UCLA ID'
            className={classes.textField}
            placeholder='Add UCLA ID'
            value={this.state.ucla_id || ''}
            onChange={this.handleChange('ucla_id')}
            margin='normal'
          />
          <br></br>
          <FormControl required error={error} component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Pick two</FormLabel>
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
            <FormHelperText>You can display an error</FormHelperText>
          </FormControl>
          <br></br>
          <Button type='submit' variant='contained' className={classes.button}>
            POST CHEESE PLS
          </Button>
        </form>
        <h3>List of Majors</h3>
        {names}
      </div>
    );
  }
}

export default withStyles(appStyles)(ExamplePostForm);

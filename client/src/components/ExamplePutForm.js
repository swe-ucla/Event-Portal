import React, { Component } from 'react';
import axios from 'axios';
import diff from 'object-diff';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import logo from '../logo.svg';
import appStyles from '../styles/App.js';
import '../css/App.css';

require('typeface-roboto');

class ExamplePutForm extends Component {
  constructor() {
    super();

    // Initiate state
    this.state = { 
      majors: [],
      major_id: null,
      name: '',
      ucla_id: null,
      initial_name: '',
      initial_ucla_id: null
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
          major_id: majors[0].id,
          name: majors[0].name,
          ucla_id: majors[0].ucla_id,
          initial_name: majors[0].name,
          initial_ucla_id: majors[0].ucla_id
        });
      })
      .catch(err => console.log(err));
  }

  // Update major of specified ID
  updateMajor = () => {
    console.log(this.state);
    if (this.state.major_id !== null && this.state.major_id !== '') {
      if (this.state.name !== '') {
        let initialBody = {
          name: this.state.initial_name,
          ucla_id: this.state.initial_ucla_id
        }
        let newBody = {
          name: this.state.name,
          ucla_id: this.state.ucla_id ? this.state.ucla_id : null
        };
        const diffBody = diff(initialBody, newBody);
        if (Object.keys(diffBody).length !== 0) {
          // Make PUT request to update major
          axios.put('/majors/' + this.state.major_id, diffBody)
            .then(result => {
              // Update displayed major names
              this.getMajors();
            })
            .catch(err => console.log(err));
        } else {
          console.log('NO BODY VALUES TO UPDATE');
        }
      } else {
        // Do not update major if no field to update
        // TODO: should print error on form view
        console.log('NO BODY NAME TO UPDATE');
      }
    } else {
      console.log('NO MAJOR ID SPECIFIED');
    }
  }

  // On submit, update major in database
  handlePutSubmit = (event) => {
    this.updateMajor();
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
          Update Major
        </Typography>
        <form className={classes.container} onSubmit={this.handlePutSubmit}>
          {/* TODO: populate form values with GET request and only update if changed */}
          {/* TODO: make major_id a dropdown that autopopulates name/id */}
          <TextField
            id='major_id'
            label='Major ID'
            className={classes.textField}
            placeholder='Add Major ID'
            value={this.state.major_id || ''}
            onChange={this.handleChange('major_id')}
            margin='normal'
          />
          <TextField
            id='put_major_name'
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
          <Button type='submit' variant='contained' className={classes.button}>
            PUT CHEESE PLS
          </Button>
        </form>
        <h3>List of Majors</h3>
        {names}
      </div>
    );
  }
}

export default withStyles(appStyles)(ExamplePutForm);

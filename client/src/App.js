import React, { Component } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import logo from './logo.svg';
import appStyles from './styles/App.js';
import './css/App.css';

require('typeface-roboto');

class App extends Component {
  constructor() {
    super();

    // Initiate state
    this.state = { 
      majors: [], 
      params: {}
    };
  }

  // Called when component has been initialized
  componentDidMount() {
    this.getMajorNames();
  }

  // Call GET function for major names
  getMajorNames = () => {
    axios.get('/majors/names')
      .then(result => {
        console.log(result.data);
        this.setState({ majors: result.data });
      })
      .catch(err => console.log(err));
  }

  // Update major of specified ID
  updateMajor = () => {
    console.log(this.state.params);
    if (Object.keys(this.state.params).length) {
      // Set options from form params
      const options = {
        params: this.state.params
      };

      // Make PUT request to update major
      axios.put('/majors/1', {}, options)
        .then(result => {
          // Update displayed major names
          this.getMajorNames();
          // Clear form values/params list
          this.setState({ params: {} });
        })
        .catch(err => console.log(err));
    } else {
      // Do not update major if no field to update
      // TODO: should print error on form view
      console.log('NO PARAMS TO UPDATE');
    }
  }

  // On change, update state with name value
  // TODO: just get the value when submitted
  handleChange = name => event => {
    this.setState({ 
      params: {
        name: event.target.value 
      }
    });
  };

  // On submit, update major in database
  handleSubmit = (event) => {
    this.updateMajor();
    // Prevent site refresh after submission
    event.preventDefault();
  }

  render() {
    const { classes } = this.props;

    var names = this.state.majors.map(major => {
      return <p key={major.name}>{major.name}</p>
    });

    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <form className={classes.container} onSubmit={this.handleSubmit}>
          {/* TODO: populate form values with GET request and only update if changed */}
          <TextField
            id='major_name'
            label='Major Name'
            className={classes.textField}
            placeholder='Add Major Name'
            value={this.state.params.name || ''}
            onChange={this.handleChange('name')}
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

export default withStyles(appStyles)(App);

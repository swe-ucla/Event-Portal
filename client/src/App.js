import React, { Component } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

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
      body: {},
      delete_id: null,
      check1: true,
      check2: false,
      check3: false
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
        this.setState({ 
          majors: result.data,
          body: {
            name: result.data[0].name
            // ucla_id: result.data[0].ucla_id
          }
        });
      })
      .catch(err => console.log(err));
  }

  addMajor = () => {
    console.log(this.state.body);
    if (Object.keys(this.state.body).length) {
      // Make PUT request to update major
      axios.post('/majors', this.state.body)
        .then(result => {
          // Update displayed major names
          this.getMajorNames();
          // Clear form values/body list
          this.setState({ body: {} });
          console.log(this.state);
        })
        .catch(err => console.log(err));
    } else {
      // Do not update major if no field to update
      // TODO: should print error on form view
      console.log('NO BODY VALUES TO ADD');
    }
  }

  // Update major of specified ID
  updateMajor = () => {
    console.log(this.state.body);
    if (Object.keys(this.state.body).length) {
      // Make PUT request to update major
      axios.put('/majors/1', this.state.body)
        .then(result => {
          // Update displayed major names
          this.getMajorNames();
          // Clear form values/body list
          this.setState({ body: {} });
        })
        .catch(err => console.log(err));
    } else {
      // Do not update major if no field to update
      // TODO: should print error on form view
      console.log('NO BODY VALUES TO UPDATE');
    }
  }

  deleteMajor = () => {
    console.log(this.state.delete_id);
    if (this.state.delete_id) {
      // Make PUT request to update major
      axios.delete('/majors/' + this.state.delete_id)
        .then(result => {
          // Update displayed major names
          this.getMajorNames();
          // Clear form values/body list
          this.setState({ delete_id: null });
        })
        .catch(err => console.log(err));
    } else {
      // TODO: should print error on form view
      console.log('NO MAJORS TO DELETE');
    }
  }

  handlePostNameChange = name => event => {
    this.setState({ 
      body: {
        name: event.target.value,
        ucla_id: this.state.body.ucla_id 
      }
    });
  };

  handlePostIDChange = ucla_id => event => {
    this.setState({ 
      body: {
        name: this.state.body.name,
        ucla_id: event.target.value 
      }
    });
  };

  handlePostSubmit = (event) => {
    this.addMajor();
    // Prevent site refresh after submission
    event.preventDefault();
  }

  // On change, update state with name value
  // TODO: just get the value when submitted
  handleChange = name => event => {
    this.setState({ 
      body: {
        name: event.target.value 
      }
    });
  };

  // On submit, update major in database
  handlePutSubmit = (event) => {
    this.updateMajor();
    // Prevent site refresh after submission
    event.preventDefault();
  }

  handleDeleteChange = delete_id => event => {
    this.setState({ 
      delete_id: event.target.value
    });
  };

  handleDeleteSubmit = (event) => {
    this.deleteMajor();
    // Prevent site refresh after submission
    event.preventDefault();
  }

  handleCheckChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;
    const { check1, check2, check3 } = this.state;
    const error = [check1, check2, check3].filter(v => v).length !== 2;

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
        <form className={classes.container} onSubmit={this.handlePostSubmit}>
          {/* TODO: populate form values with GET request and only update if changed */}
          {/* TODO: required fields, form validation*/}
          <TextField
            id='major_name'
            label='Major Name'
            className={classes.textField}
            placeholder='Add Major Name'
            value={this.state.body.name || ''}
            onChange={this.handlePostNameChange('name')}
            margin='normal'
          />
          <TextField
            id='ucla_id'
            label='UCLA ID'
            className={classes.textField}
            placeholder='Add UCLA ID'
            value={this.state.body.ucla_id || ''}
            onChange={this.handlePostIDChange('ucla_id')}
            margin='normal'
          />
          <FormControl required error={error} component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Pick two</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={check1} onChange={this.handleCheckChange('check1')} value="check1" />
                }
                label="Check 1"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={check2} onChange={this.handleCheckChange('check2')} value="check2" />
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
        <form className={classes.container} onSubmit={this.handlePutSubmit}>
          {/* TODO: populate form values with GET request and only update if changed */}
          <TextField
            id='major_name'
            label='Major Name'
            className={classes.textField}
            placeholder='Add Major Name'
            value={this.state.body.name || ''}
            onChange={this.handleChange('name')}
            margin='normal'
          />
          <br></br>
          <Button type='submit' variant='contained' className={classes.button}>
            PUT CHEESE PLS
          </Button>
        </form>
        <form className={classes.container} onSubmit={this.handleDeleteSubmit}>
          <TextField
            id='major_id'
            label='Major ID'
            className={classes.textField}
            placeholder='ID of Major to Delete'
            value={this.state.delete_id || ''}
            onChange={this.handleDeleteChange('delete_id')}
            margin='normal'
          />
          <br></br>
          <Button type='submit' variant='contained' className={classes.button}>
            DELETE CHEESE PLS
          </Button>
        </form>
        <h3>List of Majors</h3>
        {names}
      </div>
    );
  }
}

export default withStyles(appStyles)(App);

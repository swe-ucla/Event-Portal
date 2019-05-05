import React, { Component } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import logo from '../logo.svg';
import appStyles from '../styles/App.js';
import '../css/App.css';

require('typeface-roboto');

class ExampleDeleteForm extends Component {
  constructor() {
    super();

    // Initiate state
    this.state = { 
      majors: [],
      delete_id: null
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
          put_name: majors[0].name,
          put_ucla_id: majors[0].ucla_id,
          initial_name: majors[0].name,
          initial_ucla_id: majors[0].ucla_id
        });
      })
      .catch(err => console.log(err));
  }

  deleteMajor = () => {
    if (this.state.delete_id) {
      // Make PUT request to update major
      axios.delete('/majors/' + this.state.delete_id)
        .then(result => {
          // Update displayed major names
          this.getMajors();
          // Clear form values/body list
          this.setState({ delete_id: null });
        })
        .catch(err => console.log(err));
    } else {
      // TODO: should print error on form view
      console.log('NO MAJORS TO DELETE');
    }
  }

  handleDeleteSubmit = (event) => {
    this.deleteMajor();
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
          Delete Major
        </Typography>
        <form className={classes.container} onSubmit={this.handleDeleteSubmit}>
          <TextField
            id='major_id'
            label='Major ID'
            className={classes.textField}
            placeholder='ID of Major to Delete'
            value={this.state.delete_id || ''}
            onChange={this.handleChange('delete_id')}
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

export default withStyles(appStyles)(ExampleDeleteForm);

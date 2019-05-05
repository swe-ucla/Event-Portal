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

class ExamplePostForm extends Component {
  constructor() {
    super();

    // Initiate state
    this.state = { 
      name: '',
      ucla_id: null,
      check1: true,
      check2: false,
      check3: false,
      errorMessage: ''
    };
  }

  addMajor = () => {
    if (!this.state.name) {
      // Do not add major if no name specified
      console.log('ERROR: fill out Major Name field.');
      return;
    }

    let body = {
      name: this.state.name,
      ucla_id: this.state.ucla_id ? this.state.ucla_id : null
    };

    // Make POST request to add major
    axios.post('/majors', body)
      .then(result => {
        // Update displayed major names
        this.majors.getMajors();

        // Clear form values 
        this.setState({
          name: '',
          ucla_id: null,
          check1: true,
          check2: false,
          check3: false,
          errorMessage: '',
        });
      })
      .catch(err => {
        // TODO: use user-friendly error message
        console.log(err.response.data)
        this.setState({
          errorMessage: err.response.data.message,
        })
      });
  }

  handleSubmit = (event) => {
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

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Add Major
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <TextField
              required fullWidth
              id='major_name'
              label='Major Name'
              className={classes.textField}
              placeholder='e.g. Computer Science'
              value={this.state.name || ''}
              onChange={this.handleChange('name')}
              margin='normal'
            />
            <TextField fullWidth
              id='ucla_id'
              label='UCLA ID'
              className={classes.textField}
              placeholder='e.g. 42'
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
        <ExampleGet onRef={ref => (this.majors = ref)}/>
      </main>
    );
  }
}

export default withStyles(ExamplePostFormStyles)(ExamplePostForm);

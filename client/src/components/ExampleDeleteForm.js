import React, { Component } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import Paper from '@material-ui/core/Paper';

import ExampleDeleteFormStyles from '../styles/ExampleDeleteForm.js';
import ExampleGet from '../components/ExampleGet.js';

class ExampleDeleteForm extends Component {
  constructor() {
    super();

    // Initiate state
    this.state = { 
      mids: [],
      major_id: null,
      errorMessage: ''
    };
  }

  // Called when component has been initialized
  componentDidMount() {
    this.getMajorIDs();
  }

  getMajorIDs = () => {
    axios.get('/majors/ids')
      .then(result => {
        let mids = result.data.map(function(major) { return major.id });
        this.setState({ mids: mids });
      })
      .catch(err => console.log(err));
  }

  deleteMajor = () => {
    if (!this.state.major_id) {
      console.log('ERROR: fill out Major ID field.');
      this.setState({
        errorMessage: 'ERROR: fill out Major ID field.',
      })
      return;
    }

    // Make DELETE request to delete major
    axios.delete('/majors/' + this.state.major_id)
      .then(result => {
        // Update displayed major names
        this.majors.getMajors();
        this.getMajorIDs();

        // Clear form values/body list
        this.setState({ major_id: null, errorMessage: '' });
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
    var mids = this.state.mids.map(mid => {
      return <MenuItem key={mid} value={mid}>{mid}</MenuItem>
    })

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Delete Major
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <InputLabel required error={!this.state.major_id} htmlFor="major_id">Major ID</InputLabel>
            <Select
              fullWidth
              className={classes.select}
              value={this.state.major_id || ''}
              onChange={this.handleChange('major_id')}
              inputProps={{
                name: 'Major ID',
                id: 'major_id',
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {mids}
            </Select>
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
              Delete Major
            </Button>
          </form>
        </Paper>
        <ExampleGet onRef={ref => (this.majors = ref)}/>
      </main>
    );
  }
}

export default withStyles(ExampleDeleteFormStyles)(ExampleDeleteForm);

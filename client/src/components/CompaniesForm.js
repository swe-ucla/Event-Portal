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

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import ExamplePostFormStyles from '../styles/ExamplePostForm.js';
import ExampleGet from '../components/ExampleGet.js';

class CompaniesForm extends Component {
  constructor() {
    super();

    // Initiate state
    this.state = { 
      name: '',
      description: '',
      website: '',
      citizenship: '',
      errorMessage: '',
      majors: [],
      positions: [],
      allMajors: {},
      allPositions: {}
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    this.getAllMajors();
    this.getAllPositions();
  }

  addCompany = () => {
    if (!this.state.name) {
      // Do not add major if no name specified
      console.log('ERROR: fill out Company Name field.');
      return;
    }

    let body = {
      name: this.state.name,
      description: this.state.description,
      website: this.state.website,
      citizenship_requirement: this.state.citizenship ? 'Y' : 'N'
    };

    console.log(body)
    return;

    // Make POST request to add major
    axios.post('/companies', body)
      .then(result => {
        // Clear form values 
        this.setState({
          name: '',
          description: '',
          website: '',
          citizenship_requirement: '',
          errorMessage: ''
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

  getAllMajors = () => {
    var options = {
      params: {
        sort: 'id'
      }
    }
    axios.get('/majors', options)
      .then(result => {
        let majors = {};
        result.data.forEach(function(major) { 
          majors[major.name] = major.id;
        });

        this.setState({ 
          allMajors: majors,
        });
      })
      .catch(err => console.log(err));
  }

  getAllPositions = () => {
      var options = {
        params: {
          sort: 'id'
        }
      }
      axios.get('/positions', options)
        .then(result => {
          let positions = {};
          result.data.forEach(function(position) { 
            positions[position.role] = position.id;
          });


          this.setState({ 
            allPositions: positions,
          });
        })
        .catch(err => console.log(err));
    }

  handleSubmit = (event) => {
    this.addCompany();
    // Prevent site refresh after submission
    event.preventDefault();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleCheckChange = name => event => {
    let temp = this.state[name];
    temp.push(event.target.value);
    this.setState({[name]: temp});
  };

  render() {
    const { classes } = this.props;
    const { citizenship_requirement } = this.state;
    //const error = [check1, check2, check3].filter(v => v).length !== 2;
    const allMajors = this.state.allMajors;
    const allPositions = this.state.allPositions;
    
    const majorChecks = Object.getOwnPropertyNames(allMajors).map(elem => {
      return (<FormControlLabel
                  control={
                    <Checkbox 
                      onChange={this.handleCheckChange('majors')} 
                      value={elem}
                    />
                  }
                  label={elem}
                />)
    })

    const positionChecks = Object.getOwnPropertyNames(allPositions).map(elem => {
      return (<FormControlLabel
                  control={
                    <Checkbox 
                      onChange={this.handleCheckChange('positions')} 
                      value={elem}
                    />
                  }
                  label={elem}
                />)
    })


    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Add Company
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <TextField
              required fullWidth
              id='name'
              label='Company Name'
              className={classes.textField}
              placeholder=''
              value={this.state.name || ''}
              onChange={this.handleChange('name')}
              margin='normal'
            />
            <TextField
              fullWidth
              id='description'
              label='Company Description'
              className={classes.textField}
              placeholder=''
              value={this.state.description || ''}
              onChange={this.handleChange('description')}
              margin='normal'
            />
            <TextField fullWidth
              id='website'
              label='Company Website'
              className={classes.textField}
              placeholder='e.g. 42'
              value={this.state.website || ''}
              onChange={this.handleChange('website')}
              margin='normal'
            />
            <FormLabel>Majors Hiring:</FormLabel>
            <FormGroup>
              {majorChecks}
            </FormGroup>
            <FormLabel>Positions Hiring:</FormLabel>
            <FormGroup>
              {positionChecks}
            </FormGroup>
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
              Submit Company
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

export default withStyles(ExamplePostFormStyles)(CompaniesForm);

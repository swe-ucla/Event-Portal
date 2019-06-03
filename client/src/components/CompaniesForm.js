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
      majors: {},
      positions: {},
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
    //need error handling!

    if (!this.state.name) {
      // Do not add major if no name specified
      console.log('ERROR: fill out Company Name field.');
      return;
    }

    /*
    let allMajors = this.state.allMajors;
    let majors = this.state.majors.map(name => {
      return (allMajors[name])
    })

    let allPositions = this.state.allPositions;
    let positions = this.state.positions.map(role => {
      return (allPositions[role])
    })
    */

    let majorIDs = [];
    let majors = this.state.majors;
    let allMajors = this.state.allMajors;
    for (let property in majors) {
      if (majors.hasOwnProperty(property)) {
        if(majors[property] === true){
          majorIDs.push(allMajors[property]);
        }
      }
    }

    let positionIDs = [];
    let allPositions = this.state.allPositions;
    let positions = this.state.positions;
    for (let property in positions) {
      if (positions.hasOwnProperty(property)) {
        console.log(property)
        if(positions[property] === true){
          positionIDs.push(allPositions[property]);
        }
      }
    }
    console.log(majorIDs);

    let body = {
      name: this.state.name,
      description: this.state.description,
      website: this.state.website,
      citizenship_requirement: this.state.citizenship ? 'Y' : 'N', //change
      major_id: majorIDs,
      position_id: positionIDs
    };

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

  //ideally extract similar allMajors calls out and then format for specific
  //components

  getAllMajors = () => {
    var options = {
      params: {
        sort: 'id'
      }
    }
    axios.get('/majors', options)
      .then(result => {
        let majorsEnum = {};
        let majorsChecked = {};
        result.data.forEach(function(major) { 
          majorsEnum[major.name] = major.id;
          majorsChecked[major.name] = false;
        });

        this.setState({ 
          allMajors: majorsEnum,
          majors: majorsChecked
        });
        //console.log(this.state.allMajors)
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
          let positionsEnum = {};
          let positionsChecked = {};
          result.data.forEach(function(position) { 
            positionsEnum[position.role] = position.id;
            positionsChecked[position.role] = false;
          });


          this.setState({ 
            allPositions: positionsEnum,
            positions: positionsChecked
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

  //implement with check boxes
  handleCheckChange = name => event => {
    let value = event.target.value;
    let obj = this.state[name];
    obj[value] = event.target.checked;
    this.setState(obj);
    console.log(this.state[name]);
  };

  render() {
    const { classes } = this.props;
    const { citizenship_requirement } = this.state;
    //const error = [check1, check2, check3].filter(v => v).length !== 2;
    const allMajors = this.state.allMajors;
    const majors = this.state.majors;
    const allPositions = this.state.allPositions;
    const positions = this.state.positions;
    
    const majorChecks = Object.getOwnPropertyNames(majors).map(elem => {
      return (<FormControlLabel
                  control={
                    <Checkbox 
                      checked={majors[elem]}
                      onChange={this.handleCheckChange('majors')} 
                      value={elem}
                    />
                  }
                  label={elem}
                />)
    })

    const positionChecks = Object.getOwnPropertyNames(positions).map(elem => {
      return (<FormControlLabel
                  control={
                    <Checkbox 
                      checked={positions[elem]}
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
              placeholder='e.g. www.company.com'
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

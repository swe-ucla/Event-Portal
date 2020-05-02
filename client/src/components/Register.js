
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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


import ExamplePostFormStyles from '../styles/ExamplePostForm.js';
import ExampleGet from '../components/ExampleGet.js';


const GOOGLE_BUTTON_ID = 'google-sign-in-button';


class Register extends Component {
  
  componentDidMount ()
  {
    this.getMajors();
    this.getOccupations();
    this.getUserInfo(1);
  }

  constructor() {
    super();

    // Initiate state
    this.state = { 
      // form info
      occupation_ids: [],
      occupation_names: [],
      major_names: [],
      errorMessage: '',
      
      // user values
      user_id: null,
      email: '',
      first_name: '',
      last_name: '',
      ucla_id: null,
      occupation_id: null, //occupation name is really year
      occupation_name: null,
      swe_id: '',
      gpa: null,
      phone_number: '',
      major_name: '',
      major_id: '',

      occupations : {}, //<occupation name, occupation id

      major_checkboxes : {} //<name, checked>
    };
  }

  getMajors = () => {
    axios.get('/majors')
      .then(result => {
        let m_map = {}
        let m_checkboxes = {}
        let m_names = result.data.map(function(major) { 
          m_map[major.name]=major.id
          m_checkboxes[major.name]=false
          return major.name 
        });
        this.setState({ 
          major_names: m_names,
          majors : m_map,
          major_checkboxes : m_checkboxes
        });

      })
      .catch(err => console.log(err));
  }

  getOccupations = () => {
    axios.get('/occupations')
      .then(result => {
        let o_map = {}
        let o_names = result.data.map(function(occupation) { 
          o_map[occupation.name]=occupation.id
          return occupation.name 
        });
        this.setState({
          occupation_names : o_names,
          occupations : o_map
        });
      })
      .catch(err => console.log(err));
  }

  getUserInfo = (id) => {
    axios.get(`/users/${id}/id`)
      .then(result => {
        let u_info = result.data[0];
        this.setState({
          first_name: u_info.first_name,
          last_name: u_info.last_name,
          ucla_id: u_info.university_id,
          email: u_info.email,
          phone_number: u_info.phone,
          swe_id: u_info.swe_id,
          gpa: u_info.gpa,
        });
      })
      .catch(err => console.log(err));

    axios.get(`/users/${id}/majors`)
      .then(result => {
        console.log(result)
        let major_data = result.data;
        let m_ids = [...major_data];
        this.setState(prev => {
          let m_names = {};
          m_ids.forEach(id => {
            m_names[prev.major_names[id.major_id]] = true;
          });
          // console.log(m_names);
          return {
            major_checkboxes: {
              ...prev.major_checkboxes,
              ...m_names
            }
          };
        });
      })
      .catch(err => console.log(err));

      // TODO: get user occupation request
      axios.get(`/users/${id}/occupations`)
        .then(result => {
          let occ_id = result.data[0].occupation_id;
          this.setState(prev => {
            return {
              occupation_id: occ_id,
              occupation_name: prev.occupation_names[occ_id]
            }
          })
        })
        .catch(err => console.log(err));
  }

  handleCheckChangeMajor = event => {
    const target = event.target;
    this.setState(prev => {
      return {
        major_checkboxes: {
          ...prev.major_checkboxes,
          [target.name]: target.checked
        }
      }
    });
  };

  addUser = () => {
    if (!this.state.phone_number) {
      // Do not add major if no name specified
      console.log('ERROR: fill out phone number field.');
      //return;
    }

    let occupation_id = null
    let occupation_name = this.state.occupation_name 
    if (occupation_name)
      occupation_id = this.state.occupations[occupation_name]

    let major_ids = []
    let m_names = this.state.major_names

    //iterate through all major names, checking if checkbox is checked
    //if checkbox is checked then insert the major into the majors array for the user
    m_names.map(name => {
      if (this.state.major_checkboxes[name])
        major_ids.push(this.state.majors[name])
    });
    
    let body = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      password: "",
      email: this.state.email,
      phone: this.state.phone_number ? this.state.phone_number : null,
      university_id: this.state.ucla_id,
      is_admin: false,
      major_id: this.state.major_id,
      swe_id: this.state.swe_id ? this.state.swe_id : null,
      gpa: this.state.gpa ? this.state.gpa : null,
      occupation_id: occupation_id ? occupation_id : null,
      major_id: major_ids
    };

    // Make POST request to add major
    axios.post('/users/register', body)
      .then(result => {

        
        // Clear form values 
        this.setState({
          phone_number: '',
          ucla_id: null,
          errorMessage: ''
        });
      })
      .catch(err => {
        // TODO: use user-friendly error message
        console.log(err.response.data)
        this.setState({
          errorMessage: err.response.data.message,
        })
      })
  }

  handleSubmit = (event) => {
    this.addUser();
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
    const { check1, check2, check3 } = this.state;

    var occupation_names = this.state.occupation_names.map(name => {
      return <MenuItem key={name} value={name}>{name}</MenuItem>
    })

    var major_names = this.state.major_names.map(name => {

      return <FormControlLabel
          control={
            <Checkbox 
            name={name}
            checked={this.state.major_checkboxes[name]} 
            onChange={(event) => this.handleCheckChangeMajor(event)} 
            value={name} 
          />
        }
        label={name}
      />
    })


    return (
      
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Your Profile
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <div id={GOOGLE_BUTTON_ID}/>
            <TextField
              required fullWidth
              id='first_name'
              label='First Name'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.first_name || ''}
              onChange={this.handleChange('first_name')}
              margin='normal'
            />
            <TextField
              required fullWidth
              id='last_name'
              label='Last Name'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.last_name || ''}
              onChange={this.handleChange('last_name')}
              margin='normal'
            />

            <TextField 
              required fullWidth
              id='ucla_id'
              label='UCLA ID'
              className={classes.textField}
              placeholder='e.g. 605105555'
              value={this.state.ucla_id || ''}
              onChange={this.handleChange('ucla_id')}
              margin='normal'
            />
          
            <FormLabel component="legend">Enter your year</FormLabel>
            <Select
              required fullWidth
              className={classes.select}
              value={this.state.occupation_name || ''}
              onChange={this.handleChange('occupation_name')}
              inputProps={{
                    name: 'Occupation ID',
                    id: 'occupation_id',
              }}
              margin='normal'
            >
              {occupation_names}
            </Select>
            <FormHelperText error className={classes.formHelperText}>
              {this.state.errorMessage}
            </FormHelperText>
            <TextField
              fullWidth
              id='email'
              label='Email'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.email || ''}
              onChange={this.handleChange('email')}
              margin='normal'
            />
            <TextField
              fullWidth
              id='phone_number'
              label='Phone Number'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.phone_number || ''}
              onChange={this.handleChange('phone_number')}
              margin='normal'
            />
            <TextField
              fullWidth
              id='swe_id'
              label='SWE ID'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.swe_id || ''}
              onChange={this.handleChange('swe_id')}
              margin='normal'
            />
            <TextField
              fullWidth
              id='gpa'
              label='GPA'
              className={classes.textField}
              placeholder='e.g. 408900876'
              value={this.state.gpa || ''}
              onChange={this.handleChange('gpa')}
              margin='normal'
            />
            <Typography component="h2" variant="h5">
              Evening with Industry
            </Typography>
             <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Select your major(s)</FormLabel>
              <FormGroup>
              </FormGroup>
            </FormControl>
            {major_names}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create Your Account
            </Button>
          </form>
        </Paper>
        <ExampleGet onRef={ref => (this.users = ref)}/>
      </main>
    );
  }
}

export default withStyles(ExamplePostFormStyles)(Register);



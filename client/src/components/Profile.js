import React, { Component } from 'react';
import axios from 'axios';

import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExamplePutFormStyles from '../styles/ExamplePutForm.js';

import ExampleGetStyles from '../styles/ExampleGet.js';

class Profile extends Component {

  constructor() {
    super();

    // Initiate state
    this.state = { 
      user: {},
      user_id : 2,
      diet: {}
    };
  }

  // Called when component has been initialized
  componentDidMount() {
    this.getUser();
    this.getDiet();
    console.log(this.state)
  }

  // Called when a component is being removed from the DOM
  componentWillUnmount() {
  
  }

  // Call GET function for current user
  getUser = () => {
    console.log(this.props.user_id)
    axios.get('/users/'+ this.state.user_id + '/id')
      .then(result => {
        let user_map = {}
        result.data.forEach(function(user) {
            user_map['first_name'] = user.first_name
            user_map['last_name'] = user.last_name
            user_map['email'] = user.email
            user_map['phone_number'] = user.phone
            user_map['university_id'] = user.university_id
        })
        this.setState({ 
          user: user_map
        })
      })
      .catch(err => console.log(err));
  }

  getDiet = () => {
    let diet_map = {}
    axios.get('/diet')
      .then(result => {
        result.data.forEach(function(diet){
          diet_map[diet.id]=diet.type
        })
        
        
    })
      
    axios.get('/users/'+ this.state.user_id + '/diet')
      .then(result => {
        let diets = {};
        result.data.forEach(function(diet)
        {
            diets[diet['diet_id']]=diet_map[diet['diet_id']]
        })
        this.setState({ 
          diet: diets
        })
        
        console.log(this.state.diet)
        
    })
      
  }
  render() {
    const { classes } = this.props;

    var first_name = <p key={this.state.user.first_name}>First Name: {this.state.user.first_name}</p>
    var last_name = <p key={this.state.user.last_name}>Last Name: {this.state.user.last_name}</p>
    var phone_number = <p key={this.state.user.phone_number}>Phone Number: {this.state.user.phone_number}</p>
    var university_id = <p key={this.state.user.university_id}>UCLA ID: {this.state.user.university_id}</p>
    
    var diet_elements = Object.keys(this.state.diet).map((key, index) => (
      <p key={index}> {this.state.diet[key]} </p>
    ))

  

    return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
      <div>
        <Typography variant="h6" gutterBottom>
          User Information
        </Typography>
        {first_name}
        {last_name}
        {university_id}
        {phone_number}
      </div>
      </Paper>
       <Paper className={classes.paper}>
      <div>
        <Typography variant="h6" gutterBottom>
          Diet Preferences
        </Typography>
        {diet_elements}
      </div>
      </Paper>
    </main>
    );
  }
}

export default withStyles(ExamplePutFormStyles)(Profile);
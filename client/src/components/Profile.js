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
      users: []
    };
  }

  // Called when component has been initialized
  componentDidMount() {
    //this.props.onRef(this); //removed this
    this.getUser();
  }

  // Called when a component is being removed from the DOM
  componentWillUnmount() {
    //this.props.onRef(null); removed this
  }

  // Call GET function for current user
  getUser = () => {
    var options = {
      /*
      params: {
        user_id: '1'
      }
      /*
      params: {
        sort: 'id'
      }
      */
    }
    axios.get('/users/1/id', options)
      .then(result => {
        let user = result.data.map(function(user) { 
          return { 
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone,
            university_id: user.university_id,
          }
        })
        this.setState({ 
          users: user,
        })

      
        console.log(this.state);
        console.log('hello');
      })
      .catch(err => console.log(err));
  }
  render() {
    const { classes } = this.props;
    var first_name = this.state.users.map(user => {
      return <p key={user.first_name}>First Name: {user.first_name}</p>
    });
    var last_name = this.state.users.map(user => {
      return <p key={user.last_name}>Last Name: {user.last_name}</p>
    });
    var university_id = this.state.users.map(user => {
      return <p key={user.university_id}>University ID: {user.university_id}</p>
    });
    var phone_number = this.state.users.map(user => {
      return <p key={user.phone_number}>Phone Number: {user.phone_number}</p>
    });

    return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
      <div>
        <Typography variant="h6" gutterBottom>
          User Profile
        </Typography>
        {first_name}
        {last_name}
        {university_id}
        {phone_number}
      </div>
      </Paper>
    </main>
    );
  }
}

export default withStyles(ExamplePutFormStyles)(Profile);
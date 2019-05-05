import React, { Component } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import ExampleGetStyles from '../styles/ExampleGet.js';

class ExampleGet extends Component {
  constructor() {
    super();

    // Initiate state
    this.state = { 
      majors: []
    };
  }

  // Called when component has been initialized
  componentDidMount() {
    this.props.onRef(this);
    this.getMajors();
  }

  // Called when a component is being removed from the DOM
  componentWillUnmount() {
    this.props.onRef(null);
  }

  // Call GET function for major names
  getMajors = () => {
    axios.get('/majors')
      .then(result => {
        let majors = result.data.map(function(major) { 
          return { 
            id: major.id, 
            name: major.name, 
            ucla_id: major.ucla_id
          }
        });

        this.setState({ 
          majors: majors,
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { classes } = this.props;
    var names = this.state.majors.map(major => {
      return <p key={major.id}>{major.id}, {major.name}, {major.ucla_id}</p>
    });

    return (
      <div className={classes.get}>
        <Typography variant="h6" gutterBottom>
          List of Majors
        </Typography>
        {names}
      </div>
    );
  }
}

export default withStyles(ExampleGetStyles)(ExampleGet);

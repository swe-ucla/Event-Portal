
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
import ReactGA from 'react-ga';


import ExamplePostFormStyles from '../styles/ExamplePostForm.js';
import ExampleGet from '../components/ExampleGet.js';
import { createBrowserHistory } from 'history';

const GOOGLE_BUTTON_ID = 'gs2';

let first_name = '';
let last_name = '';
let email = '';

const history = createBrowserHistory();
history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
 ReactGA.event({
   category: "Pageview",
  action: "Page: " + location.pathname + location.search,
   label: "Page: " + location.pathname + location.search,
 });
});



class Register extends Component {

   

  componentDidMount() {
    this.getMajors();


    if (localStorage && localStorage.getItem('token') != null)
        window.location='/registerEWI'
    else {

      localStorage.clear()


      window.gapi.load('auth2', function() {
          window.auth2 = window.gapi.auth2.init({
            client_id: '*******',
           redirect_uri: 'http://localhost:3000/register'
            // Scopes to request in addition to 'profile' and 'email'
            //scope: 'additional_scope'
          });

        window.auth2.signOut().then(function () {
        });
        window.auth2.disconnect();
      
      window.gapi.signin2.render(
        GOOGLE_BUTTON_ID,
        {
          ux_mode: 'redirect',
          scope: 'email',
          width: 350,
          height: 50,
          longtitle: true,
          theme: 'dark',
          onsuccess: function(googleUser) {

        console.log("hello");
        const profile = googleUser.getBasicProfile();
        console.log("Email: " + profile.getEmail());
        console.log("Name: " + profile.getName());
        
        let first_and_last = profile.getName();
        email = profile.getEmail();
        let namearr = first_and_last.split(" ");
        first_name = namearr[0];
        last_name = namearr[1];

          var id_token = googleUser.getAuthResponse().id_token;
          console.log(id_token)

         

          const now = new Date()
          const item = {
            value : profile.getEmail(),
            expiry: now.getTime() + 60*2
          }
          // - Save the value of email and expiry in localStorage
          localStorage.setItem('token', JSON.stringify(item));
          console.log(localStorage)
          
      
    },
          onfailure: function(googleUser) {
              console.log("error: signin failed")
          }
        },
      );


      });
    }
  }
  
  constructor() {
    super();

    // Initiate state
    this.state = { 
      mids: [],
      phone_number: '',
      major_name: '',
      major_id: '',
      ucla_id: null,
      check1: true,
      check2: false,
      check3: false,
      errorMessage: ''
    };
    
  }

  getMajors = () => {
    axios.get('/majors')
      .then(result => {
        let mids = result.data.map(function(major) { return major.name });
        this.setState({ mids: mids });
      })
      .catch(err => console.log(err));
  }




  addUser = () => {
    if (!this.state.phone_number) {
      // Do not add major if no name specified
      console.log('ERROR: fill out phone number field.');
      return;
    }

    console.log(this.state.mids)

    this.state.mids.forEach(function(mid){ 
      if (mid.name == this.state.major_name){
        this.state.major_id = mid.major_id
      }
    })


    let body = {
      first_name: first_name,
      last_name: last_name,
      password: "",
      email: email,
      phone: this.state.phone_number,
      university_id: this.state.ucla_id ? this.state.ucla_id : null,
      is_admin: false,
      major_id: this.state.major_id
    };

    // Make POST request to add major
    axios.post('/users/register', body)
      .then(result => {
        // Update displayed major names
        //this.users.getUsers();

        
        // Clear form values 
        this.setState({
          phone_number: '',
          ucla_id: null,
          check1: true,
          check2: false,
          check3: false,
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

/*
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    if (name === 'major_id') {
      this.getMajorByID(event.target.value);
    }
  };
  */

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onclickFunc = () => {
    this.props.history.push('/registerEWI')
  }

  
  render() {
    const { classes } = this.props;
    const { check1, check2, check3 } = this.state;
    const error = [check1, check2, check3].filter(v => v).length !== 2;
    var mids = this.state.mids.map(mid => {
      return <MenuItem key={mid} value={mid}>{mid}</MenuItem>
    })

    return (
      
      <main className={classes.main}>
           

        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <div id={GOOGLE_BUTTON_ID}/>
             <Button className="fooBarClass" onClick={this.onclickFunc}>Next</Button>
        
            
    
            <FormHelperText error className={classes.formHelperText}>
              {this.state.errorMessage}
            </FormHelperText>
            
          </form>
        </Paper>
        <ExampleGet onRef={ref => (this.users = ref)}/>
      </main>
    );
  }
}

export default withStyles(ExamplePostFormStyles)(Register);



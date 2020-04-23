import React, { Component } from 'react';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import ExamplePostFormStyles from '../styles/ExamplePostForm.js';
import CompaniesStyles from '../styles/CompaniesForm.js';
import ExampleGet from '../components/ExampleGet.js';

class CompaniesForm extends Component {
  constructor() {
    super();

    // Initiate state
    this.state = { 
      name: '',
      description: '',
      website: '',
      errorMessage: '',
      citizenship: 'N',
      majors: {},
      positions: {},
      allMajors: {},
      allPositions: {}
    };
 //   const [citizenship, setCitizen] = React.useState(''),

    this.handleChange = this.handleChange.bind(this);
    // this.handleChange = event => {
    //   setCitizen(event.target.value);
    // };
  }

  async componentDidMount(){
    //console.log("1")
    // let response1 = await this.getAllMajors();
    // //console.log("2")
    // let response2 = await this.getAllPositions();
    // //console.log("3")
    // let response3 = await this.getCompanyData();
    // let fulfill1 = this.getAllMajors()
    // let fulfill2 = this.getAllPositions();
    // let fulfill3 = this.getCompanyData();
    // new Promise(function(fulfill1, reject){
    //     //do something for 5 seconds
    //     fulfill1();
    // }).then(function(result){
    //     return new Promise(function(fulfill2, reject){
    //         //do something for 5 seconds
    //         fulfill2();
    //     });
    // }).then(function(result){
    //     return new Promise(function(fulfill3, reject){
    //         //do something for 8 seconds
    //         fulfill3();
    //         //fulfill(result);
    //     });
    // }).then(function(result){
    //     //do something with the result
    // });
    // this.getAllMajors().then(function() {
    //   this.getAllPositions().then(function() {
    //     this.getCompanyData();
    //   })
    // })
    // this.getAllMajors(function() {
    //   this.getAllPositions(function() {
    //     this.getCompanyData(function() {
    //       //work?
    //     });
    //   });
    // });
    /*some_3secs_function(some_value, function() {
  some_5secs_function(other_value, function() {
    some_8secs_function(third_value, function() {
      //All three functions have completed, in order.
    });
  });
});*/
    this.getEverything();
  }

  changeCompany = () => {
    //need error handling!

    if (!this.state.name) {
      // Do not add major if no name specified
      console.log('ERROR: fill out Company Name field.');
      return;
    }

    let majorIDs = [];
    let removeMajorIDs = [];
    let majors = this.state.majors;
    let allMajors = this.state.allMajors;
    for (let property in majors) {
      if (majors.hasOwnProperty(property)) {
        if(majors[property] === true){
          majorIDs.push(allMajors[property]);
        } else {
          removeMajorIDs.push(allMajors[property]);
        }
      }
    }

    let positionIDs = [];
    let removePositionIDs = [];
    let allPositions = this.state.allPositions;
    let positions = this.state.positions;
    for (let property in positions) {
      if (positions.hasOwnProperty(property)) {
        if(positions[property] === true){
          positionIDs.push(allPositions[property]);
        } else {
          removePositionIDs.push(allPositions[property]);
        }
      }
    }
    console.log(majorIDs);
    console.log(removeMajorIDs);
    //console.log(removePositionIDs);
    //console.log(majorIDs);

    let body = {
      name: this.state.name,
      description: this.state.description,
      website: this.state.website,
      citizenship_requirement: this.state.citizenship ? 'Y' : 'N', //change?
      major_id: majorIDs,
      //position_id: positionIDs,
      //remove_position_id: removePositionIDs,
      //remove_major_id: removeMajorIDs,
    };

    // Make PUT request to update company data
    axios.put('/companies/1', body)
      .then(result => {
        // any post submission handling (maybe a confirmation message?)
      })
      .catch(err => {
        // TODO: use user-friendly error message
        console.log(err.response.data)
        this.setState({
          errorMessage: err.response.data.message,
        })
      });
  }

  getEverything = () => {
    var options = {
      params: {
        sort: 'id'
      }
    }
    let majorsChecked = {};
    let positionsChecked = {};
    axios.get('/majors', options)
      .then(result => {
        let majorsEnum = {};
        //let majorsChecked = {};
        result.data.forEach(function(major) { 
          majorsEnum[major.name] = major.id;
          majorsChecked[major.name] = false;
        });

        this.setState({ 
          allMajors: majorsEnum,
          majors: majorsChecked
        });
        console.log(this.state.allMajors)
        axios.get('/positions', options)
          .then(result => {
            let positionsEnum = {};
            result.data.forEach(function(position) { 
              positionsEnum[position.role] = position.id;
              positionsChecked[position.role] = false;
            });
            // maybe skip intermediate state updates
            this.setState({ 
              allPositions: positionsEnum,
              positions: positionsChecked
            });
            let idToMajor = {};
            console.log(this.state.allMajors);
            Object.keys(this.state.allMajors).forEach(key => {
              console.log(key)
              idToMajor[this.state.allMajors[key]] = key;
            })
            console.log(idToMajor);
            axios.get('/companies/1/majors')
            .then(result => {
              let majs = result.data;
              console.log(majs)
              for (let m in majs) {
                console.log(majs[m].major_id)
                console.log(idToMajor[majs[m].major_id])
                majorsChecked[idToMajor[majs[m].major_id]] = true;
              }
              this.setState({
                majors: majorsChecked
              });
              console.log(this.state.majors);
              axios.get('/companies/1/positions')
              .then(result => {
                let idToPosition = {};
                console.log(this.state.allPositions);
                Object.keys(this.state.allPositions).forEach(key => {
                  console.log(key)
                  idToPosition[this.state.allPositions[key]] = key;
                })
                let pos = result.data;
                for (let p in pos) {
                  positionsChecked[idToPosition[pos[p].position_id]] = true;
                }
              })
              .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
       axios.get('/companies/1/id')
      .then(result => {
        let nam = result.data[0].name;
        let web = result.data[0].website;
        let desc = result.data[0].description;
        let cit_req = result.data[0].citizenship_requirement;
        console.log(nam)
        this.setState({
          name: nam,
          description: desc,   
          website: web,
          citizenship: cit_req 
        });
      })
      .catch(err => console.log(err));
  }

 getCompanyData = async() => {
    //invert mapping of enum, yielding mapping from id to name
    let idToMajor = {};
    console.log(this.state.allMajors);
    Object.keys(this.state.allMajors).forEach(key => {
      console.log(key)
      idToMajor[this.state.allMajors[key]] = key;
    })
    console.log(idToMajor);

    axios.get('/companies/1/id')
      .then(result => {
        let nam = result.data[0].name;
        let web = result.data[0].website;
        let desc = result.data[0].description;
        let cit_req = result.data[0].citizenship_requirement;
        console.log(nam)
        this.setState({
          name: nam,
          description: desc,   
          website: web,
          citizenship: cit_req 
        });
      })
      .catch(err => console.log(err));
      axios.get('/companies/1/majors')
      .then(result => {
        let majs = result.data;
        let majorsChecked = {};
        console.log(majs)
        for (let am in this.state.allMajors) {
          majorsChecked[idToMajor[am.major_id]] = false;
        }
        for (let m in majs) {
          console.log(majs[m].major_id)
          console.log(idToMajor[majs[m].major_id])
          majorsChecked[idToMajor[majs[m].major_id]] = true;
        }
        this.setState({
          majors: majorsChecked
        });
        console.log(this.majors);
      })
      .catch(err => console.log(err));
      //majorsChecked[major.name] = false;
      return 1;
  }

  getAllMajors = async() => {
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
        console.log(this.state.allMajors)
      })
      .catch(err => console.log(err));
      return 1;
  }

  getAllPositions = async() => {
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
        return 1;
    }

  handleSubmit = (event) => {
    this.changeCompany();
    // Prevent site refresh after submission
    event.preventDefault();
  }

  handleChange = name => event => {
    console.log("Tried")
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

   //console.log(allMajors);
    
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
              <div>
                {majorChecks}
               </div>
            </FormGroup>
            <FormLabel>Positions Hiring:</FormLabel>
            <FormGroup>
              <div>
              {positionChecks}
              </div>
            </FormGroup>
            <FormHelperText error className={classes.formHelperText}>
              {this.state.errorMessage}
            </FormHelperText>
            <FormControl className={classes.formControl}>
            <FormLabel id="demo-simple-select-label">Citizenship</FormLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.citizenship}
                onChange={this.handleChange('citizenship')}
              >
                <MenuItem value={'Y'}>Yes</MenuItem>
                <MenuItem value={'N'}>No</MenuItem>
              </Select>
            </FormControl>
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

export default withStyles(CompaniesStyles)(CompaniesForm);

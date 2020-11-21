import React, { Component } from "react";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import CompaniesStyles from "../styles/CompaniesForm.js";
import CardMedia from "@material-ui/core/CardMedia";


class CompaniesForm extends Component {
  constructor() {
    super();

    // Initiate state
    this.state = {
      name: "",
      logo: "",
      description: "",
      website: "",
      errorMessage: "",
      citizenship: "N",
      interview: "N",
      majors: {},
      positions: {},
      years: {},
      locations: {},
      allMajors: {},
      allPositions: {},
      allYears: {},
      allLocations: {}
    };
    //   const [citizenship, setCitizen] = React.useState(''),

    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
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
      console.log("ERROR: fill out Company Name field.");
      return;
    }

    let majorIDs = [];
    let removeMajorIDs = [];
    let majors = this.state.majors;
    let allMajors = this.state.allMajors;
    for (let property in majors) {
      if (majors.hasOwnProperty(property)) {
        if (majors[property] === true) {
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
        if (positions[property] === true) {
          positionIDs.push(allPositions[property]);
        } else {
          removePositionIDs.push(allPositions[property]);
        }
      }
    }

    let yearIDs = [];
    let removeYearIDs = [];
    let years = this.state.years;
    let allYears = this.state.allYears;
    for (let property in years) {
      if (years.hasOwnProperty(property)) {
        if (years[property] === true) {
          yearIDs.push(allYears[property]);
        } else {
          removeYearIDs.push(allYears[property]);
        }
      }
    }

    let locationIDs = [];
    let removeLocationIDs = [];
    let locations = this.state.locations;
    let allLocations = this.state.allLocations;
    for (let property in locations) {
      if (locations.hasOwnProperty(property)) {
        if (locations[property] === true) {
          locationIDs.push(allLocations[property]);
        } else {
          removeLocationIDs.push(allLocations[property]);
        }
      }
    }

    let body = {
      name: this.state.name,
      description: this.state.description,
      website: this.state.website,
      logo: this.state.logo,
      citizenship_requirement: this.state.citizenship,
      interview: this.state.interview,
      year_id: yearIDs,
      location_id: locationIDs,
      major_id: majorIDs,
      position_id: positionIDs,
      remove_year_id: removeYearIDs,
      remove_location_id: removeLocationIDs,
      remove_position_id: removePositionIDs,
      remove_major_id: removeMajorIDs
    };

    // Make PUT request to update company data
    axios
      .put("/companies/" + this.props.location.companyid, body)
      .then(result => {
        // any post submission handling (maybe a confirmation message?)
      })
      .catch(err => {
        // TODO: use user-friendly error message
        console.log(err.response.data);
        this.setState({
          errorMessage: err.response.data.message
        });
      });
  };

  getEverything = () => {
    var options = {
      params: {
        sort: "id"
      }
    };
    let majorsChecked = {};
    let positionsChecked = {};
    let yearsChecked = {};
    let locationsChecked = {};
    //years
    axios
      .get("/years", options)
      .then(result => {
        let yearsEnum = {};
        //let majorsChecked = {};
        result.data.forEach(function(year) {
          yearsEnum[year.name] = year.id;
          yearsChecked[year.name] = false;
        });

        this.setState({
          allYears: yearsEnum,
          years: yearsChecked
        });
       });
        console.log(this.state.allYears);
    //locations
      axios
      .get("/hiringlocations", options)
      .then(result => {
        let locationsEnum = {};
        //let majorsChecked = {};
        result.data.forEach(function(location) {
          locationsEnum[location.location] = location.id;
          locationsChecked[location.location] = false;
        });

        this.setState({
          allLocations: locationsEnum,
          locations: locationsChecked
        });
        });
        console.log(this.state.allLocations);
    //majors
    axios
      .get("/majors", options)
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
        });
        console.log(this.state.allMajors);
        //positions
        axios
          .get("/positions", options)
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
           });
            //locations
            let idToLocation = {};
            console.log(this.state.allLocations);
            Object.keys(this.state.allLocations).forEach(key => {
              console.log(key);
              idToLocation[this.state.allLocations[key]] = key;
            });
            console.log(idToLocation);
            axios
              .get("/companies/" + this.props.location.companyid + "/locations")
              .then(result => {
                let locs = result.data;
                console.log(locs);
                for (let m in locs) {
                  console.log(locs[m].loc_id);
                  console.log(idToLocation[locs[m].loc_id]);
                  locationsChecked[idToLocation[locs[m].loc_id]] = true;
                }
                this.setState({
                  locations: locationsChecked
                });
                console.log(this.state.locations);
                });
            //years
                axios
                  .get(
                    "/companies/" + this.props.location.companyid + "/years"
                  )
                  .then(result => {
                    let idToYear = {};
                    console.log(this.state.allYears);
                    Object.keys(this.state.allYears).forEach(key => {
                      console.log(key);
                      idToYear[this.state.allYears[key]] = key;
                    });
                    let year = result.data;
                    for (let p in year) {
                      yearsChecked[idToYear[year[p].year_id]] = true;
                    }
                  });
            //majors
            let idToMajor = {};
            console.log(this.state.allMajors);
            Object.keys(this.state.allMajors).forEach(key => {
              console.log(key);
              idToMajor[this.state.allMajors[key]] = key;
            });
            console.log(idToMajor);
            axios
              .get("/companies/" + this.props.location.companyid + "/majors")
              .then(result => {
                let majs = result.data;
                console.log(majs);
                for (let m in majs) {
                  console.log(majs[m].major_id);
                  console.log(idToMajor[majs[m].major_id]);
                  majorsChecked[idToMajor[majs[m].major_id]] = true;
                }
                this.setState({
                  majors: majorsChecked
                });
                console.log(this.state.majors);
                });
                //positions
                axios
                  .get(
                    "/companies/" + this.props.location.companyid + "/positions"
                  )
                  .then(result => {
                    let idToPosition = {};
                    console.log(this.state.allPositions);
                    Object.keys(this.state.allPositions).forEach(key => {
                      console.log(key);
                      idToPosition[this.state.allPositions[key]] = key;
                    });
                    let pos = result.data;
                    for (let p in pos) {
                      positionsChecked[idToPosition[pos[p].position_id]] = true;
                    }
                  })
                  .catch(err => console.log(err)); //work on error handling!
    axios
      .get("/companies/" + this.props.location.companyid + "/id")
      .then(result => {
        let nam = result.data[0].name;
        let log = result.data[0].logo;
        let web = result.data[0].website;
        let desc = result.data[0].description;
        let cit_req = result.data[0].citizenship_requirement;
        let interv = result.data[0].interview;
        console.log(nam);
        this.setState({
          name: nam,
          logo: log,
          description: desc,
          website: web,
          citizenship: cit_req,
          interview: interv
        });
      })
      .catch(err => console.log(err));
    };
  getCompanyData = async () => {
    //invert mapping of enum, yielding mapping from id to name
    let idToMajor = {};
    console.log(this.state.allMajors);
    Object.keys(this.state.allMajors).forEach(key => {
      console.log(key);
      idToMajor[this.state.allMajors[key]] = key;
    });
    console.log(idToMajor);

    axios
      .get("/companies/" + this.props.location.companyid + "/id") // "/companies/1/id"
      .then(result => {
        let nam = result.data[0].name;
        let log = result.data[0].logo;
        let web = result.data[0].website;
        let desc = result.data[0].description;
        let cit_req = result.data[0].citizenship_requirement;
        let interv = result.data[0].interview;
        console.log(nam);
        this.setState({
          name: nam,
          logo: log,
          description: desc,
          website: web,
          citizenship: cit_req,
          interview: interv,
        });
      })
      .catch(err => console.log(err));
    axios
      .get("/companies/" + this.props.location.companyid + "majors") ///companies/1/majors
      .then(result => {
        let majs = result.data;
        let majorsChecked = {};
        console.log(majs);
        for (let am in this.state.allMajors) {
          majorsChecked[idToMajor[am.major_id]] = false;
        }
        for (let m in majs) {
          console.log(majs[m].major_id);
          console.log(idToMajor[majs[m].major_id]);
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
  };

  getAllMajors = async () => {
    var options = {
      params: {
        sort: "id"
      }
    };
    axios
      .get("/majors", options)
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
        console.log(this.state.allMajors);
      })
      .catch(err => console.log(err));
    return 1;
  };

  getAllPositions = async () => {
    var options = {
      params: {
        sort: "id"
      }
    };
    axios
      .get("/positions", options)
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
  };

  getAllLocations = async () => {
    var options = {
      params: {
        sort: "id"
      }
    };
    axios
      .get("/hiringlocations", options)
      .then(result => {
        let locationsEnum = {};
        let locationsChecked = {};
        result.data.forEach(function(location) {
          locationsEnum[location.location] = location.id;
          locationsChecked[location.location] = false;
        });

        this.setState({
          allLocations: locationsEnum,
          locations: locationsChecked
        });
      })
      .catch(err => console.log(err));
    return 1;
  };
   getAllYears = async () => {
      var options = {
        params: {
          sort: "id"
        }
      };
      axios
        .get("/years", options)
        .then(result => {
          let yearsEnum = {};
          let yearsChecked = {};
          result.data.forEach(function(year) {
            yearsEnum[year.name] = year.id;
            yearsChecked[year.name] = false;
          });

          this.setState({
            allYears: yearsEnum,
            years: yearsChecked
          });
        })
        .catch(err => console.log(err));
      return 1;
    };

  handleSubmit = event => {
    this.changeCompany();
    // Prevent site refresh after submission
    event.preventDefault();
  };

  handleChange = name => event => {
    console.log("Tried");
    this.setState({
      [name]: event.target.value
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

  handleLogoChange = name => input => {
    var reader = new FileReader();
    const _this = this;
    reader.onload = function(e) {
      _this.setState({logo: e.target.result});
    };

    reader.readAsDataURL(input.target.files[0]);
  }

  render() {
    const { classes } = this.props;
    const { citizenship_requirement } = this.state.citizenship;
    const {onsite_interview} = this.state.interview;
    //const error = [check1, check2, check3].filter(v => v).length !== 2;
    const allMajors = this.state.allMajors;
    const majors = this.state.majors;
    const allPositions = this.state.allPositions;
    const positions = this.state.positions;
    const allLocations = this.state.allLocations;
    const locations = this.state.locations;
    const allYears = this.state.allYears;
    const years = this.state.years;

    const majorChecks = Object.getOwnPropertyNames(majors).map(elem => {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={majors[elem]}
              onChange={this.handleCheckChange("majors")}
              value={elem}
            />
          }
          label={elem}
        />
      );
    });

    const locationChecks = Object.getOwnPropertyNames(locations).map(elem => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={locations[elem]}
                  onChange={this.handleCheckChange("locations")}
                  value={elem}
                />
              }
              label={elem}
            />
          );
        });

const yearChecks = Object.getOwnPropertyNames(years).map(elem => {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={years[elem]}
              onChange={this.handleCheckChange("years")}
              value={elem}
            />
          }
          label={elem}
        />
      );
    });

    const positionChecks = Object.getOwnPropertyNames(positions).map(elem => {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={positions[elem]}
              onChange={this.handleCheckChange("positions")}
              value={elem}
            />
          }
          label={elem}
        />
      );
    });

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Add Company
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <TextField
              required
              fullWidth
              id="name"
              label="Company Name"
              className={classes.textField}
              placeholder=""
              value={this.state.name || ""}
              onChange={this.handleChange("name")}
              margin="normal"
            />
            <TextField
              fullWidth
              id="website"
              label="Company Website"
              className={classes.textField}
              placeholder="e.g. www.company.com"
              value={this.state.website || ""}
              onChange={this.handleChange("website")}
              margin="normal"
            />
            <FormLabel>Majors Hiring:</FormLabel>
            <FormGroup>
              <div>{majorChecks}</div>
            </FormGroup>
            <FormLabel>Positions Hiring:</FormLabel>
            <FormGroup>
              <div>{positionChecks}</div>
            </FormGroup>
            <FormLabel>Locations Hiring To:</FormLabel>
            <FormGroup>
              <div>{locationChecks}</div>
            </FormGroup>
            <FormLabel>Years Hiring:</FormLabel>
            <FormGroup>
              <div>{yearChecks}</div>
            </FormGroup>
            <FormHelperText error className={classes.formHelperText}>
              {this.state.errorMessage}
            </FormHelperText>
            <div></div>
            <FormControl className={classes.formControl}>
              <FormLabel id="demo-simple-select-label">Citizenship</FormLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.citizenship}
                onChange={this.handleChange("citizenship")}
              >
                <MenuItem value={"Y"}>Yes</MenuItem>
                <MenuItem value={"N"}>No</MenuItem>
              </Select>
              <FormLabel id="demo-simple-select-label">On Site Interview</FormLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.interview}
                onChange={this.handleChange("interview")}
              >
                <MenuItem value={"Y"}>Yes</MenuItem>
                <MenuItem value={"N"}>No</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              id="description"
              label="Company Description"
              className={classes.textField}
              placeholder=""
              value={this.state.description || ""}
              onChange={this.handleChange("description")}
              margin="normal"
            />
            <FormLabel id="demo-simple-select-label">Company Image</FormLabel>
            <br />
            <Input type="file" disableUnderline="true" accept="image/*" onChange={this.handleLogoChange()}/>
            <CardMedia
              style={{width: '350px', height: '197px'}}
              component="img"
              image={this.state.logo}
              title="Uploaded Image"
            />
            <br />
            <br />
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

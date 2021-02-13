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
      description: "",
      website: "",
      errorMessage: "",
      citizenship: "N",
      interview: "N",
      majors: {},
      positions: {},
      locations: {},
      years: {},
      allMajors: {},
      allPositions: {},
      allLocations: {},
      allYears: {},
      logo: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getAllMajors();
    this.getAllPositions();
    this.getAllLocations();
    this.getAllYears();
  }

  addCompany = () => {
    //need error handling!

    if (!this.state.name) {
      // Do not add major if no name specified
      console.log("ERROR: fill out Company Name field.");
      return;
    }
    if (!this.state.website) {
      // Do not add major if no name specified
      console.log("ERROR: fill out Company Website field.");
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
    console.log(majors); 
    console.log(allMajors); 
    for (let property in majors) {
      if (majors.hasOwnProperty(property)) {
        if (majors[property] === true) {
          majorIDs.push(allMajors[property]);
          console.log(allMajors[property]); 
        }
      }
    }
    console.log(majorIDs.length); 
    if (majorIDs.length == 0)
      majorIDs.push(13); // hardcoded ID for "Undeclared Engineering"

    let positionIDs = [];
    let allPositions = this.state.allPositions;
    let positions = this.state.positions;
    console.log(allPositions); 
    console.log(positions); 
    for (let property in positions) {
      if (positions.hasOwnProperty(property)) {
        console.log(property);
        if (positions[property] === true) {
          positionIDs.push(allPositions[property]);
          console.log(allPositions[property]); 
        }
      }
    }
    if (positionIDs.length == 0)
      positionIDs.push(4); // hardcoded ID for "Undecided"

    console.log(majorIDs);
    let locationIDs = [];
    let allLocations = this.state.allLocations;
    let locations = this.state.locations;
    console.log(allLocations); 
    console.log(locations); 
    for (let property in locations) {
      if (locations.hasOwnProperty(property)) {
        console.log(property);
        if (locations[property] === true) {
          locationIDs.push(allLocations[property]);
          console.log(allLocations[property]);
        }
      }
    }
    if (locationIDs.length == 0)
      locationIDs.push(5); // hardcoded ID for "Undecided"

    let yearIDs = [];
    let years = this.state.years;
    let allYears = this.state.allYears;
    console.log(years); 
    console.log(allYears); 
    for (let property in years) {
      if (years.hasOwnProperty(property)) {
        if (years[property] === true) {
          yearIDs.push(allYears[property]);
          console.log(allYears[property]); 
        }
      }
    }
    if (yearIDs.length == 0)
      yearIDs.push(6); // hardcoded ID for "All"

    let body = {
      name: this.state.name,
      logo: this.state.logo,
      description: this.state.description,
      website: this.state.website,
      citizenship_requirement: this.state.citizenship,
      interview: this.state.interview,
      major_id: majorIDs,
      position_id: positionIDs,
      location_id: locationIDs,
      year_id: yearIDs
    };
    console.log(body)

    // Make POST request to add major
    axios
      .post("/companies", body)
      .then(result => {
        // Clear form values
        this.setState({
          name: "",
          description: "",
          logo: "",
          website: "",
          citizenship_requirement: "",
          errorMessage: ""
        });
      })
      .catch(err => {
        // TODO: use user-friendly error message
        console.log(err.response.data);
        this.setState({
          errorMessage: err.response.data.message
        });
      });
  };

  //ideally extract similar allMajors calls out and then format for specific
  //components

  getAllMajors = () => {
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
          // if(major.name = "Undeclared Engineering")
          //   majorsChecked[major.name] = true;
        });

        this.setState({
          allMajors: majorsEnum,
          majors: majorsChecked
        });
      })
      .catch(err => console.log(err));
  };

  getAllPositions = () => {
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
          // if(position.role = "Undecided")
          //   positionsChecked[position.role] = true;
        });

        this.setState({
          allPositions: positionsEnum,
          positions: positionsChecked
        });
      })
      .catch(err => console.log(err));
  };
  getAllLocations = () => {
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
          // if(location.location = "Undecided")
          //   locationsChecked[location.location] = true;
        });

        this.setState({
          allLocations: locationsEnum,
          locations: locationsChecked
        });
      })
      .catch(err => console.log(err));
  };
  getAllYears = () => {
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
          // if(year.name = "All")
          //   yearsChecked[year.name] = true;
        });

        this.setState({
          allYears: yearsEnum,
          years: yearsChecked
        });
      })
      .catch(err => console.log(err));
  };

  handleSubmit = event => {
    this.addCompany();
    // Prevent site refresh after submission
    event.preventDefault();
    // this.props.router.push("/companiesadmin");
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

  // image upload
  handleLogoChange = name => input => {
    console.log(input.target.files[0]);
    var reader = new FileReader();
    const _this = this;
    reader.onload = function(e) {
      _this.setState({logo: e.target.result});

    };

    reader.readAsDataURL(input.target.files[0]);
  }

  render() {
    const { classes } = this.props;
    const { citizenship_requirement } = this.state;
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
      if (elem != "Undeclared Engineering")
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

    const positionChecks = Object.getOwnPropertyNames(positions).map(elem => {
      if (elem != "Undecided")
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
    const locationChecks = Object.getOwnPropertyNames(locations).map(elem => {
      if (elem != "Undecided")    
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
        if (elem != "All")  
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
              required
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
            <FormLabel>Hiring Locations:</FormLabel>
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
            <br />
            <br />
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
import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CompanyCard from "./CompanyCard.js";
import { withStyles } from "@material-ui/core/styles";
import CompanyCardStyles from "../styles/CompanyCard.js";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

class CompaniesCardList extends Component {
  constructor(props) {
    super(props);

    this.getCompanies = this.getCompanies.bind(this);
    this.getAllMajors = this.getAllMajors.bind(this);
    this.getAllPositions = this.getAllPositions.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      companies: [],
      allMajors: {},
      allPositions: {},
      searchText: ""
    };
  }

  componentDidMount() {
    //this.props.onRef(this); ??
    this.getCompanies();
    this.getAllMajors();
    this.getAllPositions();
  }

  handleSearch = name => event => {
    this.setState({
      searchText: event.target.value
    });
  };

  handleSubmit = event => {
    this.search();
    // Prevent site refresh after submission
    event.preventDefault();
  };

  search = () => {};

  getCompanies = () => {
    var options = {
      params: {
        sort: "name"
      }
    };
    var companiesData = [];
    axios
      .get("/companies/", options.params)
      .then(result => {
        let companiesData = result.data;
        this.setState({ companies: companiesData });
        console.log(companiesData);
      })
      .catch(err => console.log(err));
  };

  getAllMajors = () => {
    var options = {
      params: {
        sort: "id"
      }
    };
    axios
      .get("/majors", options)
      .then(result => {
        let majors = {};
        result.data.forEach(function(major) {
          majors[major.id] = major.name;
        });

        this.setState({
          allMajors: majors
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
        let positions = {};
        result.data.forEach(function(position) {
          positions[position.id] = position.role;
        });

        this.setState({
          allPositions: positions
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { classes } = this.props;
    let list = this.state.companies;

    return (
      <div>
        <div class="searchbar">
          <form className={classes.form} onSubmit={this.handleSubmit}>
            {/* TODO: Functionality of search bar */}
            {/* <TextField
			              fullWidth
			              id="search"
			              label="Search"
			              className={classes.textField}
			              placeholder=""
			              value={this.state.searchText || ""}
			              onChange={this.handleSearch()}
			              margin="normal"
			            />
			            <Button
			              type="submit"
			              fullWidth
			              variant="contained"
			              color="primary"
			              className={classes.submit}
			            >
			            Search
			            </Button> */}
          </form>
        </div>
        <div className={classNames(classes.layout, classes.cardGrid)}>
          <Grid container spacing={40}>
            {list.map(companyCard => {
              return (
                <Grid item key={companyCard.name} sm={6} md={4} lg={3}>
                  <CompanyCard
                    company={companyCard}
                    allPositions={this.state.allPositions}
                    allMajors={this.state.allMajors}
                  />{" "}
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(CompanyCardStyles)(CompaniesCardList);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AdminCompanyCard from './AdminCompanyCard.js';
import { withStyles } from '@material-ui/core/styles';
import CompanyCardStyles from '../styles/CompanyCard.js';
import axios from 'axios';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

class AdminCompaniesCardList extends Component{
	constructor(props){
		super(props);

		this.getCompanies = this.getCompanies.bind(this);
		this.state = {
			companies: [],
			allMajors: {},
			allPositions: {}
		}
	}

	componentDidMount() {
		//this.props.onRef(this); ??
		this.getCompanies();
		this.getAllMajors();
		this.getAllPositions();
	}

	getCompanies = () => {
  		var options = {
  			params: {
  				sort: 'name'
  			}
  		}
  		var companiesData = [];
  		axios.get('/companies/', options.params)
			.then(result => {
				let companiesData = result.data;
				this.setState({companies: companiesData});
				console.log(companiesData);
			})
			.catch(err => console.log(err));
	}

	getAllMajors = () => {
    var options = {
      params: {
        sort: 'id'
      }
    }
    axios.get('/majors', options)
      .then(result => {
        let majors = {};
        result.data.forEach(function(major) { 
          majors[major.id] = major.name;
        });

        this.setState({ 
          allMajors: majors,
        });
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
	        let positions = {};
	        result.data.forEach(function(position) { 
	          positions[position.id] = position.role;
	        });


	        this.setState({ 
	          allPositions: positions,
	        });
	      })
	      .catch(err => console.log(err));
	  }

	render() {
		const { classes } = this.props;
		let list = this.state.companies;

		return (
			<div className={classNames(classes.layout, classes.cardGrid)}>
	          <Grid container spacing={40}>
		        	{list.map(companyCard =>{
						return <Grid item key={companyCard.name} sm={6} md={4} lg={3}><AdminCompanyCard company={companyCard} allPositions={this.state.allPositions} allMajors={this.state.allMajors}/> </Grid>
		        	})}
	          </Grid>
        	</div>
		)
	}
}

export default withStyles(CompanyCardStyles)(AdminCompaniesCardList);
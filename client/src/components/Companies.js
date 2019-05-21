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
import { withStyles } from '@material-ui/core/styles';
import CompanyCard from './CompanyCard.js';
import CompaniesStyles from '../styles/Companies.js';
import axios from 'axios';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
//const app = express();
class Companies extends Component {
	constructor() {
		super();

	}
	componentDidMount() {
		this.props.onRef(this);
		this.getCompanies();
	}
	 componentWillUnmount() {
    	this.props.onRef(null);
  	}
  	getCompanies = () => {
  		var options = {
  			params: {
  				sort: 'name'
  			}
  		}
  		axois.get('/companies/', options)
  			.then(result => {
  				let companies = result.data.map(function(company) {
  					return{
  						
  					}
  				})
  			})
  	}

	render() {
	  const { classes } = this.props;

	  return (
	    <React.Fragment>
	      <CssBaseline />
	      <AppBar position="static" className={classes.appBar}>
	        <Toolbar>
	          <CameraIcon className={classes.icon} />
	          <Typography variant="h6" color="inherit" noWrap>
	            Companies Info
	          </Typography>
	        </Toolbar>
	      </AppBar>
	      <main>
	        {/* Hero unit */}
	        <div className={classes.heroUnit}>
	          <div className={classes.heroContent}>
	            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
	              Companies Info
	            </Typography>
	            <Typography variant="h6" align="center" color="textSecondary" paragraph>
	              View information about companies that will be hiring at the event. 
	            </Typography>
	            <div className={classes.heroButtons}>
	              <Grid container spacing={16} justify="center">
	                <Grid item>
	                  <Button variant="contained" color="primary">
	                    Main call to action
	                  </Button>
	                </Grid>
	                <Grid item>
	                  <Button variant="outlined" color="primary">
	                    Secondary action
	                  </Button>
	                </Grid>
	              </Grid>
	            </div>
	          </div>
	        </div>
	        <div className={classNames(classes.layout, classes.cardGrid)}>
	          {/* End hero unit */}
	          <Grid container spacing={40}>
	            {cards.map(card => (
	              <Grid item key={card} sm={6} md={6} lg={3}>
	                <CompanyCard/>
	              </Grid>
	            ))}
	          </Grid>
	        </div>
	      </main>
	      {/* Footer */}
	      <footer className={classes.footer}>
	        <Typography variant="h6" align="center" gutterBottom>
	          Footer
	        </Typography>
	        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
	          Something here to give the footer a purpose!
	        </Typography>
	      </footer>
	      {/* End footer */}
	    </React.Fragment>
	  );
	}
}

export default withStyles(CompaniesStyles)(Companies);
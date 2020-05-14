
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import BusinessIcon from '@material-ui/icons/Business';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import AdminCompanyCard from './AdminCompanyCard.js';
import AdminCompaniesCardList from './AdminCompaniesCardList.js';
import CompaniesStyles from '../styles/Companies.js';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';


const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
//const app = express();
class CompaniesAdmin extends Component {
	constructor(props) {
		super(props)
	}

	/*
	componentDidMount() {
		this.props.onRef(this); 
	}
	
	componentWillUnmount() {
    	this.props.onRef(null);
  	}
  	*/

	render() {
	    const { classes } = this.props;

		  return (
		    <React.Fragment>
		      <CssBaseline />
		      <AppBar position="static" className={classes.appBar}>
		        <Toolbar>
		          <BusinessIcon className={classes.icon} />
		          <Typography variant="h6" color="inherit" noWrap>
		            Companies
		          </Typography>
		        </Toolbar>
		      </AppBar>
		      <main>
		        {/* Hero unit */}
		        <div className={classes.heroUnit}>
		          <div className={classes.heroContent}>
		            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
		              Companies
		            </Typography>
		            <Typography component="h1" variant="subtitle1" align="center" color="textPrimary" gutterBottom>
		              SWE Admin Access
		            </Typography>
		          </div>
		        </div>
		        <div>
        		<Fab color="primary" aria-label="add" href="/companiesform">
			        <AddIcon />
			     </Fab>
	           </div>
		        <AdminCompaniesCardList/>
		      </main>
		    </React.Fragment>
		  );
		}
}

export default withStyles(CompaniesStyles)(CompaniesAdmin);
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
import CompanyCard from './CompanyCard.js';
import { withStyles } from '@material-ui/core/styles';
import CompanyCardStyles from '../styles/CompanyCard.js';


function CompaniesList(props){
	let list = [];
	props.company.map(companyCard =>{

		list.push(<Grid item key={companyCard.name} sm={6} md={4} lg={3}><CompanyCard company={companyCard}/> </Grid>)
	})

	return(
		<div>
			{list}
		</div>
	)
}

export default CompaniesList;
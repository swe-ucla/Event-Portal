import React, { Component } from 'react';
import MediaCard from './MediaCard.js'
import { withStyles } from '@material-ui/core/styles';
import EventRowStyles from '../styles/EventRow.js';
import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
//import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class EventRow extends Component {
	render() {
		const { classes } = this.props;
		let cards;
		if (this.props.events) {
			cards = this.props.events.map((cards, index) => {
    	  return (<Grid item key={this.props.events[index].fb_id}>
    	  	<MediaCard event={this.props.events[index]} />
    	  	</Grid>);
    	});
		}
		
		return (
			<div>
				<p className={classes.title}> 
					{this.props.name}
				</p>
				<Grid container spacing={4} className={classes.row}>
					{cards}
				</Grid>
			</div>
		)
	}
}

export default withStyles(EventRowStyles)(EventRow);
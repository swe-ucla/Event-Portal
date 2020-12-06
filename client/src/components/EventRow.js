import React from 'react';
import MediaCard from './MediaCard.js'
import EventRowStyles from '../styles/EventRow.js';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const EventRow = (props) => {
	const { classes } = props;

	return (
		<div>
			<p className={classes.title}> 
				{props.name}
			</p>
			<Grid container spacing={32} className={classes.row}>
				{
					props.events.map((_, index) => {
						return (
							<Grid item key={props.events[index].fb_id}>
								<MediaCard event={props.events[index]} userID={props.userID} />
							</Grid>
						)
					})
				}
			</Grid>
		</div>
	)
}

export default withStyles(EventRowStyles)(EventRow);

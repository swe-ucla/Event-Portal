import React, { Component } from 'react';
import MediaCard from './MediaCard.js'
import { withStyles } from '@material-ui/core/styles';
import EventRowStyles from '../styles/EventRow.js'

class EventRow extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { classes } = this.props;
		
		return (
			<div>
				<p className={classes.title}> 
					WEEK 1
				</p>
				<div className={classes.row}>
					<MediaCard/>
					<MediaCard/>
					<MediaCard/>
					<MediaCard/>
					<MediaCard/>
					<MediaCard/>
				</div>
				<p className={classes.title}> 
					WEEK 2
				</p>
				<div className={classes.row}>
					<MediaCard/>
					<MediaCard/>
					<MediaCard/>
					<MediaCard/>
					<MediaCard/>
					<MediaCard/>
				</div>
			</div>
		)
	}
}

export default withStyles(EventRowStyles)(EventRow);
import React, { Component } from 'react';
import MediaCard from './MediaCard.js'
import { withStyles } from '@material-ui/core/styles';
import EventRowStyles from '../styles/EventRow.js'

class EventRow extends Component {
	render() {
		const { classes } = this.props;
		let cards;
		if (this.props.events) {
			cards = this.props.events.map((cards, index) => {
    	  return <MediaCard event={this.props.events[index]} />
    	});
		}
		
		return (
			<div>
				<p className={classes.title}> 
					period
				</p>
				<div className={classes.row}>
					{cards}
				</div>
			</div>
		)
	}
}

export default withStyles(EventRowStyles)(EventRow);
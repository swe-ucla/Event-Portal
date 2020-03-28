import React, { Component } from 'react';
import EventRow from './EventRow.js'
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import EventsStyles from '../styles/Events.js'
import Divider from '@material-ui/core/Divider';

class Events extends Component {
	constructor() {
		super();

		this.getEvents = this.getEvents.bind(this);
		this.state = {
			eventsByDayArray: [],
			//allEvents: [],
			//fall: [],
			//winter: [],
			//spring: [],
			//summer: [],
			//springBreak: [],
			//winterBreak: [],
		};
	}

	componentDidMount() {
		this.getEvents();
	}

	getEvents = () => {
		axios.get('/locations')
			.then(result => {
				//console.log(result.data);
				var locationsData = [];
				result.data.forEach(function(location) { 
					locationsData[location.id] = location;
				});
				//console.log(locationsData);

				var options = {
			    params: {
			      sort: 'date'
			    }
			  }

				axios.get('/events', options)
					.then(result => {
						let eventsData = result.data.map(function(event) {
						  return {
						  	fb_id: event.fb_id,
						  	name: event.name,
						  	starts_at: event.starts_at,
						 		ends_at: event.ends_at,
						 		location_id: event.location_id,
						 		location: event.location_id ? locationsData[event.location_id].name : "",
					  		description: event.description,
					  		fb_event: event.fb_event,
					  		picture: event.picture,
					  		is_featured: event.is_featured,		
					   		updated_at: event.updated_at,
					  		created_at: event.created_at,
					  		period: event.period,
					  		week: event.week,
					  	}
					  });

					  /*TODO: also incorporate GET request for location to get location name with location_id*/
						
						// group by start date
					  function groupBy(arr, property) {
		  				return arr.reduce(function(memo, event) {
			    			if (!memo[event[property]]) { memo[event[property]] = []; }
			    				memo[event[property]].push(event);
			    				return memo;
			  			}, {});
						}

						function groupByDate(arr, date) {
		  				return arr.reduce(function(memo, event) {
		  					let startOfDate = (new Date(event[date])).setHours(0,0,0,0);
		  					//if (new Date() <= new Date(startOfDate)) {		// TODO: Fix this. Uncomment when have events in future!
				    			if (!memo[new Date(startOfDate)]) { memo[new Date(startOfDate)] = []; }
				    				memo[new Date(startOfDate)].push(event);
				    				return memo;
			    			//}
			  			}, {});
						}

						let eventsArray = groupByDate(eventsData, 'starts_at');
						//console.log(periodsArray);
					  /* Set respective arrays. */
					  
						this.setState({ 
							eventsByDayArray: eventsArray,
					  })

				  /*
				  	fall: periodsArray["Fall Quarter"],
				  	winter: periodsArray["Winter Quarter"],
				  	spring: periodsArray["Spring Quarter"],
				  	summer: periodsArray["Summer Quarter"],
				  	winterBreak: periodsArray["Winter Break"],
				  	springBreak: periodsArray["Spring Break"],
				  });*/
					//});
				})
				.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	}

	getFormattedDate = (date) => {
		let today = new Date();
		const month = date.toLocaleString('default', { month: 'long' });

		let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
		if (today.setHours(0,0,0,0) === date.setHours(0,0,0,0))
			return "Today, " + month + " " + date.getDate();
		else if (tomorrow.setHours(0,0,0,0) === date.setHours(0,0,0,0))
			return "Tomorrow, " + month + " " + date.getDate();
		else {
			let formattedDate = month + " " + date.getDate();
			if (today.getFullYear() !== date.getFullYear())
				formattedDate += ", " + date.getFullYear();
			return formattedDate;
		}
			
	}

	renderEventRows = () => {
		const { classes } = this.props;
		let eventRows = [];
		var dividerIndex = 0;

		for (var start_date in this.state.eventsByDayArray) {
	    if (this.state.eventsByDayArray.hasOwnProperty(start_date)) {
	        eventRows.push(<EventRow key={start_date} events={this.state.eventsByDayArray[start_date]} name={this.getFormattedDate(new Date(start_date))}/>)
	    		
	    		eventRows.push(<Divider key={dividerIndex} className={classes.line}></Divider>)
	    		dividerIndex++;
	    }
		}

		return eventRows;
	}


	render() {
		const { classes } = this.props;
		return (
			<div className={classes.container}>
				<div className={classes.whiteBackground}>
					<div className={classes.events}>
						{this.renderEventRows()}
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(EventsStyles)(Events);
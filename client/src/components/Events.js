import React, { Component } from 'react';
import EventRow from './EventRow.js'
import axios from 'axios';

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
				
				// group by start date
			  function groupBy(arr, property) {
  				return arr.reduce(function(memo, event) {
	    			if (!memo[event[property]]) { memo[event[property]] = []; }
	    				memo[event[property]].push(event);
	    				console.log(event);
	    				console.log(event[property]);
	    				return memo;
	  			}, {});
				}

				function groupByDate(arr, date) {
  				return arr.reduce(function(memo, event) {
  					let startOfDate = (new Date(event[date])).setHours(0,0,0,0);
  					console.log(new Date().setHours(0,0,0,0));
  					console.log(startOfDate);
  					//if (new Date().setHours(0,0,0,0) <= startOfDate) {		// TODO: Uncomment when have events in future!
		    			console.log("hi");
		    			if (!memo[new Date(startOfDate)]) { memo[new Date(startOfDate)] = []; }
		    				memo[new Date(startOfDate)].push(event);
		    				return memo;
	    			//}
	  			}, {});
				}

				let periodsArray = groupByDate(eventsData, 'starts_at');
				//console.log(periodsArray);
			  /* Set respective arrays. */
			  
				this.setState({ 
					eventsByDayArray: periodsArray,
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
	}

	getFormattedDate = (date) => {
		let today = new Date();
		const month = date.toLocaleString('default', { month: 'long' });

		let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
		if (today.setHours(0,0,0,0) == date.setHours(0,0,0,0))
			return "Today, " + month + " " + date.getDate();
		else if (tomorrow.setHours(0,0,0,0) == date.setHours(0,0,0,0))
			return "Tomorrow, " + month + " " + date.getDate();
		else {
			let formattedDate = month + " " + date.getDate();
			if (today.getFullYear() != date.getFullYear())
				formattedDate += ", " + date.getFullYear();
			return formattedDate;
		}
			
	}

	renderEventRows = () => {
		let eventRows = [];

		for (var start_date in this.state.eventsByDayArray) {
	    if (this.state.eventsByDayArray.hasOwnProperty(start_date)) {
	    		// add logic for formatting name
	        eventRows.push(<EventRow key={start_date} events={this.state.eventsByDayArray[start_date]} name={this.getFormattedDate(new Date(start_date))}/>)
	    }
		}

		return eventRows;
	}


	render() {
		return (
			<div>
				{
					this.renderEventRows()
				}
			</div>
		);
	}
}

export default Events;
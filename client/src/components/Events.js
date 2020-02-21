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
			fall: [],
			winter: [],
			spring: [],
			summer: [],
			springBreak: [],
			winterBreak: [],
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
	    			if (!memo[new Date(startOfDate)]) { memo[new Date(startOfDate)] = []; }
	    				memo[new Date(startOfDate)].push(event);
	    				return memo;
	  			}, {});
				}

				let periodsArray = groupByDate(eventsData, 'starts_at');
				console.log(periodsArray);
			  /* Set respective arrays. */
			  
				this.setState({ 
			  	//allEvents: eventsData,
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

	renderEventRows = () => {
		// loop thru all events, add events to array by date
		// if new start date, then make that event row
		let eventRows = [];

		for (var start_date in this.state.eventsByDayArray) {
	    if (this.state.eventsByDayArray.hasOwnProperty(start_date)) {
	        eventRows.push(<EventRow key={start_date} events={this.state.eventsByDayArray[start_date]} name={start_date}/>)
	    }
		}

		return eventRows;
		/*
		return this.state.allEvents.map(event => (
			<EventRow key={eventsOfDay[0]} events={eventsOfDay} name={eventsOfDay[2]}/>
		));*/
		/*return this.state.eventsByDayArray.map(eventsOfDay => (
			<EventRow key={eventsOfDay[fb_id]} events={eventsOfDay} name={eventsOfDay[starts_at]}/>
		));*/
	}


	render() {
		return (
			<div>
				{
					this.renderEventRows()
				}

				{/* We want to have a new row for each week within a period, which means that for each array we need to parse through by date to create a new event row and then within that row, organize by data. Note that arrays are already arranged by date. */}
				{/*
				<EventRow events={this.state.fall} name="Fall"/>
				<EventRow events={this.state.winter} name="Winter"/>
				<EventRow events={this.state.spring} name="Spring"/>
				<EventRow events={this.state.summer} name="Summer"/>
				<EventRow events={this.state.springBreak} name="Spring Break"/>
				<EventRow events={this.state.winterBreak} name="Winter Break"/>
				*/}
			</div>
		);
	}
}

export default Events;
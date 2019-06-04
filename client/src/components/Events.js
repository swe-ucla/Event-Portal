import React, { Component } from 'react';
import EventRow from './EventRow.js'
import axios from 'axios';

class Events extends Component {
	constructor() {
		super();

		this.getEvents = this.getEvents.bind(this);
		this.state = {
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
				let eventsData = result.data.map(function(event){
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

			  function groupBy(arr, property) {
  				return arr.reduce(function(memo, x) {
    			if (!memo[x[property]]) { memo[x[property]] = []; }
    				memo[x[property]].push(x);
    				return memo;
  				}, {});
				}

				let periodsArray = groupBy(eventsData, 'period');

			  /* Set respective arrays. */
			  this.setState({ 
			  	fall: periodsArray["Fall Quarter"],
			  	winter: periodsArray["Winter Quarter"],
			  	spring: periodsArray["Winter Quarter"],
			  	summer: periodsArray["Summer Quarter"],
			  	winterBreak: periodsArray["Winter Break"],
			  	springBreak: periodsArray["Spring Break"],
			  });
			})
			.catch(err => console.log(err));
	}


	render() {
		return (
			<div>
				{/* We want to have a new row for each week within a period, which means that for each array we need to parse through by date to create a new event row and then within that row, organize by data. Note that arrays are already arranged by date. */}
				<EventRow events={this.state.fall} name="Fall"/>
				<EventRow events={this.state.winter} name="Winter"/>
				<EventRow events={this.state.spring} name="Spring"/>
				<EventRow events={this.state.summer} name="Summer"/>
				<EventRow events={this.state.springBreak} name="Spring Break"/>
				<EventRow events={this.state.winterBreak} name="Winter Break"/>
			</div>
		);
	}
}

export default Events;
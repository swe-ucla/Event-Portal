import React, { Component } from 'react';
import EventRow from './EventRow.js'
import axios from 'axios';

class Events extends Component {
	constructor() {
		super();

		this.getEvents = this.getEvents.bind(this);
		this.state = {
			events: [],
		};
	}

	componentDidMount() {
		this.getEvents();
	}

	getEvents = () => {
		var options = {
			params: {
				sort: 'id',
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
			  		quarter: event.quarter,
			  	}
			  });
			  
			  this.setState({ events: eventsData });
			})
			.catch(err => console.log(err));
	}

	// const { classes } = this.props;
 //    var names = this.state.majors.map(major => {
 //      return <p key={major.id}>{major.id}, {major.name}, {major.ucla_id}</p>

	render() {
    var names = this.state.events.map(event => {
      return <p key={event.id}>{event.quarter}</p>
    });
		return (
			<div>
				<EventRow />
				<EventRow />
			</div>
		);
	}
}

export default Events;
import React, { Component } from 'react';
import EventRow from './EventRow.js'

class Events extends Component {
	constructor() {
		super();
	}
	render() {
		return (
			<div>
				<EventRow />
				<EventRow />
			</div>
		);
	}
}

export default Events;
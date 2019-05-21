import React, { Component } from 'react';
import MediaCard from './MediaCard.js'
import '../css/EventRow.css'

class EventRow extends Component {
	constructor() {
		super();
	}
	render() {
		return (
			<div>
				<p className='title'> 
					WEEK 1
				</p>
				<div className='row'>
					<MediaCard/>
					<MediaCard/>
					<MediaCard/>
					<MediaCard/>
				</div>
			</div>
		)
	}
}

export default EventRow;
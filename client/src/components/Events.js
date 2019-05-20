import React, { Component } from 'react';
import axios from 'axios';

import MediaCard from './MediaCard.js'
import '../css/Events.css'

class Events extends Component {
	constructor() {
		super();
		this.state = '';
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
		);
	}
}

export default Events;
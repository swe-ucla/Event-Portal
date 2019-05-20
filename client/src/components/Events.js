import React, { Component } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import Paper from '@material-ui/core/Paper';
import CardMedia from './CardMedia.js'

import ExampleDeleteFormStyles from '../styles/ExampleDeleteForm.js';
import ExampleGet from '../components/ExampleGet.js';

export const styles = {
  /* Styles applied to the root element. */
  root: {
    display: 'block',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  /* Styles applied to the root element if `component="video, audio, picture, iframe, or img"`. */
  media: {
    width: '100%',
  },
};

class Events extends Component {
	constructor() {
		super();

		this.state = '';
	}
	render() {
		return (
			<div>
				<CardMedia/>
				<CardMedia/>
				<CardMedia/>
			</div>
		);
	}
}

export default withStyles(ExampleDeleteFormStyles)(Events);
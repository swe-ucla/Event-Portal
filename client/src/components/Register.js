import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import ExamplePostFormStyles from '../styles/ExamplePostForm.js';
import {
	useMajors,
	useOccupations,
	useCheckboxes,
	useSelect,
} from '../utils/misc-hooks.js';

// const GOOGLE_BUTTON_ID = 'google-sign-in-button';

function Register(props) {
	const user_id = 3;
	const INITIAL_USER = {
		email: '',
		first_name: '',
		gpa: '',
		last_name: '',
		password: '',
		phone: '',
		swe_id: '',
		university_id: '',
		is_admin: false,
		occupation_ids: [], // array of occupations, each occupation has form { occupation_id: # }
		major_ids: [], // array of majors, each having for { major_id: # }
	};

	// get major and occupation information from database
	const { majors } = useMajors({});
	const { occupations } = useOccupations({});

	// create state for all information that will be submitted (for requests)
	// refer to state using 'userDetails', modify state using setUserDetails (works in the same way as setState)
	const [userDetails, setUserDetails] = useState(INITIAL_USER);

	useEffect(() => {
		// get user information if a user is logged in (from user_id)
		if (user_id) {
			axios
				.all([
					axios.get(`/users/${user_id}/id`),
					axios.get(`/users/${user_id}/occupations`),
					axios.get(`/users/${user_id}/majors`),
				])
				.then(result => {
					console.log(result);
					let user_data = { ...result[0].data[0] };
					let user_occupations = [...result[1].data];
					let user_majors = [...result[2].data];

					// console.log(user_data);
					// console.log(user_occupations);
					// console.log(user_majors);

					// update the state with the fetched data
					setUserDetails(prev => {
						return {
							...prev,
							...user_data,
							occupation_ids: user_occupations,
							major_ids: user_majors,
						};
					});
				})
				.catch(err => console.log(err));
		}
		return () => {
			setUserDetails(INITIAL_USER);
		};
	}, [user_id, setUserDetails]);

	// handle generic changes of form data
	const handleChange = event => {
		const target = event.target;
		setUserDetails(prev => {
			return {
				// ...prev ensures that all previous state still persists
				...prev,
				// overwrite [target.name] in the state
				[target.name]: target.value,
			};
		});
	};

	// handle POST request for new users
	const addUser = () => {
		// TODO: add support from server to handle the fields in userDetails
		console.log(userDetails);

		axios
			.post('/users/register', userDetails)
			.then(result => {
				console.log(result);
			})
			.catch(err => {
				console.log(err);
			});
	};

	const updateUser = () => {
		console.log(userDetails);

		// let insert_major_ids = userDetails.major_ids.filter(x => !initialDetails.major_ids.find(y => y.major_id === x.major_id))
		// let remove_major_ids = initialDetails.major_ids.filter(x => !userDetails.major_ids.find(y => y.major_id === x.major_id))
		// let insert_occupation_ids = userDetails.occupation_ids.filter(x => !initialDetails.occupation_ids.find(y => y.occupation_id === x.occupation_id))
		// let remove_occupation_ids = initialDetails.occupation_ids.filter(x => !userDetails.occupation_ids.find(y => y.occupation_id === x.occupation_id))

		axios
			.put(`/users/${user_id}`, userDetails)
			.then(result => {
				console.log(result);
			})
			.catch(err => {
				console.log(err);
			});
	};

	// handle submission of form data
	const handleSubmit = event => {
		// Prevent site refresh after submission
		event.preventDefault();
		if (user_id) {
			updateUser();
		} else {
			addUser();
		}
	};

	const { classes } = props;
	const {
		first_name,
		last_name,
		password,
		email,
		phone,
		university_id,
		swe_id,
		gpa,
		is_admin,
		occupation_ids,
		major_ids,
	} = userDetails;

	// map occupations to select options
	const { handleSelectChange, renderSelectOptions } = useSelect(setUserDetails);
	let occupation_names = renderSelectOptions(occupations, 'occupations');

	// map majors to checkboxes
	const { renderCheckboxes } = useCheckboxes(setUserDetails);
	let major_names = renderCheckboxes(majors, major_ids, 'major_ids');

	return (
		<main className={classes.main}>
			<Paper className={classes.paper}>
				<Typography component='h1' variant='h5'>
					Your Profile
				</Typography>
				<form className={classes.form} onSubmit={handleSubmit}>
					{/* <div id={GOOGLE_BUTTON_ID}/> */}
					<TextField
						required
						fullWidth
						id='first_name'
						name='first_name'
						label='First Name'
						className={classes.textField}
						placeholder='e.g. John'
						value={first_name || ''}
						onChange={handleChange}
						margin='normal'
					/>
					<TextField
						required
						fullWidth
						id='last_name'
						name='last_name'
						label='Last Name'
						className={classes.textField}
						placeholder='e.g. Doe'
						value={last_name || ''}
						onChange={handleChange}
						margin='normal'
					/>

					<TextField
						required
						fullWidth
						id='university_id'
						name='university_id'
						label='UCLA ID'
						className={classes.textField}
						placeholder='e.g. 123456789'
						value={university_id || ''}
						onChange={handleChange}
						margin='normal'
					/>

					<FormLabel component='legend'>Enter your year</FormLabel>
					<Select
						required
						fullWidth
						className={classes.select}
						value={occupation_ids[0] ? occupation_ids[0].occupation_id : 1}
						onChange={handleSelectChange}
						margin='normal'
						inputProps={{
							name: 'occupation_ids',
							id: 'occupation_ids',
						}}
					>
						{occupation_names}
					</Select>
					{/* <FormHelperText error className={classes.formHelperText}>
              {errorMessage}
            </FormHelperText> */}
					<TextField
						fullWidth
						id='email'
						name='email'
						label='Email'
						className={classes.textField}
						placeholder='e.g. example@example.com'
						value={email || ''}
						onChange={handleChange}
						margin='normal'
					/>
					<TextField
						fullWidth
						id='phone'
						name='phone'
						label='Phone Number'
						className={classes.textField}
						placeholder='e.g. 7778889999'
						value={phone || ''}
						onChange={handleChange}
						margin='normal'
					/>
					<TextField
						fullWidth
						id='swe_id'
						name='swe_id'
						label='SWE ID'
						className={classes.textField}
						placeholder='e.g. 408900876'
						value={swe_id || ''}
						onChange={handleChange}
						margin='normal'
					/>
					<TextField
						fullWidth
						id='gpa'
						name='gpa'
						label='GPA'
						className={classes.textField}
						placeholder='e.g. 4.00'
						value={gpa || ''}
						onChange={handleChange}
						margin='normal'
					/>
					<Typography component='h2' variant='h5'>
						Evening with Industry
					</Typography>
					<FormControl component='fieldset' className={classes.formControl}>
						<FormLabel component='legend'>Select your major(s)</FormLabel>
						<FormGroup></FormGroup>
					</FormControl>
					{major_names}
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						className={classes.submit}
						onClick={handleSubmit}
					>
						{user_id ? 'Update Profile' : 'Create Your Account'}
					</Button>
				</form>
			</Paper>
		</main>
	);
}

export default withStyles(ExamplePostFormStyles)(Register);

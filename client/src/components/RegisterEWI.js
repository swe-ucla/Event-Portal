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
import Input from "@material-ui/core/Input";
import CardMedia from "@material-ui/core/CardMedia";

import ExamplePostFormStyles from '../styles/ExamplePostForm.js';
import {
	useOccupations,
	useDiets,
	usePositions,
	useMajors,
	useCompanies,
	useCheckboxes,
	useSelect,
} from '../utils/misc-hooks.js';

function RegisterEWI(props) {
	const user_id = 1;
	const INITIAL_USER = {
		first_name: '',
		last_name: '',
		password: '',
		email: '',
		phone: '',
		university_id: '',
		swe_id: '',
		is_admin: false,
		is_national_swe_member: false,
		is_internationl: false,
		additional_diet: '',
		schedule_conflicts: '',
		occupation_ids: [], // array of occupations, each occupation has form { occupation_id: # }
		diet_ids: [],
		position_ids: [],
		major_ids: [], // array of majors, each having for { major_id: # }
		company_ids: [
			{ rank: 'First Choice' },
			{ rank: 'Second Choice' },
			{ rank: 'Third Choice' },
		],
		venmo_photo: '',
	};

	// get relevant information from database
	const { occupations } = useOccupations({});
	const { diets } = useDiets({});
	const { positions } = usePositions({});
	const { majors } = useMajors({});
	const { companies } = useCompanies({});

	// create state for all user information to be submitted to databse
	const [userDetails, setUserDetails] = useState(INITIAL_USER);

	useEffect(() => {
		axios
			.all([
				axios.get(`/users/${user_id}/id`),
				axios.get(`/users/${user_id}/occupations`),
				axios.get(`/users/${user_id}/diet`),
				axios.get(`/users/${user_id}/positions`),
				axios.get(`/users/${user_id}/majors`),
				axios.get(`/users/${user_id}/companies`),
			])
			.then(result => {
				console.log(result);
				let user_data = { ...result[0].data[0] };
				let user_occupations = [...result[1].data];
				let user_diets = [...result[2].data];
				let user_positions = [...result[3].data];
				let user_majors = [...result[4].data];
				let user_companies_temp = [...result[5].data];

				let user_companies = [
					{ rank: 'First Choice' },
					{ rank: 'Second Choice' },
					{ rank: 'Third Choice' },
					{ rank: 'Fourth Choice' },
					{ rank: 'Fifth Choice' }
				];
				user_companies_temp.forEach((company, index) => {
					user_companies[index].company_id = company.company_id;
				});

				// update the state with the fetched data
				setUserDetails(prev => {
					return {
						...prev,
						...user_data,
						occupation_ids: user_occupations,
						diet_ids: user_diets,
						position_ids: user_positions,
						major_ids: user_majors,
						company_ids: user_companies,
					};
				});
			})
			.catch(err => console.log(err));
		return () => {
			setUserDetails(INITIAL_USER);
		};
	}, [user_id, setUserDetails]);

	const handleChange = event => {
		const target = event.target;
		setUserDetails(prev => {
			return {
				...prev,
				[target.name]: target.value,
			};
		});
	};

	const handleCheckChange = event => {
		const target = event.target;
		setUserDetails(prev => {
			return {
				...prev,
				[target.name]: target.checked
			}
		})
	}

	const handleCompanyChange = event => {
		const target = event.target;
		console.log(target)
		const name = target.name;
		const field = name.substr(0, name.length - 1);
		const choice = parseInt(name.substr(name.length - 1));
		setUserDetails(prev => {
			let update = [...prev[`${field}s`]];
			console.log(update);
			update[choice][field] = parseInt(target.value);
			return {
				...prev,
				[`${field}s`]: update,
			};
		});
	};

	 const handlePhotoChange = name => input => {
        var reader = new FileReader();
        const _this = this;
        reader.onload = function(e) {
          _this.setState({venmo_photo: e.target.result});
        };

        reader.readAsDataURL(input.target.files[0]);
      }

	// handle POST request for new users
	const addUser = () => {
		// Add registration time as current time
		userDetails.registered_at = new Date(Date.now()).toISOString();
	
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
		// Add registration time as the current time
		userDetails.registered_at = new Date(Date.now()).toISOString();
		console.log(Date.now())
	
		console.log(userDetails);
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
		venmo_photo,
		is_admin,
		is_national_swe_member,
		is_international,
		additional_diet,
		schedule_conflicts,
		occupation_ids,
		diet_ids,
		position_ids,
		registered_at,
		major_ids,
		company_ids,
	} = userDetails;

	const { handleSelectChange, renderSelectOptions } = useSelect(setUserDetails);

	// map occupations to select options
	const occupation_names = renderSelectOptions(occupations, 'occupations');
	const company_names = renderSelectOptions(companies, 'companies');

	// create checkbox components
	const { renderCheckboxes } = useCheckboxes(setUserDetails);
	const diet_names = renderCheckboxes(diets, diet_ids, 'diet_ids');
	const position_names = renderCheckboxes(
		positions,
		position_ids,
		'position_ids',
	);
	const major_names = renderCheckboxes(majors, major_ids, 'major_ids');

	const company_fields = company_ids.map((company, index) => {
		const name = `company_id${index}`;
		return (
			<>
				<FormLabel>{`${company.rank} Company`}</FormLabel>
				<Select
					required
					fullWidth
					className={classes.select}
					value={company.company_id || ''}
					onChange={handleCompanyChange}
					inputProps={{
						name,
						id: name,
					}}
					margin='normal'
				>
					{company_names}
				</Select>
			</>
		);
	});

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
					<FormControl component='fieldset' className={classes.formControl}>
						<FormLabel component='legend'>Select your major(s)</FormLabel>
						<FormGroup>{major_names}</FormGroup>
						<Typography component='h2' variant='h5'>
							Evening with Industry
						</Typography>
						<FormLabel component='legend'>
							Select job level you are seeking
						</FormLabel>
						<FormGroup>{position_names}</FormGroup>

						<FormLabel component='legend'>Diet Preferences</FormLabel>
						<FormGroup>{diet_names}</FormGroup>
					</FormControl>
					<Typography component='h2' variant='h5'>
						Company choices
					</Typography>
					{company_fields}
					<Typography component='h2' variant='h5'>
						Additional Information
					</Typography>
					<FormLabel component="legend">Are you an international student?</FormLabel>
					<FormControlLabel
						control={<Checkbox
							checked={is_international || false}
							onChange={handleCheckChange}
							name="is_international" />}
						label="Yes"
					/>
					<FormLabel component="legend">Are you an national SWE member?</FormLabel>
					<FormControlLabel
						control={<Checkbox
							checked={is_national_swe_member || false}
							onChange={handleCheckChange}
							name="is_national_swe_member" />}
						label="Yes"
					/>
					<br />
					<FormLabel id="demo-simple-select-label">Venmo Payment Screenshot</FormLabel>
					<br />
                    <Input type="file" disableUnderline="true" accept="image/*" onChange={handlePhotoChange()}/>
                    <CardMedia
                      style={{width: '350px', height: '197px'}}
                      component="img"
                      image={venmo_photo}
                      title="Uploaded Image"
                    />
					<TextField
						fullWidth
						id='additional_diet'
						name='additional_diet'
						label='Additional Dietary Restrictions'
						className={classes.textField}
						value={additional_diet || ''}
						onChange={handleChange}
						margin='normal'
					/>
					<TextField
						fullWidth
						id='schedule_conflicts'
						name='schedule_conflicts'
						label='Schedule Conflicts'
						className={classes.textField}
						value={schedule_conflicts || ''}
						placeholder='Please let us know if you have any schedule conflicts with the event'
						onChange={handleChange}
						margin='normal'
					/>
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

export default withStyles(ExamplePostFormStyles)(RegisterEWI);
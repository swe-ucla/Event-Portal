import React, { useState, useEffect } from 'react';
import axios from 'axios';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export const useMajors = initialState => {
	const [majors, setMajors] = useState(initialState);

	useEffect(() => {
		axios
			.get('/majors')
			.then(result => {
				let major_data = {};
				result.data.forEach(major => {
					major_data[major.id] = major.name;
				});
				console.log(major_data);
				setMajors({ ...major_data });
			})
			.catch(err => console.log(err));
		return () => {
			setMajors({});
		};
	}, []);

	return {
		majors,
	};
};

export const useOccupations = initialState => {
	const [occupations, setOccupations] = useState(initialState);

	useEffect(() => {
		axios
			.get('/occupations')
			.then(result => {
				let occupation_data = {};
				result.data.forEach(occupation => {
					occupation_data[occupation.id] = occupation.name;
				});
				console.log(occupation_data);
				setOccupations(occupation_data);
			})
			.catch(err => console.log(err));
		return () => {
			setOccupations({});
		};
	}, []);

	return {
		occupations,
	};
};

export const useDiets = initialState => {
	const [diets, setDiets] = useState(initialState);

	useEffect(() => {
		axios
			.get('/diet')
			.then(result => {
				let diet_data = {};
				diet_data.forEach(diet => {
					diet_data[diet.id] = diet.type;
				});
				console.log(diet_data);
				setDiets(diet_data);
			})
			.catch(err => console.log(err));
		return () => {
			setDiets({});
		};
	}, []);

	return {
		diets,
	};
};

export const usePositions = initialState => {
	const [positions, setPositions] = useState(initialState);

	useEffect(() => {
		axios
			.get('/positions')
			.then(result => {
				let position_data = {};
				result.data.forEach(position => {
					position_data[position.id] = position.role;
				});
				console.log(position_data);
				setPositions(position_data);
			})
			.catch(err => console.log(err));
		return () => {
			setPositions({});
		};
	}, []);

	return {
		positions,
	};
};

export const useCompanies = initialState => {
	const [companies, setCompanies] = useState(initialState);

	useEffect(() => {
		axios
			.get('/companies')
			.then(result => {
				let companies_data = {};
				result.data.forEach(company => {
					companies_data[company.id] = company.name;
				});
				console.log(companies_data);
				setCompanies(companies_data);
			})
			.catch(err => console.log(err));
		return () => {
			setCompanies({});
		};
	}, []);

	return {
		companies,
	};
};

export const useCheckboxes = setDetails => {
	const handleCheckboxChange = event => {
		const value = parseInt(event.target.value);
		const name = event.target.name;
		const field = name.substr(0, name.length - 1);

		setDetails(prev => {
			let removed = false;
			const prevIds = prev[name];
			// if the id exists in the array of ids then remove it
			let ids = prevIds.filter(id => {
				if (id[field] === value) {
					removed = true;
				}
				return id[field] !== value;
			});

			// if the id is not found in ids then add it
			if (!removed) {
				ids.push({
					[field]: value,
				});
			}
			console.log(ids);

			// return the updated state
			return {
				...prev,
				[name]: [...ids],
			};
		});
	};

	const renderCheckboxes = (ids, state, name) => {
		const field = name.substr(0, name.length - 1);
		let checkboxes = [];
		for (let id in ids) {
			checkboxes.push(
				<FormControlLabel
					control={
						<Checkbox
							name={name}
							value={id}
							checked={
								// checkbox should be checked if the id exits in the major_ids array
								state.find(state_item => state_item[field] === parseInt(id)) ===
								undefined
									? false
									: true
							}
							onChange={handleCheckboxChange}
						/>
					}
					label={ids[id]}
					key={id}
				/>,
			);
		}
		return checkboxes;
	};

	return {
		renderCheckboxes,
	};
};

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from "react-csv";

import { Typography, Checkbox } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core/styles';
import { useCompanies, useDiets } from '../utils/misc-hooks';

function UsersSummary(props) {
	const [users, setUsers] = useState([]);
	const [csvData, setCSVData] = useState([]);
	const [loading, setLoading] = useState(true);

	const diets = useDiets({});
	const { companies } = useCompanies({});

	useEffect(() => {
		axios
			.get('/users')
			.then(result => {
				console.log(result);
				let user_ids = [...result.data];
				return user_ids;
			})
			.then(users => {
				users.forEach((user, index) => {
					const id = user.id;
					axios
						.all([
							axios.get(`/users/${id}/id`),
							axios.get(`/users/${id}/events`),
							axios.get(`/users/${id}/past`),
							axios.get(`/users/${id}/diet`),
							axios.get(`/users/${id}/companies`)
						])
						.then(result => {
							console.log(result);
							console.log("hello")
							const user_data = { ...result[0].data[0] };
							console.log(user_data)
							const { first_name, last_name, email, is_national_swe_member, registered_at, payment_made, additional_diet } = user_data;
							const events = [...result[1].data];
							const past = [...result[2].data];
							const diets = [...result[3].data];
							let companies_data = [...result[4].data];
							let diet_ids = [];
							console.log(diets)
							for (const diet_obj of diets) {
								diet_ids.push(diet_obj.diet_id);
							}
							console.log(events);
							let user_companies = [];
							console.log(companies)
							console.log(companies_data)
							companies_data.forEach((company) => {
								user_companies.push(company.company_id);
							})
							while (user_companies.length < 5) {
								user_companies.push(null);
							}
							console.log(user_companies);

							setUsers(prev => {
								return [
									...prev,
									{
										id,
										first_name,
										last_name,
										email,
										is_national_swe_member,
										registration_date: new Intl.DateTimeFormat('en-US').format(new Date(registered_at)),
										payment_made,
										additional_diet,
										events: events.length,
										past: past.length,
										diet_ids,
										user_companies
									},
								];
							});
							return index;
						})
						.then(result => {
							if (result === users.length - 1) {
								setLoading(false);
							}
						})
						.catch(err => {
							console.log(err);
						});
				});
			})
			.catch(err => {
				console.log(err);
			});
		return () => {
			setUsers([]);
			setLoading(true);
		};
	}, [setUsers, setLoading]);

	const getCSVData = () => {
		console.log(users)
		let rows = [
			["Registration Date", "First Name", "Last Name", "Email", "National SWE Member", "First Choice", "Second Choice", "Third Choice", "Fourth Choice", "Fifth Choice"]
		];
		users.forEach((user) => {
			const { registration_date, first_name, last_name, email, is_national_swe_member, user_companies } = user;
			let companyNames = user_companies.map((id) => {
				return companies[id] || "None";
			})
			let row = [
				registration_date,
				first_name,
				last_name,
				email,
				is_national_swe_member ? "Yes" : "No",
				...companyNames
			];
			console.log(row);
			rows.push(row);
		});
		setCSVData(rows);
	}

	useEffect(() => {
		getCSVData();
	}, [loading])

	console.log(csvData);

	const handleCheckChange = event => {
		const target = event.target;
		const name = target.name;
		const id = parseInt(name.split('-')[1]);
		setUsers(prev => {
			const update = prev.map((user) => {
				if (user.id === id) {
					user.payment_made = target.checked;
					updateUserPayment(id, user, target.checked);
				}
				return user;
			})
			return update;
		})
	}

	const updateUserPayment = (user_id, userDetails, payment_made) => {
		userDetails.payment_made = payment_made
		axios
			.put(`/users/${user_id}`, userDetails)
			.then(result => {
				console.log(result);
			})
			.catch(err => {
				console.log(err);
			});
	};

	const entries = users.map(user => (
		<TableRow key={user.id}>
			<TableCell component='th' scope='row'>
				{`${user.first_name} ${user.last_name}`}
			</TableCell>
			<TableCell>{user.registration_date}</TableCell>
			<TableCell align='center'>
				<Checkbox disabled checked={user.is_national_swe_member} />
			</TableCell>
			<TableCell align='center'>
				<Checkbox
					name={`payment-${user.id}`}
					onChange={(event) => {
						const confirmMsg = event.target.checked ?
							`Are you sure you want to verify ${user.first_name} ${user.last_name}'s payment?` :
							`Are you sure you want to revoke ${user.first_name} ${user.last_name}'s payment verification?`;
						if (window.confirm(confirmMsg)) {
							handleCheckChange(event);
						}
					}}
					checked={user.payment_made} />
			</TableCell>
			<TableCell align='center'>{user.events}</TableCell>
			<TableCell align='center'>{user.past}</TableCell>
			<TableCell align='center'>
				<Checkbox disabled checked={user.diet_ids.includes(2)} />
			</TableCell>
			<TableCell align='center'>{user.additional_diet || 'None'}</TableCell>
		</TableRow>
	));

	return (
		<>
			{loading ? (
				<Typography>Loading...</Typography>
			) : (
				<Paper>
					<CSVLink data={csvData} filename="EWI_Data.csv">Download Me</CSVLink>
					<Table aria-label='summary table'>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Registration Date</TableCell>
								<TableCell align='center'>National SWE Member</TableCell>
								<TableCell align='center'>Payment Verified</TableCell>
								<TableCell align='center'>Events Attending</TableCell>
								<TableCell align='center'>Past Events Attended</TableCell>
								<TableCell align='center'>Vegetarian?</TableCell>
								<TableCell align='center'>Additional Diet Restrictions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>{entries}</TableBody>
					</Table>
				</Paper>
			)}
		</>
	);
}

export default withStyles()(UsersSummary);

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Typography, Checkbox } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core/styles';

function UsersSummary(props) {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

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
						])
						.then(result => {
							console.log(result);
							const user_data = { ...result[0].data[0] };
							const { first_name, last_name, created_at } = user_data;
							const events = [...result[1].data];
							const past = [...result[2].data];
							console.log(events);
							setUsers(prev => {
								return [
									...prev,
									{
										id,
										first_name,
										last_name,
										registration_date: new Intl.DateTimeFormat('en-US').format(new Date(created_at)),
										events: events.length,
										past: past.length,
										paymentMade: false,
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

	const handleCheckChange = event => {
		const target = event.target;
		const name = target.name;
		const id = parseInt(name.split('-')[1]);
		setUsers(prev => {
			const update = prev.map((user) => {
				if (user.id === id) {
					user.paymentMade = target.checked;
				}
				return user;
			})
			return update;
		})
	}

	const entries = users.map(user => (
		<TableRow key={user.id}>
			<TableCell component='th' scope='row'>
				{`${user.first_name} ${user.last_name}`}
			</TableCell>
			<TableCell>{user.registration_date}</TableCell>
			<TableCell align='center'>{user.events}</TableCell>
			<TableCell align='center'>{user.past}</TableCell>
			<TableCell align='center'>
				<Checkbox disabled checked={user.past > 6} />
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
					checked={user.paymentMade} />
			</TableCell>
		</TableRow>
	));

	return (
		<>
			{loading ? (
				<Typography>Loading...</Typography>
			) : (
					<Paper>
						<Table aria-label='summary table'>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>Registration Date</TableCell>
									<TableCell align='center'>Events Attending</TableCell>
									<TableCell align='center'>Past Events Attended</TableCell>
									<TableCell align='center'>Member</TableCell>
									<TableCell align='center'>Payment Verified</TableCell>
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

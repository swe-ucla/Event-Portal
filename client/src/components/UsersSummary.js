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
							const { first_name, last_name } = user_data;
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
										events: events.length,
										past: past.length,
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

	const entries = users.map(user => (
		<TableRow key={user.id}>
			<TableCell component='th' scope='row'>
				{`${user.first_name} ${user.last_name}`}
			</TableCell>
			<TableCell align='center'>{user.events}</TableCell>
			<TableCell align='center'>{user.past}</TableCell>
			<TableCell align='center'>
				<Checkbox checked={user.past > 6} />
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
								<TableCell align='center'>Events Attending</TableCell>
								<TableCell align='center'>Past Events Attended</TableCell>
								<TableCell align='center'>Member</TableCell>
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

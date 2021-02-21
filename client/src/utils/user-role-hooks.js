import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const useAdmin = initialState => {
	const [admin, setAdmin] = useState(null);

	useEffect(() => {
		//axios.get('/users/session')
		//.then(result => {
			//result.data.forEach(function(user) {
				axios.get('/users/'+ 1 + '/id')
					.then(result => {
						result.data.forEach(function(user) {
							setAdmin(user.is_admin)
						})
					})
					//.catch(err => console.log(err));
			//})
		//})
		.catch(err => console.log(err));
		return () => {
			setAdmin({});
		};
	}, []);

	console.log(admin)

	return {
		admin,
	};
};

export const useUserId = initialState => {
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		//axios.get('/users/session')
		//.then(result => {
			//result.data.forEach(function(user) {
				axios.get('/users/'+ 1 + '/id')
					.then(result => {
						result.data.forEach(function(user) {
							setUserId(user.id)
						})
					})
					//.catch(err => console.log(err));
			//})
		//})
		.catch(err => console.log(err));
		return () => {
			setUserId({});
		};
	}, []);

	console.log(userId)

	return {
		userId,
	};
};
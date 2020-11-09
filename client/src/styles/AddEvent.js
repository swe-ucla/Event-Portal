const AddEventStyles = theme => ({
	form: {
		marginTop: '50px',
		marginBottom: '200px',
		width: '75%',
		//height: '1000px',
		position: 'absolute', left: '50%',
        transform: 'translate(-50%)',
        borderStyle: 'solid',
        padding: '10px',
	},
	name: {
		marginBottom: '20px',
	},
	period: {
		minWidth: '160px',
		marginRight: '10px',
	},
	week: {
		minWidth: '80px',
	},
	description: {
	    //width: '95%',
		marginTop: '20px',
		marginBottom: '20px',
	},
	btnDiv: {
		margin: 'auto',
		width: '200px',
	},
	categories: {
		overflowY: 'scroll',
		position: 'relative',
    	height: '260px',
		width: '100%',
		marginBottom: '20px',
	},
});

export default AddEventStyles;
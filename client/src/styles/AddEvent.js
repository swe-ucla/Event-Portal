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
	},
	btnDiv: {
		margin: 'auto',
		width: '200px',
	},
	categories: {
		overflow: 'auto',
		position: 'relative',
    	maxHeight: '300px',
    	maxWidth: '180px',
    	width: '100%',
    	border: '2px',
	},
});

export default AddEventStyles;
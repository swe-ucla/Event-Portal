const EventRowStyles = theme => ({
	title: {
		padding: '10px',
		marginTop: '40px',
		fontSize: '30px',
		fontWeight: 'bold',
		fontFamily: 'Times New Roman',
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		overflowX: 'auto',
		minWidth: '100%',
  	minHeight: '330px',
	},
	'&::-webkit-scrollbar': {
		display: 'none',
	}
});

export default EventRowStyles;
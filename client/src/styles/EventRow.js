const EventRowStyles = theme => ({
	title: {
		padding: '0px',
		marginTop: '0px',
		fontSize: '30px',
		fontWeight: 'bold',
		fontFamily: 'Helvetica Neue',
	},
	row: {
		marginTop: '-18px',
		marginLeft: '-6px',
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
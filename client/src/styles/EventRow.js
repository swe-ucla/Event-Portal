const EventRowStyles = theme => ({
	title: {
		fontSize: '30px',
		fontWeight: 'bold',
		fontFamily: 'Helvetica Neue',
	},
	row: {
		marginTop: '-18px',
		marginLeft: '-14px',
		marginRight: '-14px',
		//display: 'flex',
		//flexDirection: 'row',
		//justifyContent: 'flex-start',
		overflowX: 'auto',
		//minWidth: '100%',
		//width: '100%',
  		minHeight: '330px',
	},
	'&::-webkit-scrollbar': {
		display: 'none',
	}
});

export default EventRowStyles;
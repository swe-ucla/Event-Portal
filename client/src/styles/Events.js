const EventsStyles = theme => ({
	container: {
		backgroundImage: 'url(' + require('../gears-background.png') + ')',
	},
	pastEventsButton: {
		alignSelf: 'center',
		width: '10em',
		border: 'none',
		outline: 'none',
		cursor: 'pointer',
		'&:hover': {
			textShadow: '0px 0px 0.1px black',
		},
	},
	buttonLabel: {
		margin: '5px',
		color: '#C4C4C4',
		fontSize: '0.9em',
		fontFamily: 'Helvetica Neue',
	},
	whiteBackground: {
		paddingTop: '60px',
		paddingBottom: '60px',
		marginLeft: '125px',
		marginRight: '125px',
		backgroundColor: '#FFFFFF',
		display: 'flex',
		flexDirection: 'column',
	},
	events: {
		marginLeft: '60px',
		marginRight: '60px',
	},
	line: {
		marginTop: '30px',
		marginBottom: '40px',
	}
});

export default EventsStyles;
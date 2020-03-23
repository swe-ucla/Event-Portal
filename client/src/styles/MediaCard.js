const MediaCardStyles = theme => ({
	eventName: {
		fontSize: '40px',
		fontWeight: 'bold',
	},
	description: {
		fontSize: '20px',
	},
	card: {
  	//width: '500px',
  	//minWidth: '500px',
    //width: '400px',
    //minWidth: '400px',
    //maxWidth: '400px',
    width: '350px',
  	//height: '400px',
    //maxHeight: '400px',
  	margin: '10px',
    backgroundColor: '#EBE6FB',
    borderRadius: '13px',
	},
  media: {
    height: '200px',
    width: '350px',
  },
  info: {
    height: '300px',
  },
  date: {
    //paddingTop: '20px',
  },
  text: {
    padding: '18px',
  },
  timeText: {
    color: '#441AEA',
    fontFamily: 'Helvetica Neue',
    fontSize: '14px',
  },
  nameText: {
    fontFamily: 'Helvetica Neue',
    //fontSize: '40px',
    fontWeight: 'bold',
    fontSize: '26px',
    lineHeight: '1.5em',
    height: '3em',
    //webKitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  locationText: {
    fontFamily: 'Helvetica Neue',
    color: '#726AA3',
    fontSize: '15px',
  },
  descripText: {
    marginTop: '5px',
    fontFamily: 'Helvetica Neue',
  },
  descripTextHide: {
    marginTop: '5px',
    fontFamily: 'Helvetica Neue',
    display: 'none',
  },
  line: {
    marginLeft: '20px',
    marginRight: '20px',
  },
  registerBtn: {
    backgroundColor: '#817AAE',
    color: '#FFFFFF',
    borderRadius: '15px',
    fontFamily: 'Helvetica Neue',
    width: '100px',
    textTransform: 'none',
    marginTop: '5px',
    marginBottom: '5px',
    margin: 'auto',
  },
  registeredBtn: {
    backgroundColor: '#A5A5A5',
    color: '#FFFFFF',
    borderRadius: '15px',
    fontFamily: 'Helvetica Neue',
    width: '100px',
    textTransform: 'none',
    marginTop: '5px',
    marginBottom: '5px',
    margin: 'auto',
  }
})

export default MediaCardStyles;
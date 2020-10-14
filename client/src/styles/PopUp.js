const PopUpStyles = theme => ({
    popUp: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20%',
        width: '40%',
        outline: 'none',
        borderRadius: '5px',
        backgroundColor: theme.palette.background.paper,
    },

    popUpForm: {
        display: 'flex',
        flexDirection: 'column',
    },

    popUpLabel: {
        display: 'flex',
        justifyContent: 'center',
    },


});

export default PopUpStyles;
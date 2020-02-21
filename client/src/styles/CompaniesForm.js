const CompaniesFormStyles = theme => ({
  appBar: {
    position: 'relative',
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    backgroundColor: '#F3F2F6',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 3,
      marginBottom: theme.spacing.unit * 12,
      padding: theme.spacing.unit * 3,
    },
    boxShadow: 'none'
    //square: 'false'
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  textField: {
    backgroundColor: '#F3F2F6',
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    padding: '0'
  }
});

export default CompaniesFormStyles;
const appStyles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  container: {
    display: 'block',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  get: {
    marginTop: theme.spacing.unit * 3,
  }
});

export default appStyles;

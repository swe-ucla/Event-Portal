import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import AddEventStyles from '../styles/AddEvent.js'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
/*
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';*/


/*
    - Name
    - EWI?
    - Start time
    - End time
    - Period
    - Week 
    - location_id —> need to maybe post a new location
    - Description
    - fb_event link
    - is_featured?
*/

const periods = [
  { value: 'Fall Quarter', label: 'Fall Quarter' },
  { value: 'Winter Quarter', label: 'Winter Quarter' },
  { value: 'Spring Quarter', label: 'Spring Quarter' },
  { value: 'Winter Break', label: 'Winter Break' },
  { value: 'Spring Break', label: 'Spring Break' },
  { value: 'Summer', label: 'Summer' },
];

const weeks = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: 'Finals' },
];

function AddEvent(props) {
	const { classes } = props;
  const [locations, setLocatons] = React.useState(null);
  const [period, setPeriod] = React.useState('');
  const [week, setWeek] = React.useState('');
  const [isEWI, setIsEWI] = React.useState('No');
  const [isFeatured, setIsFeatured] = React.useState('No');
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  useEffect(() => {
    getLocations();
  }, []);

  const getLocations = () => {
    axios.get('/locations')
      .then(result => {
        let locationsData = result.data.map(function(location) {
          return {
            id: location.id,
            name: location.name,
            address_id: location.address_id,
            description: location.description,
            updated_at: location.updated_at,
            created_at: location.created_at,
          }
        });

        setLocatons(locationsData);
      })
      .catch(err => console.log(err));
  }


	const handleChange = (event, field) => {
    if (!field.localeCompare("period"))
      setPeriod(event.target.value);
    else if (!field.localeCompare("week"))
      setWeek(event.target.value);
    else if (!field.localeCompare("isEWI"))
      setIsEWI(event.target.value);
    else if (!field.localeCompare("isFeatured"))
      setIsFeatured(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const parseLinkForID = (eventURL) => {
    // Assumes some form like: https://www.facebook.com/events/3373102776039760/
    var baseURL = "facebook.com/events/";
    var start = eventURL.search(baseURL);
    if (start == -1) return "not found";
    start += baseURL.length;

    var end = eventURL.indexOf('/', start);
    if (end == -1) end = eventURL.length;

    console.log(eventURL.substring(start, end));
    return eventURL.substring(start, end);
  }

  const addEvent = () => {
    console.log('add');
  }

	return (
		<form noValidate autoComplete="off">
      <div>
        {/*<TextField required id="standard-required" label="Required" defaultValue="Hello World" helperText="Facebook Event ID"/>*/}
        <TextField required id="standard-required" label="Required" defaultValue="Hello World" helperText="Event Name"/>
      </div>
      <FormControl component="fieldset">
        <FormLabel component="legend">EWI?</FormLabel>
        <RadioGroup aria-label="Is this event EWI?" name="ewi" value={isEWI} onChange={(e) => handleChange(e, "isEWI")}>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
      <Grid container justify="space-around">
          <TextField
            id="date"
            label="Date"
            type="date"
            defaultValue="2017-05-24"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="time"
            label="Start time"
            type="time"
            defaultValue="07:30"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
          <TextField
            id="time"
            label="End time"
            type="time"
            defaultValue="07:30"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
      </Grid>
      <div>
      	<TextField select value={period} onChange={(e) => handleChange(e, "period")} helperText="Period">
      		{periods.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      	</TextField>
        <TextField select value={week} onChange={(e) => handleChange(e, "week")} helperText="Week">
          {weeks.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div>
        {/*<TextField required id="standard-required" label="Required" helperText="Location">
        </TextField>*/}
        {/*<input type="search" list="languages" placeholder="Pick a programming language.."/>*/}

        <datalist id="languages">
          <option value="PHP" />
          <option value="C++" />
          <option value="Java" />
          <option value="Ruby" />
          <option value="Python" />
          <option value="Go" />
          <option value="Perl" />
          <option value="Erlang" />
        </datalist>
      </div>
      <div>
        <TextField required id="standard-required" label="Required" defaultValue="Hello World" helperText="Facebook Event Link"/>
      </div>
      <div>
        <TextField required id="standard-required" label="Required" defaultValue="Hello World" helperText="Description" multiline/>
      </div>
      <FormControl component="fieldset">
        <FormLabel component="legend">Featured Event?</FormLabel>
        <RadioGroup aria-label="Is this event featured?" name="featured" value={isFeatured} onChange={(e) => handleChange(e, "isFeatured")}>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
      <div>
        <Button variant="contained" onClick={addEvent}>Add</Button>
      </div>
    </form>
	);
}

export default withStyles(AddEventStyles)(AddEvent);
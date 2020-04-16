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
import Switch from '@material-ui/core/Switch';
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

   REQUIRED:
   event_id, name, starts_at, ends_at, period
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
  const [name, setName] = React.useState('');
  const [locations, setLocatons] = React.useState(null);
  const [period, setPeriod] = React.useState('');
  const [week, setWeek] = React.useState('');
  const [isEWI, setIsEWI] = React.useState(false);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date().toISOString().substring(0,10));
  const [startTime, setStartTime] = React.useState("12:00");
  const [endDate, setEndDate] = React.useState(new Date().toISOString().substring(0,10));
  const [endTime, setEndTime] = React.useState("19:00");
  const [isSameDay, setIsSameDay] = React.useState(true);
  const [description, setDescription] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [link, setLink] = React.useState('');
  const [img, setImg] = React.useState('');

  useEffect(() => {
    /* TODO: do check for admin */
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
    if (!field.localeCompare("name"))
      setName(event.target.value);
    else if (!field.localeCompare("period"))
      setPeriod(event.target.value);
    else if (!field.localeCompare("week"))
      setWeek(event.target.value);
    else if (!field.localeCompare("isEWI")) {
      setIsEWI(event.target.value.localeCompare("Yes") == 0 ? true : false);
      setName("Evening With Industry");
    }
    else if (!field.localeCompare("isFeatured")) 
      setIsFeatured(event.target.value.localeCompare("Yes") == 0 ? true : false);
    else if (!field.localeCompare("isSameDay"))
      setIsSameDay(event.target.checked);
    else if (!field.localeCompare("startDate"))
      setStartDate(event.target.value);
    else if (!field.localeCompare("startTime"))
      setStartTime(event.target.value);
    else if (!field.localeCompare("endDate"))
      setEndDate(event.target.value);
    else if (!field.localeCompare("endTime"))
      setEndTime(event.target.value);
    else if (!field.localeCompare("location"))
      setLocation(event.target.value);
    else if (!field.localeCompare("link"))
      setLink(event.target.value);
    else if (!field.localeCompare("img"))
      setImg(event.target.value);
    else if (!field.localeCompare("description"))
      setDescription(event.target.value);
  };

  const parseLinkForID = (eventURL) => {
    // Assumes some form like: https://www.facebook.com/events/3373102776039760/
    var baseURL = "facebook.com/events/";
    var start = eventURL.search(baseURL);
    if (start == -1) return "";
    start += baseURL.length;

    var end = eventURL.indexOf('/', start);
    if (end == -1) end = eventURL.length;

    console.log(eventURL.substring(start, end));
    return eventURL.substring(start, end);
  }

  const addEvent = () => {
    /* TODO: do check for admin */
    console.log('add');
    var validFields = true;

    // Checks for fields:
    var id = parseLinkForID(link);
    if (id.length == 0) {
      validFields = false;
      console.log("Invalid ID");
    }

    var starts = startDate + " " + startTime + ":00";
    var ends = ((isSameDay) ? startDate : endDate) + " " + endTime + ":00";

    // Post to database
    if (validFields) {
      axios.post('/events', {
        "event_id": id,
        "name": name,
        "starts_at": starts,
        "ends_at": ends,
        "location_id": "1",
        "description": description,
        "fb_event": link,
        "picture": img,
        "is_featured": isFeatured,
        "categories": ["7", "11"],
        "companies": ["39", "1"],
        "hosts": ["1", "2", "3"],
        "period": period,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

	return (
		<form className={classes.form} noValidate autoComplete="off">
      <div>
        {/*<TextField required id="standard-required" label="Required" defaultValue="Hello World" helperText="Facebook Event ID"/>*/}
        <TextField className={classes.name} fullWidth required disabled={isEWI} id="standard-required" label="Event Name" value={name} onChange={(e) => handleChange(e, "name")}/>
      </div>
      <Grid container spacing={32} justify="flex-start">
        <Grid item>
          <FormControl component="fieldset">
            <FormLabel component="legend">EWI?</FormLabel>
            <RadioGroup aria-label="Is this event EWI?" name="ewi" value={isEWI ? "Yes" : "No"} onChange={(e) => handleChange(e, "isEWI")}>
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl component="fieldset">
            <FormLabel component="legend">Featured Event?</FormLabel>
            <RadioGroup aria-label="Is this event featured?" name="featured" value={isFeatured ? "Yes" : "No"} onChange={(e) => handleChange(e, "isFeatured")}>
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={16} justify="flex-start">
        <Grid item>
          <TextField
            id="date"
            required
            label={isSameDay ? "Date" : "Start Date"}
            type="date"
            value={startDate}
            onChange={(e) => handleChange(e, "startDate")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            id="time"
            required
            label="Start time"
            type="time"
            value={startTime}
            onChange={(e) => handleChange(e, "startTime")}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </Grid>
        {!isSameDay && (
        <Grid item>
          <TextField
            id="date"
            required
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => handleChange(e, "endDate")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        )}
        <Grid item>
          <TextField
            id="time"
            required
            label="End time"
            type="time"
            value={endTime}
            onChange={(e) => handleChange(e, "endTime")}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Switch checked={isSameDay} onChange={(e) => handleChange(e, "isSameDay")} name="sameDayCheck"/>}
            label="Same Day"
          />
        </Grid>
      </Grid>
      <div>
      	<TextField required className={classes.period} select value={period} onChange={(e) => handleChange(e, "period")} label="Period">
      		{periods.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      	</TextField>
        <TextField className={classes.week} select value={week} onChange={(e) => handleChange(e, "week")} label="Week">
          {weeks.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div>
        <TextField required id="standard-required" label="Location" value={location} onChange={(e) => handleChange(e, "location")}/>
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
        <TextField className={classes.link} fullWidth required id="standard-required" label="Facebook Event Link" value={link} onChange={(e) => handleChange(e, "link")}/>
      </div>
      <div>
        <TextField className={classes.img} fullWidth required id="standard-required" label="Image URL" value={img} onChange={(e) => handleChange(e, "img")}/>
      </div>
      <div>
        <TextField
          className={classes.description} 
          id="outlined-multiline-static"
          label="Description"
          value={description}
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          onChange={(e) => handleChange(e, "description")}
        />
      </div>
      <div className={classes.btnDiv}>
        <Button variant="contained" onClick={addEvent}>Add Event</Button>
      </div>
    </form>
	);
}

export default withStyles(AddEventStyles)(AddEvent);
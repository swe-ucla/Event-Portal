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
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

const filter = createFilterOptions();

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
  const [nameErr, setNameErr] = React.useState(false);
  const [dbLocations, setDBLocations] = React.useState([]);
  const [dbAddresses, setDBAddresses] = React.useState([]);
  const [dbCategories, setDBCategories] = React.useState([]);
  const [period, setPeriod] = React.useState('');
  const [periodErr, setPeriodErr] = React.useState(false);
  const [week, setWeek] = React.useState('');
  const [isEWI, setIsEWI] = React.useState(false);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date().toISOString().substring(0,10));
  const [startTime, setStartTime] = React.useState("12:00");
  const [endDate, setEndDate] = React.useState(new Date().toISOString().substring(0,10));
  const [endTime, setEndTime] = React.useState("19:00");
  const [isSameDay, setIsSameDay] = React.useState(true);
  const [timeErr, setTimeErr] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [location, setLocation] = React.useState(null);
  const [locErr, setLocErr] = React.useState(false);
  const [address, setAddress] = React.useState(null);
  const [street, setStreet] = React.useState('');
  const [link, setLink] = React.useState('');
  const [linkErr, setLinkErr] = React.useState(false);
  const [linkHelpText, setLinkHelpText] = React.useState("Link can't be empty");
  const [img, setImg] = React.useState('');
  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    /* TODO: do check for admin */
    getLocations();
    getAddresses();
    getCategories();
  }, []);

  const getLocations = () => {
    axios.get('/locations')
      .then(result => {
        let locationsData = result.data.reduce(function(data, loc) {
          if (loc.name) {  // make sure it has a name!
            data.push({
              id: loc.id,
              name: loc.name,
              address_id: loc.address_id,
              description: loc.description,
            });
          }
          return data;
        }, []);
        setDBLocations(dbLocations => [...locationsData]);
      })
      .catch(err => console.log(err));
  }

  const getAddresses = () => {
    axios.get('/addresses')
      .then(result => {
        let addressesData = result.data.reduce(function(data, addr) {
          data.push({
            id: addr.id,
            name: addr.name,
            street: addr.street,
          });
          return data;
        }, []);
        setDBAddresses(dbAddresses => [...addressesData]);
      })
      .catch(err => console.log(err));
  }

  const getCategories = () => {
    axios.get('/categories')
      .then(result => {
        let categoriesData = result.data.reduce(function(data, category) {
          data.push({
            id: category.id,
            name: category.name,
          });
          return data;
        }, []);
        setDBCategories(dbCategories => [...categoriesData]);
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
      setIsEWI(event.target.value.localeCompare("Yes") === 0 ? true : false);
      setName("Evening With Industry");
    }
    else if (!field.localeCompare("isFeatured")) 
      setIsFeatured(event.target.value.localeCompare("Yes") === 0 ? true : false);
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
    else if (!field.localeCompare("street"))
      setStreet(event.target.value);
  };

  const checkForErrors = () => {
    // check if name is empty
    setNameErr(name.length === 0);

    // check start time before end time
    var starts = startDate + " " + startTime + ":00";
    var ends = ((isSameDay) ? startDate : endDate) + " " + endTime + ":00";
    setTimeErr(new Date(starts) > new Date(ends));

    // check period
    setPeriodErr(period.length === 0);

    // check link
    if (link.length === 0) {
      setLinkErr(true);
      setLinkHelpText("Link can't be empty");
    }
    else {
      var id = parseLinkForID(link);
      if (id.length === 0) {
        setLinkErr(true);
        setLinkHelpText("Not valid link -- can't parse for ID");
      }
      else {
        setLinkErr(false);
      }
    }

    // check location
    setLocErr(location ? false : true);

  }

  const parseLinkForID = (eventURL) => {
    // Assumes some form like: https://www.facebook.com/events/3373102776039760/
    var baseURL = "facebook.com/events/";
    var start = eventURL.search(baseURL);
    if (start === -1) return "";
    start += baseURL.length;

    var end = eventURL.indexOf('/', start);
    if (end === -1) end = eventURL.length;

    console.log(eventURL.substring(start, end));
    return eventURL.substring(start, end);
  }

  const resetFields = () => {
    getLocations();
    getAddresses();
    getCategories();

    setName('');
    setNameErr(false);
    setPeriod('');
    setWeek('');
    setIsEWI(false);
    setIsFeatured(false);
    setStartDate(new Date().toISOString().substring(0,10));
    setStartTime("12:00");
    setEndDate(new Date().toISOString().substring(0,10));
    setEndTime("19:00");
    setIsSameDay(true);
    setDescription('');
    setLocation(null);
    setAddress(null);
    setStreet('');
    setLink('');
    setImg('');
    setCategories([]);
  }

  const addEvent = async () => {

    /* TODO: do check for admin */
    console.log('add');
    var validFields = true;

    // Checks for fields:
    checkForErrors();

    var id = parseLinkForID(link);
    if (id.length === 0) {
      validFields = false;
      console.log("Invalid ID");
    }

    var starts = startDate + " " + startTime + ":00";
    var ends = ((isSameDay) ? startDate : endDate) + " " + endTime + ":00"; // check end is after start?

    // Post to database
    
    // TODO: add rollback/commit??
    if (validFields) {
      var addressID = (address && address.id) ? address.id : -1;
      var locID = (location && location.id) ? location.id : -1;

      // First check if need to add a new location!
      if (!location.id) {
        // check if need new address
        if (!address.id) {
          const addrRes = await axios.post('/addresses', {
            "name": address.name,
            "street": street,
          })
          const responseStr = addrRes.data.message;
          console.log("Address: " + responseStr);
          var index = responseStr.indexOf(':');
          addressID = parseInt(responseStr.substring(index+1));
          setAddress((address) => ({'name': address.name, 'id': addressID}));
        }

        const locRes = await axios.post('/locations', {
          "name": location.name,
          "address_id": addressID,
          "description": '',
        })

        const responseStr = locRes.data.message;
        console.log("Location: " + responseStr);
        var index = responseStr.indexOf(':');
        locID = parseInt(responseStr.substring(index+1));
        setLocation((location) => ({'name': location.name, 'id': locID}));
      }

      // pull out categories
      let addedCategories = [];
      for (var i = 0; i < categories.length; i++) {
        if (categories[i])
          addedCategories.push(i);
      }

      axios.post('/events', {
        "event_id": id,
        "name": name,
        "starts_at": starts,
        "ends_at": ends,
        "location_id": locID, 
        "description": description,
        "fb_event": link,
        "picture": img,
        "is_featured": isFeatured,
        "categories": addedCategories,
        "companies": [],
        "hosts": [],
        "period": period,
        "week": week,
      })
      .then(function (response) {
        console.log(response);
        alert("Event " + id + ": '" + name + "' successfully added!");
        resetFields();
      })
      .catch(function (error) {
        console.log(error);
        alert("Error adding event. Please try again!");
      });
    }
  }

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <div>
        {/*<TextField required id="standard-required" label="Required" defaultValue="Hello World" helperText="Facebook Event ID"/>*/}
        <TextField 
          className={classes.name} 
          fullWidth required 
          disabled={isEWI} 
          id="standard-required" 
          label="Event Name" 
          value={name} 
          error={nameErr}
          helperText={nameErr ? "Name can't be empty" : ""}
          onChange={(e) => handleChange(e, "name")}/>
      </div>
      <Grid container spacing={4} justify="flex-start">
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
      <Grid container spacing={2} justify="flex-start">
        <Grid item>
          <TextField
            id="date"
            required
            label={isSameDay ? "Date" : "Start Date"}
            type="date"
            value={startDate}
            error={timeErr}
            helperText={timeErr ? "Start time must be before end time" : ""}
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
            error={timeErr}
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
            error={timeErr}
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
            error={timeErr}
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
        <TextField 
          required 
          className={classes.period} 
          select 
          value={period} 
          error={periodErr}
          helperText={periodErr ? "Period can't be empty" : ""}
          onChange={(e) => handleChange(e, "period")} 
          label="Period">
          {periods.map((option) => (
            <MenuItem key={"period-" + option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField className={classes.week} select value={week} onChange={(e) => handleChange(e, "week")} label="Week">
          {weeks.map((option) => (
            <MenuItem key={"week-" + option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div>
        <Autocomplete
          options={dbLocations}
          getOptionLabel={(option) => {
            // e.g value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.name;
          }}
          renderOption={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} 
            label="Location" 
            error={locErr}
            helperText={locErr ? "Location can't be empty" : ""}/>
          }
          value={location}
          onChange={(event, newValue) => {
            console.log(newValue);
            if (newValue && newValue.inputValue) {
              setLocation({
                name: newValue.inputValue,
              });
            }

            setLocation(newValue);
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            if (params.inputValue !== '') {
              filtered.push({
                inputValue: params.inputValue,
                name: `Add "${params.inputValue}"`,
              });
            }
            return filtered;
          }}
          freeSolo
        />
      </div>
      {(location ? (location.id ? false : true) : false) &&
        <div>
          <Autocomplete
            options={dbAddresses}
            getOptionLabel={(option) => {
              // e.g value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name;
            }}
            renderOption={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} 
              label="Building/location name"/>
            }
            value={address}
            onChange={(event, newValue) => {
              console.log(newValue);
              if (newValue && newValue.inputValue) {
                setAddress({
                  name: newValue.inputValue,
                });

                return;
              }

              setAddress(newValue);
              setStreet(newValue ? newValue.street : '')
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              if (params.inputValue !== '') {
                filtered.push({
                  inputValue: params.inputValue,
                  name: `Add "${params.inputValue}"`,
                });
              }
              return filtered;
            }}
            freeSolo
          />
          <TextField 
            disabled={(address ? (address.id ? true : false) : true)} 
            id="standard-required" 
            label="Street Address" 
            value={street} 
            onChange={(e) => handleChange(e, "street")}
            style={{ width: 300 }}/>
        </div>
      }
      
      <div>
        <TextField 
          className={classes.link} 
          fullWidth 
          required 
          id="standard-required" 
          label="Facebook Event Link" 
          value={link} 
          error={linkErr}
          helperText={linkErr ? linkHelpText : ""}
          onChange={(e) => handleChange(e, "link")}/>
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
      <div>
        <FormLabel component="legend">Categories</FormLabel>
        <div className={classes.categories}>
          <FormGroup>
            {dbCategories.map((category) => (
              <FormControlLabel
                control={<Checkbox 
                  checked={categories[category.id]}
                  onChange={() => {
                    let newCategories = categories;
                    newCategories[category.id] = newCategories[category.id] ? false : true;
                    setCategories(newCategories);
                    console.log(categories);
                  }}
                  name={category.name}
                />}
                key={"category-" + category.name} 
                label={category.name}
              />
            ))}
          </FormGroup>
        </div>
      </div>
      <div className={classes.btnDiv}>
        <Button variant="contained" onClick={addEvent}>Add Event</Button>
      </div>
    </form>
  );
}

export default withStyles(AddEventStyles)(AddEvent);
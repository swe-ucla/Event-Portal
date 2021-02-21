import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import EventsFormStyles from "../styles/EventsForm.js";

/* 
 * Constants 
 */
import EventFields from "../utils/events_constants.js";

const EventsForm = props => {
  /*
   * Constants
   */
  const FB_ID_LEN = 15;
  const MAX_NAME_CHARS = 100;
  const MAX_ATTENDANCE_CODE_CHARS = 50;
  const MAX_URL_LEN = 255;

  const EventPeriods = {
    FALL_QUARTER : "Fall Quarter",
    WINTER_BREAK : "Winter Break",
    WINTER_QUARTER : "Winter Quarter",
    SPRING_BREAK : "Spring Break",
    SPRING_QUARTER : "Spring Quarter",
    SUMMER_QUARTER : "Summer Quarter"
  }  

  /*
   * State variables
   */
  const [locationMapping, setLocationMapping] = useState([])

  const [fbId, setFbId] = useState(false);
  const [name, setName] = useState(false);
  const [startsAt, setStartsAt] = useState(false);
  const [endsAt, setEndsAt] = useState(false);
  const [attendanceCode, setAttendanceCode] = useState(false);
  const [period, setPeriod] = useState(false);
  const [locationId, setLocationId] = useState(false);
  const [description, setDescription] = useState(false);
  const [fbEvent, setFbEvent] = useState(false);
  const [picture, setPicture] = useState('../swe-logo.png');
  const [isFeatured, setIsFeatured] = useState(false);

  const [fbIdError, setFbIdError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [startsAtError, setStartsAtError] = useState(false);
  const [endsAtError, setEndsAtError] = useState(false);
  const [attendanceCodeError, setAttendanceCodeError] = useState(false);
  const [locationIdError, setLocationIdError] = useState(false);
  const [fbEventError, setFbEventError] = useState(false);

  /*
   * isNumeric takes a string input and returns true if all characters in the
   * string are integers.
   */
  const isNumeric = str => {
    return /^\d+$/.test(str);
  }

  /*
   * isAlphabetic takes a string input and returns true if all characters in the
   * string are alphabetic characters.
   */
  const isAlphabetic = str => {
    return /^[a-zA-Z()]+$/.test(str);
  }

  /*
   * handleChange takes an input type from InputTypes and sets the state
   * accordingly.
   */
  const handleChange = inputType => (event) => {
    switch (inputType) {
      case EventFields.FB_ID:
        setFbId(event.target.value);
        break;
      case EventFields.NAME:
        setName(event.target.value);
        break;
      case EventFields.STARTS_AT:
        setStartsAt(event.target.value);
        break;
      case EventFields.END_TIME:
        setEndsAt(event.target.value);
        break;
      case EventFields.ATTENDANCE_CODE:
        setAttendanceCode(event.target.value);
        break;
      case EventFields.PERIOD:
        setPeriod(event.target.value);
        break;
      case EventFields.LOCATION_ID:
        setLocationId(event.target.value);
        break;
      case EventFields.DESCRIPTION:
        setDescription(event.target.value);
        break;
      case EventFields.FB_EVENT:
        setFbEvent(event.target.value);
        break;
      case EventFields.PICTURE:
        setPicture(event.target.value);
        break;
      case EventFields.IS_FEATURED:
        setIsFeatured(event.target.value);
        break;
    }
  }

  /*
   * Upload the locations mapping one time and save it.
   */
  useEffect(() => {
    axios.get('/locations')
      .then(result => {
        // Remove any empty locations
        let cleanLocations = [];
        for (const key in result.data) {
          if (result.data[key].name != null) {
            cleanLocations.push(result.data[key]);
          }
        }
        setLocationMapping(cleanLocations);
      })
      .catch(err => console.log(err));
  }, [])

  /* 
   * Error checking
   */
  useEffect(() => {
    const isValid = !fbId || (fbId.length == FB_ID_LEN && isNumeric(fbId));
    setFbIdError(!isValid);
  }, [fbId])

  useEffect(() => {
    const isValid = !name || (name.length < MAX_NAME_CHARS);
    setNameError(!isValid);
  }, [name])

  useEffect(() => {
    const isValidTime = time => {
      return true // TO-DO: Check timestamp format
    };

    const isStartsAtValid = isValidTime(startsAt);
    const isEndsAtValid = isValidTime(endsAt);

    setStartsAtError(!isStartsAtValid);
    setEndsAtError(!isEndsAtValid);
  }, [startsAt, endsAt])

  useEffect(() => {
    const isValid = !attendanceCode || (attendanceCode.length < MAX_ATTENDANCE_CODE_CHARS && isAlphabetic(attendanceCode));
    setAttendanceCodeError(!isValid);
  }, [attendanceCode])

  useEffect(() => {
    const isValid = !locationId || isNumeric(locationId);
    setLocationIdError(!isValid);
  }, [locationId])

  useEffect(() => {
    // TO-DO: Check for valid URL
    const isValid = !fbEvent || fbEvent.length < MAX_URL_LEN;
    setFbEventError(!isValid);
  }, [fbEvent])

  /*
   * handleSubmit checks for validity of form inputs and submits all user input
   * input if valid.
   */
  const handleSubmit = event => {
    // Do not post event if errors exist or a required field has not been
    // properly submitted.
    if (!fbId || !name || !startsAt || !endsAt || !attendanceCode ||
        !period || !locationId || !description || !fbEvent || !picture ||
        !isFeatured || fbIdError || nameError || startsAtError ||
        endsAtError || attendanceCodeError || locationIdError ||
        fbEventError) {
      return
    }

    // Otherwise, create POST request
    postEvent();

    // Prevent redirect
    event.preventDefault();
  }

  /*
   * postEvent inserts an event into the database if all given values in the
   * form are correct.
   */
  const postEvent = () => {
    // Define JSON body
    let body = {
      event_id: fbId,
      name: name,
      starts_at: startsAt,
      ends_at: endsAt,
      period: period,
      location_id: locationId,
      description: description,
      fb_event: fbEvent,
      picture: picture,
      is_featured: isFeatured,
      attendance_code: attendanceCode,
    };
    
    // POST
    axios
      .post("/events", body)
      .then(() => {
        // Flush input from current form
        setFbId(false);
        setName(false);
        setStartsAt(false);
        setEndsAt(false);
        setAttendanceCode(false);
        setPeriod(false);
        setLocationId(false);
        setDescription(false);
        setFbEvent(false);
        setPicture(false);
        setIsFeatured(false);
      })
      .catch(err => {
        console.log(err);
      })
  }

  /*
   * Expand style classes from props.
   */
  const { classes } = props;

  /*
   * HTML output for EventsForm.js
   */
  return (
    <div className={classes.eventsFormContainer}>
      <Paper className={classes.eventsFormPaper}>
        <Typography component="h1" variant="h5">
          Add Event
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            error={fbIdError}
            fullWidth
            id="fb_id"
            label = "Facebook ID"
            margin="normal"
            onChange={handleChange(EventFields.FB_ID)}
            placeholder=""
            required
            value={fbId || ""}
          />
          <TextField
            error={nameError}
            fullWidth
            id="name"
            label = "Name"
            margin="normal"
            onChange={handleChange(EventFields.NAME)}
            placeholder=""
            required
            value={name || ""}
          />
          <TextField
            error={startsAtError}
            fullWidth
            id="startsAt"
            label = "Start Time"
            margin="normal"
            onChange={handleChange(EventFields.START_TIME)}
            placeholder=""
            required
            value={startsAt || ""}
          />
          <TextField
            error={endsAtError}
            fullWidth
            id="endsAt"
            label = "End Time"
            margin="normal"
            onChange={handleChange(EventFields.END_TIME)}
            placeholder=""
            required
            value={endsAt || ""}
          />
          <TextField
            error={attendanceCodeError}
            fullWidth
            id="attendanceCode"
            label = "Attendance Code"
            margin="normal"
            onChange={handleChange(EventFields.ATTENDANCE_CODE)}
            placeholder=""
            required
            value={attendanceCode || ""}
          />

          <div>
            <FormControl>
              <FormLabel required>Period</FormLabel>
              <Select
                value={period || ""}
                onChange={handleChange(EventFields.PERIOD)}
              >
                <MenuItem value={EventPeriods.FALL_QUARTER}>Fall Quarter</MenuItem>
                <MenuItem value={EventPeriods.WINTER_BREAK}>Winter Break</MenuItem>
                <MenuItem value={EventPeriods.WINTER_QUARTER}>Winter Quarter</MenuItem>
                <MenuItem value={EventPeriods.SPRING_BREAK}>Spring Break</MenuItem>
                <MenuItem value={EventPeriods.SPRING_QUARTER}>Spring Quarter</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div>
            <FormControl>
              <FormLabel required>Location</FormLabel>
              <Select 
                value={locationId || ""}
                onChange={handleChange(EventFields.LOCATION_ID)}
              >
              {
                locationMapping.map((location, index) => {
                  return <MenuItem key={index} value={location.name}>{location.name}</MenuItem>
                })
              }
              </Select>
            </FormControl>
          </div>

          <TextField
            fullWidth
            id="description"
            label = "Description"
            margin="normal"
            onChange={handleChange(EventFields.DESCRIPTION)}
            placeholder=""
            required
            value={description || ""}
          />

          <TextField
            error={fbEventError}
            fullWidth
            id="fbEvent"
            label = "Facebook Event"
            margin="normal"
            onChange={handleChange(EventFields.FB_EVENT)}
            placeholder=""
            required
            value={fbEvent || ""}
          />

          {/* TO-DO: Photo upload */}
          <TextField
            fullWidth
            id="picture"
            label = "Picture"
            margin="normal"
            onChange={handleChange(EventFields.PICTURE)}
            placeholder=""
            value={picture || ""}
          />

          <FormControl>
            <FormLabel required>Featured</FormLabel>
            <Select
              value={isFeatured || ""}
              onChange={handleChange(EventFields.IS_FEATURED)}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Submit Event
          </Button>
        </form>
      </Paper>
    </div>
  )
}

export default withStyles(EventsFormStyles)(EventsForm);

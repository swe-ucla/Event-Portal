import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import CompaniesStyles from "../styles/CompaniesForm.js";
import CardMedia from "@material-ui/core/CardMedia";

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
  const [fbId, setFbId] = useState(false);
  const [name, setName] = useState(false);
  const [startTime, setStartTime] = useState(false);
  const [endTime, setEndTime] = useState(false);
  const [attendanceCode, setAttendanceCode] = useState(false);
  const [period, setPeriod] = useState(false);
  const [locationId, setLocationId] = useState(false);
  const [description, setDescription] = useState(false);
  const [fbEvent, setFbEvent] = useState(false);
  const [picture, setPicture] = useState('../swe-logo.png');
  const [isFeatured, setIsFeatured] = useState(false);

  const [fbIdError, setFbIdError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
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
      case EventFields.START_TIME:
        setStartTime(event.target.value);
        break;
      case EventFields.END_TIME:
        setEndTime(event.target.value);
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

    const isStartTimeValid = isValidTime(startTime);
    const isEndTimeValid = isValidTime(endTime);

    setStartTimeError(!isStartTimeValid);
    setEndTimeError(!isEndTimeValid);
  }, [startTime, endTime])

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
    if (!fbId || !name || !startTime || !endTime || !attendanceCode ||
        !period || !locationId || !description || !fbEvent || !picture ||
        !isFeatured || fbIdError || nameError || startTimeError ||
        endTimeError || attendanceCodeError || locationIdError ||
        fbEventError) {
      return
    }

    // Otherwise, create POST request
    postEvent();

    // TO-DO: prevent redirect

  }

  /*
   * postEvent inserts an event into the database if all given values in the
   * form are correct.
   */
  const postEvent = () => {
    // TO-DO: Create POST request
  }
  
  return (
    <Paper>
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
          error={startTimeError}
          fullWidth
          id="startTime"
          label = "Start Time"
          margin="normal"
          onChange={handleChange(EventFields.START_TIME)}
          placeholder=""
          required
          value={startTime || ""}
        />
        <TextField
          error={endTimeError}
          fullWidth
          id="endTime"
          label = "End Time"
          margin="normal"
          onChange={handleChange(EventFields.END_TIME)}
          placeholder=""
          required
          value={endTime || ""}
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

        <FormControl>
          <FormLabel>Period</FormLabel>
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

        <TextField
          error={locationIdError}
          fullWidth
          id="locationID"
          label = "Location ID"
          margin="normal"
          onChange={handleChange(EventFields.LOCATION_ID)}
          placeholder=""
          required
          value={locationId || ""}
        />

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
          <FormLabel>Featured</FormLabel>
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
  )
}

export default withStyles(CompaniesStyles)(EventsForm);

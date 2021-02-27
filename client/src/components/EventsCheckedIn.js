import React from 'react';
import EventsCheckedInStyles from "../styles/EventsCheckedIn.js";
import { withStyles } from '@material-ui/core/styles';

const EventsCheckedIn = (props) => {
  const { classes } = props;

  return (
    <div className={classes.container} tabIndex="-1">
      {props.events.map((event) => {
        return (
        <div className={classes.item} key={event.fb_id}>
          <p>FB_ID: {event.fb_id}</p>
          <p>NAME: {event.name}</p>
        </div>)
      })}
    </div>
  )
}

export default withStyles(EventsCheckedInStyles)(EventsCheckedIn);

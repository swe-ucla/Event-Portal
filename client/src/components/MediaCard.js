import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MediaCardStyles from '../styles/MediaCard.js'
import Divider from '@material-ui/core/Divider';

function MediaCard(props) {
  const { classes } = props;

  

  const getTime = () => {
    /* Get month. */
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    const startDate = new Date(props.event.starts_at);
    const endDate = new Date(props.event.ends_at);
    let startMonth = startDate.getUTCMonth();
    let startDay = startDate.getUTCDate();
    let endMonth = endDate.getUTCMonth();
    let endDay = endDate.getUTCDate();

    var startTime = "";
    var endTime = "";

    // ASSUMES event is in same year or something reasonable (for ex: couple days at end of year)
    if (startMonth != endMonth || startDay != endDay) {
      // NOT same day
      startTime += monthNames[startMonth] + " " + startDay + ", ";
      endTime += monthNames[endMonth] + " " + endDay + ", ";

    }

    var minutesBool = false;  // checks for if either start or end time has minutes not 0
    var startAMPM = "AM";
    var endAMPM = "AM";
    let startHours = startDate.getUTCHours();

    if (startHours >= 13)  startAMPM = "PM";
    let startMinutes = startDate.getUTCMinutes();
    if (startMinutes != 0)  minutesBool = true;

    startHours = startHours % 12;
    if (startHours == 0) startHours = 12;

    let endHours = endDate.getUTCHours();
    if (endHours >= 13)  endAMPM = "PM";
    let endMinutes = endDate.getUTCMinutes();
    if (endMinutes != 0)  minutesBool = true;

    endHours = endHours % 12;
    if (endHours == 0) endHours = 12;

    startTime += startHours;
    if (minutesBool)  startTime += ":" + ("0" + startMinutes).slice(-2);
    startTime += startAMPM;

    endTime += endHours;
    if (minutesBool)  endTime += ":" + ("0" + endMinutes).slice(-2);
    endTime += endAMPM;


    return startTime + " - " + endTime;
  }

  return ( 
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          //image={props.event.picture}
          image={require('./amy.jpg')}
          title="Event Image"
        />

        <div className={classes.text}>
          <Typography component='p' className={classes.timeText}>{getTime()}</Typography>
          <Typography component='p' className={classes.nameText}>{props.event.name}</Typography>
          <Typography component='p' className={classes.locationText}>{props.event.location_id}</Typography>
        </div>
       
      </CardActionArea>
      <Divider className={classes.line}></Divider>
      <CardActions>
        <Button className={classes.registerBtn} size="small">
          Register
        </Button>
      </CardActions>
    </Card>
  );
}

MediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(MediaCardStyles)(MediaCard);
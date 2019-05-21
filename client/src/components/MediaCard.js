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
import MediaCardStyles from '../styles/MediaCard.js'

function MediaCard(props) {
  const { classes } = props;
  return ( 
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={require("./amy.jpg")}
          title="Contemplative Reptile"
        />
        <CardContent>
          <p className={classes.eventName}>
            AMY'S BABY SHOWER
          </p>
          <p className={classes.description}>
            have a swell time at amy's baby shower! celebrating her expansion of the waist
          </p>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

MediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(MediaCardStyles)(MediaCard);
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
import '../css/MediaCard.css'

const styles = {
  card: {
    width: 300,
    padding: 10,
  },
  media: {
    height: 100,
    width: 300,
  }
};

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
          <p className='event-name'>
            AMY'S BABY SHOWER
          </p>
          <p className='description'>
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

export default withStyles(styles)(MediaCard);
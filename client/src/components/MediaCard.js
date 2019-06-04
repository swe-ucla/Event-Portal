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

function MediaCard(props) {
  const { classes } = props;
  console.log(props.event.fb_id);
  return ( 
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={props.event.picture}
          title="Contemplative Reptile"
        />
        <Grid container alignItems="center">
          <Grid item xs={3} style={{textAlign: "center"}}>
              <Typography component="h2" variant="body1">
                {props.event.starts_at}
              </Typography>
              <Typography component="h5" variant="headline">
                26
              </Typography>
          </Grid>
          <Grid item xs={12} sm container>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {props.event.name}
              </Typography>
              <Typography component="p">
                {props.event.description}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
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
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
import '../css/MediaCard.css'

const styles = {
  card: {
    width: 300,
  },
  media: {
    height: 200,
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
        <Grid container alignItems="center">
          <Grid item xs={3} style={{textAlign: "center"}}>
              <Typography component="h2" variant="body1">
                JUNE
              </Typography>
              <Typography component="h5" variant="headline">
                26
              </Typography>
          </Grid>
          <Grid item xs={12} sm container>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                AMY'S BABY SHOWER
              </Typography>
              <Typography component="p">
                have a swell time at amy's baby shower! celebrating her expansion of the waist
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

export default withStyles(styles)(MediaCard);
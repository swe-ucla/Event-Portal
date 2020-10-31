import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CompanyCardStyles from '../styles/CompanyCard.js';
import axios from 'axios';


class CompanyCard extends Component{
  constructor(props){
    super(props);

    this.getPositions = this.getPositions.bind(this);
    this.getMajors = this.getMajors.bind(this);
//    this.getLocations = this.getLocations.bind(this);
//    this.getYears = this.getYears.bind(this);
    this.arrayToHTML = this.arrayToHTML.bind(this);
    this.mapIDToName = this.mapIDToName.bind(this);
    this.state = {majors: [], positions: []}
  }

  componentDidMount() {
    this.getPositions();
    this.getMajors();
  }

  getPositions = () => {
    var options = {
        params: {
          sort: 'name'
        }
      }
    axios.get('/companies/' + this.props.company.id + '/positions', options)
      .then(result => {
        let positionData = result.data.map(function(position) { 
          return position.position_id
        });

        this.setState({ 
          positions: positionData,
        });
      })
      .catch(err => console.log(err));
  }

  getMajors = () => {
    var options = {
        params: {
          sort: 'name'
        }
      }
    axios.get('/companies/' + this.props.company.id + '/majors')
      .then(result => {
        let majorData = result.data.map(function(majors) { 
          return majors.major_id
        });

        this.setState({ 
          majors: majorData,
        });
      })
      .catch(err => console.log(err));
  }

//  getLocations = () => {
//    var options = {
//        params: {
//          sort: 'name'
//        }
//      }
//    axios.get('/companies/' + this.props.company.id + '/locations')
//      .then(result => {
//        let locationData = result.data.map(function(locations) {
//          return locations.location_id
//        });
//
//        this.setState({
//          locations: locationData,
//        });
//      })
//      .catch(err => console.log(err));
//  }
  //don't need to make this call for each card... extract out to row/company!

  mapIDToName = (idarray, namearray) => {
    //console.log(namearray)
    let elements = idarray.map(elem => {
      return namearray[elem];
    })
    return this.arrayToHTML(elements);
  }

  arrayToHTML = (array) => {
    let elements = array.map(elem => {
      //console.log(elem)
      if(elem){
        return (<li> {elem} </li>);
      }
  })
    return elements;
  }

//extract js into var out of html ...
  render(){
    const { classes } = this.props;
    let majors = this.state.majors;
    let allMajors = this.props.allMajors;

    let positions = this.state.positions;
    let allPositions = this.props.allPositions

    let positionsDisplay = (<Typography>
            Positions: {this.mapIDToName(positions, allPositions)}
          </Typography>)
    let majorsDisplay = (<Typography>
            Majors: {this.mapIDToName(majors, allMajors)}
          </Typography>)

    return (
        <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
            image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
            title="Image title"
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {this.props.company.name}
          </Typography>
          <Typography>
            Website: {this.props.company.website}
          </Typography>
          <Typography>
            Description: {this.props.company.description}
          </Typography>
          {majorsDisplay}
          {positionsDisplay}
          <Typography>
            Citizenship Requirement: {this.props.company.citizenship_requirement}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

CompanyCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(CompanyCardStyles)(CompanyCard);
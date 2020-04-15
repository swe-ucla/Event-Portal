import React, { Component } from "react";
import EventRow from "./EventRow.js";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import EventsStyles from "../styles/Events.js";
import Divider from "@material-ui/core/Divider";

class Events extends Component {
  _isMounted = false;

  constructor() {
    super();

    this.state = {
      eventsByDayArray: {},
      loading: false,
      date: "", // TO-DO: change to today's date when we populate with real data
      prevY: 0,
      pastEvents: false,
    };

    this.getEvents = this.getEvents.bind(this);
    this.handlePastEvents = this.handlePastEvents.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getEvents();
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    };

    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );

    this.observer.observe(this.loadingRef);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleObserver(entities) {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      let lastDate;
      for (let val in this.state.eventsByDayArray) {
        if (this.state.eventsByDayArray.hasOwnProperty(val)) {
          lastDate = this.state.eventsByDayArray[val][0].starts_at
        }
      }
      this.getEvents(lastDate);
      this.setState({ date: lastDate });
    }
    this.setState({ prevY: y });
  }

  getEvents(start = this.state.date, end = null, period = null, limit = 6, isPastEvent = false) {
    this.setState({ loading: true });

    axios
      .get("/locations")
      .then(result => {
        var locationsData = [];
        result.data.forEach(function(location) {
          locationsData[location.id] = location;
        });

        let options = {
          params: {
            sort: "date",
            limit: limit, // max number of days loaded (lazy loading)
            start_date: start,
            end_date: end,
            period: period,
          }
        }

        axios
          .get("/events", options)
          .then(result => {
            let eventsData = result.data.map(function(event) {
              return {
                fb_id: event.fb_id,
                name: event.name,
                starts_at: event.starts_at,
                ends_at: event.ends_at,
                location_id: event.location_id,
                location: event.location_id
                  ? locationsData[event.location_id].name
                  : "",
                description: event.description,
                fb_event: event.fb_event,
                picture: event.picture,
                is_featured: event.is_featured,
                updated_at: event.updated_at,
                created_at: event.created_at,
                period: event.period,
                week: event.week
              };
            });

            function groupByDate(arr) {
              return arr.reduce(function(memo, event) {
                let startOfDate = new Date(
                  new Date(event["starts_at"]).setUTCHours(0, 0, 0, 0)
                );
                let endOfDate = new Date(
                  new Date(event["ends_at"]).setUTCHours(0, 0, 0, 0)
                );

                for (
                  var date = new Date(startOfDate);
                  date.getTime() <= endOfDate.getTime();
                  date.setUTCDate(date.getUTCDate() + 1)
                ) {
                  // if event's date < today's date then don't display
                  if (!memo[new Date(date)]) {
                    memo[new Date(date)] = [];
                  }
                  memo[new Date(date)].push(event);
                }
                return memo;
              }, {});
            }
            this.setState({ loading: false });

            let eventsArray = groupByDate(eventsData);
            if (isPastEvent) {
              this.setState({
                eventsByDayArray: {...eventsArray, ...this.state.eventsByDayArray}
              });
            } else {
              this.setState({
                eventsByDayArray: {...this.state.eventsByDayArray, ...eventsArray}
              });
            }
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

  // Little hacky: compares non-UTC to UTC time because new Date() doesn't give UTC time
  sameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getUTCFullYear() &&
      d1.getMonth() === d2.getUTCMonth() &&
      d1.getDate() === d2.getUTCDate()
    );
  };

  getFormattedDate = date => {
    let today = new Date();
    const month = date.toLocaleString("default", { month: "long" });

    let tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    if (this.sameDay(today, date))
      return "Today, " + month + " " + date.getUTCDate();
    else if (this.sameDay(tomorrow, date))
      return "Tomorrow, " + month + " " + date.getUTCDate();
    else {
      let formattedDate = month + " " + date.getUTCDate();
      if (today.getFullYear() !== date.getUTCFullYear())
        formattedDate += ", " + date.getUTCFullYear();
      return formattedDate;
    }
  };

  renderEventRows = () => {
    const { classes } = this.props;
    let eventRows = [];
    var dividerIndex = 0;

    for (var start_date in this.state.eventsByDayArray) {
      if (this.state.eventsByDayArray.hasOwnProperty(start_date)) {
        eventRows.push(
          <EventRow
            key={start_date}
            events={this.state.eventsByDayArray[start_date]}
            name={this.getFormattedDate(new Date(start_date))}
          />
        );
        eventRows.push(
          <Divider key={dividerIndex} className={classes.line}></Divider>
        );
        dividerIndex++;
      }
    }
    return eventRows;
  };

  handlePastEvents = () => {
    // TO-DO: Figure out how to handle events if past quarter was not found

    if (this.state.eventsByDayArray.length === 0)
      return;

    /* Get the period of the very first event. */
    let first_period;
    let first_date;
    for (let start_date in this.state.eventsByDayArray) {
      if (this.state.eventsByDayArray.hasOwnProperty(start_date)) {
        let event = this.state.eventsByDayArray[start_date];
        first_period = event[0].period;
        first_date = event[0].starts_at;
        break;
      }
    }

    /* Get the period before. */
    let period;
    switch (first_period) {
      case 'Fall Quarter': 
        period = 'Summer Quarter';
        break;
      case 'Winter Quarter':
        period = 'Fall Quarter';
        break;
      case 'Winter Break':
        period = 'Winter Quarter';
        break;
      case 'Spring Quarter': 
        period = 'Winter Break';
        break;
      case 'Spring Break':
        period = 'Spring Quarter';
        break;
      case 'Summer Quarter':
        period = 'Spring Break';
        break;
      default:
        period = 'Fall Quarter';
    }
    
    /* Get all events from the previous quarter. */
    let start_date = first_date.substring(0, 3) + (parseInt(first_date[3]) - 1) + first_date.substring(4);
    this.getEvents(start_date, first_date, period, null, true);
    this.renderEventRows();
  }

  render() {
    const { classes } = this.props;
    const loadingCSS = {
      height: "100px",
      margin: "30px"
    }
    const loadingTextCSS = { display: this.state.loading ? "block" : "none" };

    return (
      <div className={classes.container}>
        <div className={classes.whiteBackground}>
          <button className={classes.pastEventsButton} onClick={this.handlePastEvents}>
            <svg width="25" height="10" viewBox="0 0 35 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="23.9152" height="3.82643" rx="1.91322" transform="matrix(-0.728645 -0.684891 0.728645 -0.684891 32.2119 19)" fill="#C4C4C4"/>
              <rect width="23.9152" height="3.82643" rx="1.91322" transform="matrix(0.728645 -0.684891 0.728645 0.684891 0 16.3793)" fill="#C4C4C4"/>
            </svg>
            <p className={classes.buttonLabel}>see past events</p>
          </button>
          <div className={classes.events}>{this.renderEventRows()}</div>
          <div ref = {loadingRef => (this.loadingRef = loadingRef)} style={loadingCSS}>
            <span style={loadingTextCSS}>Loading...</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(EventsStyles)(Events);

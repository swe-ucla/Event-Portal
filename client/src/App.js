import React, { Component } from 'react'
import { Router, Route } from 'react-router-dom'
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';

import NavBar from './components/NavBar.js'
import Footer from './components/Footer.js'
import Checkout from './components/Checkout.js';
import ExamplePostForm from './components/ExamplePostForm.js'
import ExamplePutForm from './components/ExamplePutForm.js'
import ExampleDeleteForm from './components/ExampleDeleteForm.js'
import Companies from './components/Companies.js'
import CompaniesForm from './components/CompaniesForm.js'
import CompaniesUpdateForm from './components/CompaniesUpdateForm.js'
import CompaniesAdmin from './components/CompaniesAdmin.js'
import Events from './components/Events.js'
import EventsForm from './components/EventsForm.js'

import Register from './components/Register.js';
import RegisterEWI from './components/RegisterEWI.js';
import Profile from './components/Profile.js';
import EditProfile from './components/EditProfile.js';
import UsersSummary from './components/UsersSummary.js';

require('typeface-roboto');

ReactGA.initialize('UA-139728260-1', { debug: true });
// ReactGA.initialize('UA-139728260-1');

const history = createBrowserHistory();
history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
  // ReactGA.event({
  //   category: "Pageview",
  //   action: "Page: " + location.pathname + location.search,
  //   label: "Page: " + location.pathname + location.search,
  // });
});

class App extends Component {
  componentWillMount() {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }

  render() {
    return (
      <Router history={history}>
        <NavBar />        
        <Route path="/checkout" component={Checkout} />
        <Route path="/post" component={ExamplePostForm} />
        <Route path="/put" component={ExamplePutForm} />
        <Route path="/delete" component={ExampleDeleteForm} />
        <Route path="/companies" component={Companies} />
        <Route path="/companiesform" component={CompaniesForm} />
        <Route path="/companiesupdateform" component={CompaniesUpdateForm} />
        <Route path="/companiesadmin" component={CompaniesAdmin} />
        <Route path="/events" component={Events} />
        <Route path="/eventsform" component={EventsForm} />
				<Route path='/registerbasic' component={Register} />
				<Route path='/profile' component={Profile} />
				<Route path='/registerEWI' component={RegisterEWI} />
				<Route path='/users/admin' component={UsersSummary} />
				<Footer />
      </Router>
    )
  }
}

export default App;

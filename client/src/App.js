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
import Login from './components/Login.js'

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
        <Footer />
        <Route path="/login" component={Login} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/post" component={ExamplePostForm} />
        <Route path="/put" component={ExamplePutForm} />
        <Route path="/delete" component={ExampleDeleteForm} />
      </Router>
    )
  }
}

export default App;

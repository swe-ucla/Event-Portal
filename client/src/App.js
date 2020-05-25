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
import Register from './components/Register.js'
import Register_Google from './components/Register_Google.js'
import RegisterEWI from './components/RegisterEWI.js'
import Profile from './components/Profile.js'
import EditProfile from './components/EditProfile.js'


/* Auth imports */

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





function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key)
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null
  }
  const item = JSON.parse(itemStr)
  const now = new Date()
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    //localStorage.removeItem(key)
    //return null
    return item.value
  }
  return item.value
}

var IsAuthenticated = false
class App extends Component {

  componentWillMount() {
    console.log("local storage");
for (var i = 0; i < localStorage.length; i++)   {
    console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
}

    console.log(getWithExpiry('token'));
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);


    const token = localStorage.getItem('token');
    if (token) {
      IsAuthenticated = true;
    } 
  
  }

  render() {
    return (
      <Router history={history}>

        <NavBar />
        <Footer />
        <Route path="/checkout" component={Checkout} />
        <Route path="/post" component={ExamplePostForm} />
        <Route path="/put" component={ExamplePutForm} />
        <Route path="/delete" component={ExampleDeleteForm} />
        <Route path="/registerbasic" component={Register} />
        <Route path="/register" component={Register_Google} />
        <Route path="/profile" component={Profile} />
        <Route path="/registerEWI" component={RegisterEWI} />
      </Router>
    )
  }
}

export default App;

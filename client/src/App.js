import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import NavBar from './components/NavBar.js'
import Checkout from './components/Checkout.js';
import ExamplePostForm from './components/ExamplePostForm.js'
import ExamplePutForm from './components/ExamplePutForm.js'
import ExampleDeleteForm from './components/ExampleDeleteForm.js'

require('typeface-roboto');

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <NavBar />
        <Route path="/checkout" component={Checkout} />
        <Route path="/post" component={ExamplePostForm} />
        <Route path="/put" component={ExamplePutForm} />
        <Route path="/delete" component={ExampleDeleteForm} />
      </BrowserRouter>
    )
  }
}

export default App;

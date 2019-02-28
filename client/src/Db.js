import React, { Component } from 'react';
import logo from './logo.svg';
import './css/App.css';

class Db extends Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState(res))
      .catch(console.error);
  }

  callApi = async () => {
    const resp = await fetch('/db');

    window._resp = resp;

    let text = await resp.text();

    let data = null;
    try {
      data = JSON.parse(text); // cannot call both .json and .text - await resp.json();
    } catch (e) {
      console.err(`Invalid json\n${e}`);
    }

    console.log(data);
    console.log(data[0].id);
    data.zero = data[0].id;
    data.one = data[1].id;
    data.two = data[2].id;
    return data;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>{this.state.zero || 'No message'}</p>
        <p>{this.state.one || 'No message'}</p>
        <p>{this.state.two || 'No message'}</p>
      </div>
    );
  }
}

export default Db;

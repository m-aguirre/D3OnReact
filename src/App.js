import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import OutlierDetector from './OutlierDetector.js';
import aaplData from './dataFile.js';
import RegressionOutlierDetector from './components/RegressionOutlierDetector.jsx';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To
        </p>
        <RegressionOutlierDetector />
      </div>
    );
  }
}

export default App;

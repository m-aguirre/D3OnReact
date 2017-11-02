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
        <p className="App-intro">
          To
        </p>
        <RegressionOutlierDetector />
        <div className="graph-pane"></div>
      </div>
    );
  }
}

export default App;

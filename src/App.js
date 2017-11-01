import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import OutlierDetector from './OutlierDetector.js';
import aaplData from './dataFile.js';

class App extends Component {
  
  show() {
    var data = aaplData.aaplData;
    console.log(data);
     var graph = new OutlierDetector(data);
     graph.plotDataPoints();
  }
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
        <button onClick={this.show()}>Identify Outliers</button>
      </div>
    );
  }
}

export default App;

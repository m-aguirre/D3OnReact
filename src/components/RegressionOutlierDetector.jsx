import React from 'react';

import aaplData from '../dataFile.js';
import OutlierDetector from '../OutlierDetector.js'

class RegressionOutlierDetector extends React.Component {
  constructor(props) {
    super(props)

    this.show = this.show.bind(this);
  }
  show(daysToSubtract) {
    var data = aaplData.aaplData;
  //  console.log(data);
    var graph = new OutlierDetector(data, '2015-01-01', daysToSubtract);
    graph.plotDataPoints();
  }

  render() {
    return (
      <div>
        <button className="animate-button" onClick={ () => {this.show(365)}}>Identify Outliers</button>
        <button className="time-interval-button" onClick={ () => {this.show(30)}}>1M</button>
        <button className="time-interval-button" onClick={ () => {this.show(90)}}>3M</button>
        <button className="time-interval-button" onClick={ () => {this.show(180)}}>6M</button>
        <button className="time-interval-button" onClick={ () => {this.show(365)}}>1Y</button>


      </div>
    )
  }
}

export default RegressionOutlierDetector;

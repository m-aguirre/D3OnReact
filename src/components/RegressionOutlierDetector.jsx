import React from 'react';

import aaplData from '../dataFile.js';
import OutlierDetector from '../OutlierDetector.js'

class RegressionOutlierDetector extends React.Component {
  constructor(props) {
    super(props)

    this.show = this.show.bind(this);
    this.calculateStartDate = this.calculateStartDate.bind(this);
  }

  calculateStartDate(endDate, daysToSubtract) {
    var date = new Date(endDate);
    date.setDate(date.getDate() - daysToSubtract);
    return new Date(date);
  }

  show(daysToSubtract) {
    var sourceData = aaplData.aaplData;
    var startDate = this.calculateStartDate('2015-01-01', daysToSubtract);
    var data = [];
    //TODO add upper bound
    for (var i = 0; i < sourceData.length; i++) {
      if (sourceData[i] != null && new Date(sourceData[i].date).valueOf() > startDate.valueOf()) {
        data.push(Object.create(sourceData[i]));
      }
    }

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

import React from 'react';

import aaplData from '../dataFile.js';
import OutlierDetector from '../OutlierDetector.js';
import BollingerBands from '../BollingerBands.js';

class BollingerBandsRenderer extends React.Component {
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

    var graph = new BollingerBands(data, '2015-01-01', daysToSubtract);
  //  graph.plotDataPoints();
  }
  render() {
    return (
      <div className="bollinger-container">
          <div className="time-interval-button" onClick={ () => {this.show(365)}}><p>Show BB</p></div>
      </div>
    )
  }
}

export default BollingerBandsRenderer;

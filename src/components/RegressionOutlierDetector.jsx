import React from 'react';

import aaplData from '../dataFile.js';
import OutlierDetector from '../OutlierDetector.js'

class RegressionOutlierDetector extends React.Component {
  constructor(props) {
    super(props)

    this.show = this.show.bind(this);
  }
  show() {
    var data = aaplData.aaplData;
    console.log(data);
     var graph = new OutlierDetector(data, '2015-01-01', 365);
     graph.plotDataPoints();
  }

  render() {
    return (
      <div>
        <button className="animate-button" onClick={ () => {this.show()}}>Identify Outliers</button>

      </div>
    )
  }
}

export default RegressionOutlierDetector;

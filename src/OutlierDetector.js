import * as d3 from "d3";
import DateScale from "./DateScale.js"

class OutlierDetector {
  constructor(data, currentDate, daysToSubtract) {
    this.data = data;
    this.dataCopy = data.map(a => Object.assign({}, a));
    this.dataSummary = {
      minClosingValue: d3.min(this.data, (d) => {return d.close}),
      maxClosingValue: d3.max(this.data, (d) => {return d.close}),
      mean: 0,
      sd: 0,
      intercept: 0,
      regressionCoef: 0
    }
    this.daysToSubtract = daysToSubtract;
    //controls speed of animation
    this.delayFactor = 8;
    this.endDate = currentDate;

    this.xcoord = new DateScale(currentDate, daysToSubtract);
    this.xScale = this.xcoord.xScale;

    //creates y scale based on min and max closing prices
    this.yScale = d3.scaleLinear()
        .domain([this.maxYdomain(),this.minYdomain()])
        .range([0,450]);
    this.xAxis = d3.axisBottom(this.xScale).ticks(this.xcoord.numTicks);
    this.yAxis = d3.axisLeft(this.yScale).ticks(6);

    this.line = {
      start: {x: this.xcoord.startDate, y: 0},
      end: {x: this.endDate, y: 0 }
    }
    d3.select('.viewport').remove();
    this.calculateRegressionEquation(this.data);
    this.calculateSD(this.data);
    this.identifyOutliers(this.data, this.dataSummary.sd);
    this.addViewport();
  }

  /*
  Calculates number of milliseconds to delay drawing the regression line and
  data point color changes, based on the number of data points in our data set
  */
  millisecondDelay() {
    var ms = 0;
    for(var i = 0; i < this.data.length; i++)
      ms +=  this.delayFactor;
    return ms;
  }

  //Calculate min and max values for y axis, high/low +/- 20%
  maxYdomain() {
    return parseInt(this.dataSummary.maxClosingValue) + (parseInt(this.dataSummary.maxClosingValue)/5.0);
  }

  minYdomain() {
    return parseInt(this.dataSummary.minClosingValue) - (parseInt(this.dataSummary.minClosingValue)/5.0);
  }

  /*
  Finds the equation y = b0 + b1x1
  where our dependent variable y is the stock price
  and our independent variable is the number of days from the origin
  */
  calculateRegressionEquation(data) {

    var sumX = 0;
    var sumY = 0;
    var sumXY = 0;
    var sumXSquared = 0;
    var sumYSquared = 0;
    var n = Object.keys(data).length;

    data.forEach( (d) => {
      var date = d.date;
      var y = +d.close;
      //number of days between current date and january first - don't ask where 86400000 came from
      var x = (Math.floor((Date.parse(date) - Date.parse(this.xcoord.startDate.toISOString()))/86400000));
      sumX += x;
      sumY += y;
      sumXY += (x * y);
      sumXSquared += (x * x);
      sumYSquared += (y * y);
    });

    var b0 = ( ((sumY * sumXSquared) - (sumX * sumXY)) / ((n * sumXSquared) - (sumX * sumX)) );
    var b1 = ( ((n * sumXY) - (sumX * sumY)) / ((n * sumXSquared) - (sumX * sumX)) );

    // x variables
    var minDateNumeric = d3.min(this.data, (d) => { return Math.floor((Date.parse(d.date) - Date.parse(this.xcoord.startDate.toISOString()))/86400000)});
    var maxDateNumeric = d3.max(this.data, (d) => { return Math.floor((Date.parse(d.date) - Date.parse(this.xcoord.startDate.toISOString()))/86400000)});
    var startY = b0 + (minDateNumeric * b1);
    var endY = b0 + (maxDateNumeric * b1);

    //Set line start and end y-coordinates
    this.line.start.y = startY;
    this.line.end.y = endY;
    //Set summary regression coef & intercept
    this.dataSummary.intercept = b0;
    this.dataSummary.regressionCoef = b1;
  }

  calculateSD(data) {
    var mean = d3.mean(data, (d) => {return d.close});
    this.dataSummary.mean = mean;
    var sumLeastSquares = data.reduce( (sum, d) => {
      return (sum + ((d.close - mean) * (d.close - mean)))
    }, 0)
    this.dataSummary.sd = Math.sqrt(sumLeastSquares / (Object.keys(data).length - 1));
  }

  //adds outlier tag to any stock date that is considered an outlier
  identifyOutliers(data, sigma) {
    sigma = sigma;
    if (this.daysToSubtract === 365) {
      sigma = sigma * 0.5;
    }
    var days = 0;
    data.forEach((d) => {
      var pointOnLine = ((Math.floor((Date.parse(d.date) - Date.parse(this.xcoord.startDate.toISOString()))/86400000)) * this.dataSummary.regressionCoef) + this.dataSummary.intercept;
      //var pointOnLine = (days * this.dataSummary.regressionCoef) + this.dataSummary.intercept;
      if (+d.close > (pointOnLine + sigma) || +d.close < (pointOnLine - sigma)) {
        d.outlier = true;
      }
      days++;
    });
  }

  addViewport() {
    d3.select('.graph-pane')
      .append('svg')
      .attr('class', 'viewport')
      .attr('width', 700)
      .attr('height', 450)

    this.placeXAxis();
    this.placeYAxis();
  }

  placeXAxis() {
    d3.select('.viewport')
    .append('g')
    .attr('transform', 'translate(0,' + (450) + ')') //putting it at 'height' (== 250) pushes scale off the graph
    .call(this.xAxis)
  }

  placeYAxis() {
    d3.select('.viewport')
    .append('g')
    .attr('transform', 'translate(0,' + 0 + ')')
    .call(this.yAxis)
  }

  plotDataPoints() {

    var line = d3.line()
      .x((d) => { return this.xScale(Date.parse(d.date))})
      .y((d) => { return this.yScale(d.close)})


  var d3ViewPort =  d3.select('.viewport')
  var svg = d3ViewPort.append('svg')

  // var line = d3.line()
  //   .x((d) => { return this.xScale(Date.parse(d.date))})
  //   .y((d) => { return this.yScale(d.close)})
  console.log(this.dataCopy)
  var path = svg.append("path")
     .datum(this.dataCopy)
     .attr("id", "myLine")
     .attr("fill", "none")
     .attr("stroke", "red")
     .attr("stroke-linejoin", "round")
     .attr("stroke-linecap", "round")
     .attr("stroke-width", 2.5)
     .attr("d", line(this.dataCopy))

     var totalLength = path.node().getTotalLength();
     console.log(totalLength);

     d3.select("#myLine")
      .attr("stroke-dasharray", totalLength + " " + totalLength )
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .ease(d3.easeLinear)
      .duration(3000)
      .attr("stroke-dashoffset", 0)
      .style('opacity', 1)
      .transition()
      .duration(1500)
      .style('opacity', 0)
      .remove()
    //  d3.select("myLine").remove()
      setTimeout(()=> {this.plotDataPoints()}, 5000)
  // var dots = svg.append('g')
  // var that = this;
  // for (var i = 0; i < this.data.length; i++){
  //   var data = []
  //   data.push(this.data[i]);
  //   dots.append("circle")
  //     .data(data)
  //     .attr("r", 0)
  //     .attr("cx", (d) => { return this.xScale(Date.parse(d.date)) })
  //     .attr("cy", (d) => { return this.yScale(d.close) })
  //     .attr('close', data[0].close)
  //     .attr('date', data[0].date)
  //     .attr('outlier', (d) => { return (d.outlier ? true : false)})
  //     .on('mouseenter', function() {
  //       var dataPoint = d3.select(this);
  //       if (dataPoint.attr('outlier') === 'true') {
  //         that.showInfo(dataPoint);
  //         }
  //       })
  //       .on("mouseout", function() {
  //           d3.select('.viewport')
  //           .selectAll('rect').remove()
  //           d3.select('.viewport')
  //           .selectAll('.outlier-data').remove()
  //     })
  //     .style('stroke', 'black')
  //     .style('fill', 'white')
  //     .transition()
  //     .delay(this.delayFactor * i)
  //     .attr("r", 3.5)
  //       }
  //    setTimeout(() => {this.drawRegressionLine()}, this.millisecondDelay());
  //    setTimeout(() => {this.colorOutliersRed(this.data)}, this.millisecondDelay() + 750);
  }

  drawRegressionLine() {
    d3.select('.viewport')
    .append('g')
    .append('line')
    .attr('x1', this.xScale(Date.parse(this.line.start.x)))
    .attr('y1', this.yScale(this.line.start.y))
    .attr('x2', this.xScale(Date.parse(this.line.start.x)))
    .attr('y2', this.yScale(this.line.start.y))
    .transition()
    .duration(1000)
    .attr('x2', this.xScale(Date.parse(this.line.end.x)))
    .attr('y2', this.yScale(this.line.end.y))
    .style('stroke', 'black')
    .style('stroke-width', 3)
  }

  colorOutliersRed(data) {
    d3.select('.viewport')
    .selectAll('circle')
    .transition()
    .duration(1200)
    .style('stroke', (d) => { return (d.outlier ? '#ff0202' : '#bcbcbc'); })
    .style('fill', (d) => { return (d.outlier ? '#ff0202' : '#bcbcbc'); })
  }

showInfo(outlier) {
  var cx;
  if (outlier.attr('cx') > 350) {
    cx = outlier.attr('cx') - 115;
  } else {
    cx = outlier.attr('cx');
 }
  var d3ViewPort =  d3.select('.viewport')
  var svg = d3ViewPort.append('svg')
  var rect = svg.append('rect')
  .attr('width', 125)
  .attr('height', 55)
  .attr('class', 'outlier-info-box')
  .attr('x', cx)
  .attr('y', outlier.attr('cy'))
  .attr('rx', 5)
  .attr('ry', 5)

  svg.append('text')
  .attr('class', 'outlier-data')
  .attr("dx", function(d){return cx + 10})
  .attr("dy", function(d){return +outlier.attr('cy') + 20})
  .text("Date: " + outlier.attr('date'))

  svg.append('text')
  .attr('class', 'outlier-data')
  .attr("dx", function(d){return cx + 10})
  .attr("dy", function(d){return +outlier.attr('cy') + 42.5})
  .text("Close: $" + outlier.attr('close').slice(0,5))
  }

}

export default OutlierDetector;

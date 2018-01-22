import * as d3 from "d3";
import DateScale from "./DateScale.js"


class BollingerBands {
  constructor(data, currentDate, daysToSubtract) {
    this.data = data;
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

    this.upperBand = data;
    this.lowerBand = data;

    this.addViewport()
    this.placeLine(this.data)
    this.rollingMeanData = this.rollingMean(this.data, 7)
    this.placeLine(this.rollingMeanData, 'rolling')
    this.placeLine(this.upperBand, 'upper')

  }
  maxYdomain() {
    return parseInt(this.dataSummary.maxClosingValue) + (parseInt(this.dataSummary.maxClosingValue)/5.0);
  }

  minYdomain() {
    return parseInt(this.dataSummary.minClosingValue) - (parseInt(this.dataSummary.minClosingValue)/5.0);
  }

  addViewport() {
    d3.select('.bollinger-container')
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

  placeLine(data, type) {
    var lineColor;
    switch(type) {
      case "rolling":
        lineColor = 'red'
        break;
      case "upper":
        lineColor = 'purple'
        break;
      case "lower":
        lineColor = 'green'
        break;
      default:
        lineColor = 'steelblue'
    }
    var d3ViewPort = d3.select('.viewport')
    var svg = d3ViewPort.append('svg')

     var line = d3.line()
       .x((d) => { return this.xScale(Date.parse(d.date))})
       .y((d) => { return this.yScale(d.close)})

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line(data))
        .transition()
        .duration(500)
  }
  // draw(data) {
  //   svg.append("path")
  //       .attr("class", "line")
  //       .attr("d", placeLine(data));
  // }

  calculateSD(data, mean) {
    var sumSquares = data.reduce( (sum, d) => {
      return (sum + (Math.pow((d - mean), 2)))
    }, 0)
    return Math.sqrt(sumSquares / (data.length));
  }

  rollingMean(data, nDays) {

    var rollingMeanData = data;
    var upperBand = this.upperBand;
    var lowerBand = this.lowerBand;
    var rollingStorage = [];
    for (let i = 0; i < data.length; i++) {

      rollingStorage.push(data[i]['close']);
      if (i >= nDays) {
        rollingStorage.shift();
        var sum = rollingStorage.reduce( (sum,val) =>  {return  sum + val}, 0)
        var mean = sum / nDays
        rollingMeanData[i]['close'] = mean;
        upperBand[i]['close'] = mean + 2 * this.calculateSD(rollingStorage, mean);
      } else {
        rollingMeanData.shift();
        upperBand.shift();
        lowerBand.shift();
      }
    }
    console.log(upperBand)
    this.upperBand = upperBand;
    return rollingMeanData;
  }
}

export default BollingerBands;

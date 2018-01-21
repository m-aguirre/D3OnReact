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


    this.addViewport()
    this.placeLine(this.data)

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

  placeLine(data) {
    var d3ViewPort = d3.select('.viewport')
    var svg = d3ViewPort.append('svg')

     var line = d3.line()
       .x((d) => { console.log(d); return this.xScale(Date.parse(d.date))})
       .y((d) => {return this.yScale(d.close)})

    // svg.append("path")
    //  .attr("class", "line")
    //   .attr("d", line(data))

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
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
}

export default BollingerBands;

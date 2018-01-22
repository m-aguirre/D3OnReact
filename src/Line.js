
import * as d3 from "d3";

class Line {
  constructor(data, color, xScale, yScale) {

    this.xScale = xScale;
    this.yScale = yScale;

    this.placeLine(data, color)
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

      svg.insert("path")
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
}

export default Line;

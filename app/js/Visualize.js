var d3 = require('d3');

var width = 300;
var height = 800;
var r = 10

var jsonNodes = [];
var jsonLinks = [];

var svg = d3.select('#graph').append('svg')
  .attr('width', width).attr('height', height);

// Define marker
svg.append('defs').append('marker')
  .attr("id", 'markerArrowEnd') // ID of marker
  .attr("viewBox", "0 -5 10 10") // minX, minY, width and height of viewBox
  .attr("refX", 10) // Position where marker connect to the vertex
  .attr("refY", 0) // Position where marker connect to the vertex
  .attr("markerWidth", 8) // The width of marker
  .attr("markerHeight", 8) // The height of marker
  .attr("orient", "auto") // Rotation of marker
  .append("path") // Used to draw line
    .attr("d", 'M0,-5 L10,0 L0,5') // Draw triangle
    .attr('fill', 'black'); // Fill the triangle

var nodes = svg.selectAll('circle')
  .data(jsonNodes)
  .enter()
  .append('circle');

var links = svg.selectAll('line')
  .data(jsonLinks)
  .enter()
  .append('line');

var nodesAttr = nodes
  .attr("cx", function(d){ return d.x_axis; })
  .attr("cy", function(d){ return d.y_axis; })
  .attr("r", r)
  .style("fill", "white")
  .text(function(d){ return d.label });

var linksAttr = links
  .attr("x1", function(d){ return d.x1; })
  .attr("y1", function(d){ return d.y1; })
  .attr("x2", function(d){ return d.x2; })
  .attr("y2", function(d){ return d.y2; })
  .attr("stroke-width", 2)
  .attr("stroke", "black")
  .attr("marker-end", "url(#markerArrowEnd)");

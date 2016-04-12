var d3 = require('d3');
var CycleRemoval = require('./CycleRemoval.js');

function adjustEnds(fromPoint, toPoint) {
  var dx = toPoint.x - fromPoint.x,
    dy = toPoint.y - fromPoint.y,
    length = Math.sqrt(dx * dx + dy * dy);
  dx = dx / length * r;
  dy = dy / length * r;
  return {from: {x: fromPoint.x + dx, y: fromPoint.y + dy}, to: {x: toPoint.x - dx, y: toPoint.y - dy}};
}

var width = 800;
var height = 800;
var r = 10

var graph = {
  "nodes": [
    {"id": 1, "x": 20, "y": 20, "label": "A"},
    {"id": 2, "x": 100, "y": 100, "label": "B"}
  ],
  "links": [
    {"from": 1, "to": 2}
  ]
};

var jsonNodes = [{"x": 20, "y": 20, "label": "A"},
                 {"x": 100, "y": 100, "label": "B"}];
var jsonLinks = [{"from": 1, "to": 2}];

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
  .data(graph.nodes)

var nodesEnter = nodes.enter().append('g')
  .attr('class', 'node');

nodesEnter.each(function(d){
  d3.select(this)
  .append('circle')
    .attr("cx", d.x)
    .attr("cy", d.y)
    .attr("r", r)
    .style("fill", "white")
  .append('text')
    .text(d.label)
    .attr({x: d.x, y: d.y}) // Calculate its position7
});

nodes.exit().remove();

var links = svg.selectAll('line')
  .data(graph.links);

var linksEnter = links.enter().append('line')
  .attr('class', 'link');

linksEnter.each(function (d){
  var adjustedEnds = adjustEnds(CycleRemoval.getNodeById(d.from, graph.nodes), CycleRemoval.getNodeById(d.to, graph.nodes));
  d3.select(this)
    .attr("x1", function(d) { return adjustedEnds.from.x; })
    .attr("y1", function(d) { return adjustedEnds.from.y; })
    .attr("x2", function(d) { return adjustedEnds.to.x; })
    .attr("y2", function(d) { return adjustedEnds.to.y; })
    .attr("marker-end", "url(#markerArrowEnd)");
});

links.exit().remove();

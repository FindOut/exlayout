var d3 = require('d3');
var CycleRemoval = require('./CycleRemoval.js');
var XCoordinateAssignment = require("./XCoordinateAssignment.js");
var LongestPath = require("./LongestPath.js");
var VertexOrdering = require("./VertexOrdering.js");
var Initialize = require("./Initialize.js");


function adjustEnds(fromPoint, toPoint) {
  var dx = xScale(toPoint.x) - xScale(fromPoint.x),
    dy = yScale(toPoint.rank) - yScale(fromPoint.rank),
    length = Math.sqrt(dx * dx + dy * dy);
  dx = dx / length * r;
  dy = dy / length * r;
  return {from: {x: xScale(fromPoint.x) + dx, rank: yScale(fromPoint.rank) + dy}, to: {x: xScale(toPoint.x) - dx, rank: yScale(toPoint.rank) - dy}};
}

var width = 800;
var height = 800;
var r = 20;

var Graph = {
  "nodes": [
    {"id": 1, "label": "A"},
    {"id": 2, "label": "B"},
    {"id": 3, "label": "C"}
  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 2, "to": 3},
    {"from": 3, "to": 1}
  ]
};

Initialize.initialize(Graph);
CycleRemoval.cycleRemoval(Graph);
LongestPath.layering(Graph);
VertexOrdering.vertexOrdering(Graph);
XCoordinateAssignment.xCoordinateAssignment(Graph);
var len = Graph.links.length;
var reversedEdges = [];
console.log(Graph);
for(var i = 0; i < len; i++)
{
  if(Graph.links[i].isReversed)
  {
    console.log(Graph.links[i]);
    reversedEdges.push(Graph.links[i]);
  }
}
CycleRemoval.reverse(reversedEdges);
var maxX = Number.MIN_VALUE;
var minX = Number.MAX_VALUE;
var maxY= Number.MIN_VALUE;
var minY = Number.MAX_VALUE;
len = Graph.nodes.length;
for(var i = 0; i < len; i++)
{
  if(Graph.nodes[i].x > maxX)
  {
    maxX = Graph.nodes[i].x;
  }else if(Graph.nodes[i].x < minX){
    minX = Graph.nodes[i].x;
  }
  if(Graph.nodes[i].rank > maxY)
  {
    maxY = Graph.nodes[i].rank;
  }else if(Graph.nodes[i].rank < minY){
    minY = Graph.nodes[i].rank;
  }
}
var yScale = d3.scale.linear()
                      .domain([maxY, minY])
                      .range([2*r, height-2*r]);
var xScale = d3.scale.linear()
                      .domain([minX, maxX])
                      .range([2*r, width-2*r]);

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
  .data(Graph.nodes)

var nodesEnter = nodes.enter().append('g')
  .attr('class', 'node');

nodesEnter.each(function(d){
  d3.select(this)
  .append('circle')
    .attr("cx", xScale(d.x))
    .attr("cy", yScale(d.rank))
    .attr("r", r)
    .style("fill", "white");

  d3.select(this)
  .append('text')
    .text(d.label)
    .attr({x: xScale(d.x)-r/4, y: yScale(d.rank)+r/4});
});

nodes.exit().remove();

var links = svg.selectAll('line')
  .data(Graph.links);

var linksEnter = links.enter().append('line')
  .attr('class', 'link');

linksEnter.each(function (d){
  var adjustedEnds = adjustEnds(CycleRemoval.getNodeById(d.from, Graph.nodes), CycleRemoval.getNodeById(d.to, Graph.nodes));
  d3.select(this)
    .attr("x1", function(d) { return adjustedEnds.from.x; })
    .attr("y1", function(d) { return adjustedEnds.from.rank; })
    .attr("x2", function(d) { return adjustedEnds.to.x; })
    .attr("y2", function(d) { return adjustedEnds.to.rank; })
    .attr("marker-end", "url(#markerArrowEnd)");
});

links.exit().remove();

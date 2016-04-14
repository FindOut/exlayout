var d3 = require('d3');
var CycleRemoval = require('./CycleRemoval.js');
var XCoordinateAssignment = require("./XCoordinateAssignment.js");
var LongestPath = require("./LongestPath.js");
var VertexOrdering = require("./VertexOrdering.js");


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
    {"id": 1, "label": "A", "rank": 5, "isDummy": false, "group": 1, "order": 1},
    {"id": 2, "label": "B", "rank": 5, "isDummy": false, "group": 1, "order": 2},
    {"id": 3, "label": "C", "rank": 4, "isDummy": false, "group": 1, "order": 1},
    {"id": 4, "label": "D", "rank": 4, "isDummy": false, "group": 1, "order": 2},
    {"id": 5, "label": "E", "rank": 4, "isDummy": true, "group": 1, "order": 3},
    {"id": 6, "label": "F", "rank": 4, "isDummy": false, "group": 1, "order": 4},
    {"id": 7, "label": "G", "rank": 4, "isDummy": true, "group": 1, "order": 5},
    {"id": 8, "label": "H", "rank": 4, "isDummy": true, "group": 1,"order": 6},
    {"id": 9, "label": "I", "rank": 4, "isDummy": false, "group": 1, "order": 7},
    {"id": 10, "label": "J", "rank": 4, "isDummy": false, "group": 1, "order": 8},
    {"id": 11, "label": "K", "rank": 3, "isDummy": false, "group": 1, "order": 1},
    {"id": 12, "label": "L", "rank": 3, "isDummy": false, "group": 1, "order": 2},
    {"id": 13, "label": "M", "rank": 3, "isDummy": true, "group": 1, "order": 3},
    {"id": 14, "label": "N", "rank": 3, "isDummy": true, "group": 1, "order": 4},
    {"id": 15, "label": "O", "rank": 3, "isDummy": true, "group": 1, "order": 5},
    {"id": 16, "label": "P", "rank": 3, "isDummy": false, "group": 1, "order": 6},
    {"id": 17, "label": "Q", "rank": 2, "isDummy": false, "group": 1,"order": 1},
    {"id": 18, "label": "R", "rank": 2, "isDummy": false, "group": 1, "order": 2},
    {"id": 19, "label": "S", "rank": 2, "isDummy": true, "group": 1, "order": 3},
    {"id": 20, "label": "T", "rank": 2, "isDummy": true, "group": 1, "order": 4},
    {"id": 21, "label": "U", "rank": 2, "isDummy": true, "group": 1, "order": 5},
    {"id": 22, "label": "V", "rank": 2, "isDummy": false, "group": 1,"order": 6},
    {"id": 23, "label": "W", "rank": 2, "isDummy": true, "group": 1, "order": 7},
    {"id": 24, "label": "X", "rank": 1, "isDummy": false, "group": 1, "order": 1},
    {"id": 25, "label": "Y", "rank": 1, "isDummy": false, "group": 1, "order": 2},
    {"id": 26, "label": "Z", "rank": 1, "isDummy": false, "group": 1,"order": 3}


  ],
  "links": [
    {"from": 1, "to": 3, "ismark": false},
    {"from": 1, "to": 8, "ismark": false},
    {"from": 1, "to": 10, "ismark": false},
    {"from": 2, "to": 5, "ismark": false},
    {"from": 2, "to": 7, "ismark": false},
    {"from": 4, "to": 12, "ismark": false},
    {"from": 5, "to": 12, "ismark": false},
    {"from": 6, "to": 12, "ismark": false},
    {"from": 7, "to": 13, "ismark": false},
    {"from": 8, "to": 14, "ismark": false},
    {"from": 9, "to": 12, "ismark": false},
    {"from": 9, "to": 16, "ismark": false},
    {"from": 10, "to": 12, "ismark": false},
    {"from": 10, "to": 15, "ismark": false},
    {"from": 11, "to": 17, "ismark": false},
    {"from": 11, "to": 18, "ismark": false},
    {"from": 11, "to": 22, "ismark": false},
    {"from": 13, "to": 20, "ismark": false},
    {"from": 14, "to": 21, "ismark": false},
    {"from": 15, "to": 22, "ismark": false},
    {"from": 16, "to": 19, "ismark": false},
    {"from": 16, "to": 23, "ismark": false},
    {"from": 17, "to": 24, "ismark": false},
    {"from": 17, "to": 25, "ismark": false},
    {"from": 18, "to": 25, "ismark": false},
    {"from": 19, "to": 24, "ismark": false},
    {"from": 20, "to": 26, "ismark": false},
    {"from": 21, "to": 26, "ismark": false},
    {"from": 22, "to": 26, "ismark": false},
    {"from": 23, "to": 26, "ismark": false}
  ]
};

CycleRemoval.cycleRemoval(Graph);
LongestPath.layering(Graph);
VertexOrdering.vertexOrdering(Graph);
XCoordinateAssignment.xCoordinateAssignment(Graph);
var maxX = Number.MIN_VALUE;
var minX = Number.MAX_VALUE;
var maxY= Number.MIN_VALUE;
var minY = Number.MAX_VALUE;
var len = Graph.nodes.length;
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

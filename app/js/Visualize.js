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

var r = 20;

/*var Graph = {
  "nodes": [
    {"id": 1, "label": "A"},
    {"id": 2, "label": "B"},
    {"id": 3, "label": "C"},
    {"id": 4, "label": "D"},
    {"id": 5, "label": "E"},
    {"id": 6, "label": "F"},
    {"id": 7, "label": "G"},
    {"id": 8, "label": "H"},
    {"id": 9, "label": "I"},
    {"id": 10, "label": "J"},
    {"id": 11, "label": "K"},
    {"id": 12, "label": "L"},
    {"id": 13, "label": "M"},
    {"id": 14, "label": "N"},
    {"id": 15, "label": "O"},
    {"id": 16, "label": "P"}
  ],
  "links": [
    {"from": 1, "to": 3},
    {"from": 1, "to": 7},
    {"from": 1, "to": 16},
    {"from": 2, "to": 9},
    {"from": 2, "to": 16},
    {"from": 4, "to": 9},
    {"from": 5, "to": 9},
    {"from": 6, "to": 9},
    {"from": 6, "to": 10},
    {"from": 7, "to": 9},
    {"from": 7, "to": 13},
    {"from": 8, "to": 11},
    {"from": 8, "to": 12},
    {"from": 8, "to": 13},
    {"from": 10, "to": 14},
    {"from": 10, "to": 16},
    {"from": 11, "to": 14},
    {"from": 11, "to": 15},
    {"from": 12, "to": 15},
    {"from": 13, "to": 16}
  ]
};*/

var Graph = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 0, "order": 0, "isDummy": false},
    {"id": 2, "label": "B", "rank": 0, "order": 0, "isDummy": false},
    {"id": 3, "label": "C", "rank": 0, "order": 0, "isDummy": false},
    {"id": 4, "label": "D", "rank": 0, "order": 0, "isDummy": false},
    {"id": 5, "label": "E", "rank": 0, "order": 0, "isDummy": false},
    {"id": 6, "label": "F", "rank": 0, "order": 0, "isDummy": false},
    {"id": 7, "label": "G", "rank": 0, "order": 0, "isDummy": false}
  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 2, "to": 3},
    {"from": 2, "to": 5},
    {"from": 2, "to": 4},
    {"from": 3, "to": 5},
    {"from": 4, "to": 5},
    {"from": 5, "to": 6},
    {"from": 7, "to": 4}
  ]
};

Initialize.initialize(Graph);
CycleRemoval.cycleRemoval(Graph);
LongestPath.layering(Graph);
VertexOrdering.vertexOrdering(Graph);
Graph.nodes.sort(function(a,b){
  return a.id - b.id;
});
XCoordinateAssignment.xCoordinateAssignment(Graph);
var len = Graph.links.length;
var reversedEdges = [];
for(var i = 0; i < len; i++)
{
  if(Graph.links[i].isReversed)
  {
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

var width = (maxX-minX)*4*r+4*r;
var height = (maxY-minY)*5*r+4*r;
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
  if(!d.isDummy){
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
  }
});

nodes.exit().remove();

var links = svg.selectAll('line')
  .data(Graph.links);

var linksEnter = links.enter().append('line')
  .attr('class', 'link');

linksEnter.each(function (d){
  var fromNode = CycleRemoval.getNodeById(d.from, Graph.nodes);
  var toNode = CycleRemoval.getNodeById(d.to, Graph.nodes);
  var adjustedEnds = adjustEnds(fromNode, toNode);
  if(!fromNode.isDummy && !toNode.isDummy)
  {
    d3.select(this)
      .attr("x1", function(d) { return adjustedEnds.from.x; })
      .attr("y1", function(d) { return adjustedEnds.from.rank; })
      .attr("x2", function(d) { return adjustedEnds.to.x; })
      .attr("y2", function(d) { return adjustedEnds.to.rank; })
      .attr("marker-end", "url(#markerArrowEnd)");
  }else if(fromNode.isDummy && !toNode.isDummy){
    d3.select(this)
      .attr("x1", function(d) { return xScale(fromNode.x); })
      .attr("y1", function(d) { return yScale(fromNode.rank); })
      .attr("x2", function(d) { return adjustedEnds.to.x; })
      .attr("y2", function(d) { return adjustedEnds.to.rank; })
      .attr("marker-end", "url(#markerArrowEnd)");
  }else if(!fromNode.isDummy && toNode.isDummy){
    d3.select(this)
      .attr("x1", function(d) { return adjustedEnds.from.x; })
      .attr("y1", function(d) { return adjustedEnds.from.rank; })
      .attr("x2", function(d) { return xScale(toNode.x); })
      .attr("y2", function(d) { return yScale(toNode.rank); });
  }else{
    d3.select(this)
      .attr("x1", function(d) { return xScale(fromNode.x); })
      .attr("y1", function(d) { return yScale(fromNode.rank); })
      .attr("x2", function(d) { return xScale(toNode.x); })
      .attr("y2", function(d) { return yScale(toNode.rank); });
  }
});

links.exit().remove();

var d3 = require('d3');
var CycleRemoval = require('./CycleRemoval.js');
var XCoordinateAssignment = require("./XCoordinateAssignment.js");
var LongestPath = require("./LongestPath.js");
var VertexOrdering = require("./VertexOrdering.js");
var Initialize = require("./Initialize.js");
var Sugiyama = require("./Sugiyama.js");
var ConnectedGraphDetect = require("./ConnectedGraphDetection.js");
var DragHelper = require('./DragHelper.js');
var Main = require("./main.js");

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

/*var Graph = {
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
};*/

/*var Graph = {
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
};*/

/*var Graph = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 0, "isDummy": false},
    {"id": 2, "label": "B", "rank": 0, "isDummy": false},
    {"id": 3, "label": "C", "rank": 0, "isDummy": false},
    {"id": 4, "label": "D", "rank": 0, "isDummy": false},
    {"id": 5, "label": "E", "rank": 0, "isDummy": false},
    {"id": 6, "label": "F", "rank": 0, "isDummy": false},
    {"id": 7, "label": "G", "rank": 0, "isDummy": false},
    {"id": 8, "label": "H", "rank": 0, "isDummy": false},
    {"id": 9, "label": "I", "rank": 0, "isDummy": false},
    {"id": 10, "label": "J", "rank": 0, "isDummy": false},
    {"id": 11, "label": "K", "rank": 0, "isDummy": false}
  ],
  "links": [
    {"from": 1, "to": 3},
    {"from": 1, "to": 4},
    {"from": 1, "to": 5},
    {"from": 2, "to": 4},
    {"from": 2, "to": 6},
    {"from": 3, "to": 7},
    {"from": 3, "to": 8},
    {"from": 3, "to": 9},
    {"from": 4, "to": 8},
    {"from": 5, "to": 9},
    {"from": 6, "to": 11},
    {"from": 8, "to": 10},
    {"from": 8, "to": 11}
  ]
};*/

var Graph = {
  "nodes": [
    {"id": 1, "label": "A"},
    {"id": 2, "label": "B"},
    {"id": 3, "label": "C"},
    {"id": 4, "label": "D"},
    {"id": 5, "label": "E"},
    {"id": 6, "label": "F"},
    {"id": 7, "label": "G"}
  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 1, "to": 3},
    {"from": 2, "to": 4},
    {"from": 2, "to": 5},
    {"from": 3, "to": 6},
    {"from": 3, "to": 7}
  ]
};
/*var Graph = {
  "nodes": [
    {"id": 1, "label": "A", "rank": 0, "isDummy": false},
    {"id": 2, "label": "B", "rank": 0, "isDummy": false},
    {"id": 3, "label": "C", "rank": 0, "isDummy": false},
    {"id": 4, "label": "D", "rank": 0, "isDummy": false},
    {"id": 5, "label": "E", "rank": 0, "isDummy": false},
    {"id": 6, "label": "F", "rank": 0, "isDummy": false},
    {"id": 7, "label": "G", "rank": 0, "isDummy": false},
    {"id": 8, "label": "H", "rank": 0, "isDummy": false},
    {"id": 9, "label": "I", "rank": 0, "isDummy": false},
    {"id": 10, "label": "J", "rank": 0, "isDummy": false},
    {"id": 11, "label": "K", "rank": 0, "isDummy": false},
    {"id": 12, "label": "L", "rank": 0, "isDummy": false},
    {"id": 13, "label": "M", "rank": 0, "isDummy": false},
    {"id": 14, "label": "N", "rank": 0, "isDummy": false},
    {"id": 15, "label": "O", "rank": 0, "isDummy": false},
    {"id": 16, "label": "P", "rank": 0, "isDummy": false}
  ],
  "links": [
    {"from": 1, "to": 14},
    {"from": 1, "to": 9},
    {"from": 1, "to": 15},
    {"from": 1, "to": 8},
    {"from": 2, "to": 3},
    {"from": 2, "to": 14},
    {"from": 2, "to": 10},
    {"from": 3, "to": 13},
    {"from": 3, "to": 14},
    {"from": 3, "to": 11},
    {"from": 3, "to": 15},
    {"from": 4, "to": 10},
    {"from": 4, "to": 7},
    {"from": 4, "to": 12},
    {"from": 4, "to": 9},
    {"from": 5, "to": 8},
    {"from": 6, "to": 11},
    {"from": 6, "to": 8},
    {"from": 6, "to": 10},
    {"from": 6, "to": 7},
    {"from": 7, "to": 16},
    {"from": 8, "to": 15},
    {"from": 9, "to": 16},
    {"from": 10, "to": 12},
    {"from": 10, "to": 15},
    {"from": 11, "to": 15}
  ]
};*/

/*var Graph = {
  "nodes": [
    {"id": 1, "label": "A"},
    {"id": 2, "label": "B"},
    {"id": 3, "label": "C"},
    {"id": 4, "label": "D"},
    {"id": 5, "label": "E"},
    {"id": 6, "label": "F"},
    {"id": 7, "label": "G"}，
    {"id": 8, "label": "H"}，
    {"id": 9, "label": "I"}，
    {"id": 10, "label": "J"}，
    {"id": 11, "label": "K"}，
    {"id": 12, "label": "L"}，
    {"id": 13, "label": "M"}，
    {"id": 14, "label": "N"}，
    {"id": 15, "label": "O"}
  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 1, "to": 3},
    {"from": 2, "to": 4},
    {"from": 2, "to": 5},
    {"from": 3, "to": 6},
    {"from": 3, "to": 7},
    {"from": 4, "to": 8},
    {"from": 4, "to": 9},
    {"from": 5, "to": 10},
    {"from": 5, "to": 11},
    {"from": 6, "to": 12},
    {"from": 6, "to": 13},
    {"from": 7, "to": 14},
    {"from": 7, "to": 15}
  ]
};*/

/*var Graph = {
  "nodes": [
    {"id": 1, "label": "A"},
    {"id": 2, "label": "B"},
    {"id": 3, "label": "C"},
    {"id": 4, "label": "D"},
    {"id": 5, "label": "E"},
    {"id": 6, "label": "F"}
  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 1, "to": 5},
    {"from": 2, "to": 3},
    {"from": 3, "to": 1},
    {"from": 3, "to": 4},
    {"from": 4, "to": 5},
    {"from": 4, "to": 6},
    {"from": 5, "to": 2},
    {"from": 5, "to": 3},
    {"from": 6, "to": 5}
  ]
};*/

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
    {"id": 14, "label": "N"}
  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 2, "to": 3},
    {"from": 2, "to": 5},
    {"from": 2, "to": 4},
    {"from": 3, "to": 5},
    {"from": 4, "to": 5},
    {"from": 5, "to": 6},
    {"from": 7, "to": 4},

    {"from": 8, "to": 9},
    {"from": 8, "to": 10},
    {"from": 10, "to": 11},
    {"from": 10, "to": 12},
    {"from": 9, "to": 13},
    {"from": 9, "to": 14}
  ]
};*/

/*var Graph = {
  "nodes": [
    {"id": 1, "label": "H"},
    {"id": 2, "label": "I"},
    {"id": 3, "label": "J"},
    {"id": 4, "label": "K"},
    {"id": 5, "label": "L"},
    {"id": 6, "label": "M"},
    {"id": 7, "label": "N"}
  ],
  "links": [
    {"from": 1, "to": 2},
    {"from": 1, "to": 3},
    {"from": 2, "to": 4},
    {"from": 2, "to": 5},
    {"from": 3, "to": 6},
    {"from": 3, "to": 7}
  ]
};*/

graphArray = Main.main(Graph);
var len1 = graphArray.length;
var len2;
var maxX;
var minX;
var maxY;
var minY;
var globalMaxX = Number.MIN_VALUE;
var globalMinX = Number.MAX_VALUE;
var globalMaxY = Number.MIN_VALUE;
var globalMinY = Number.MAX_VALUE;
var currentGraph;
for(var i = 0; i < len1; i++)
{
  maxX = Number.MIN_VALUE;
  minX = Number.MAX_VALUE;
  maxY= Number.MIN_VALUE;
  minY = Number.MAX_VALUE;
  currentGraph = graphArray[i];
  len2 = currentGraph.nodes.length;
  for(var j = 0; j < len2; j++)
  {
    if(currentGraph.nodes[j].x > maxX)
    {
      maxX = currentGraph.nodes[j].x;
    }else if(currentGraph.nodes[j].x < minX){
      minX = currentGraph.nodes[j].x;
    }
    if(currentGraph.nodes[j].rank > maxY)
    {
      maxY = currentGraph.nodes[j].rank;
    }else if(currentGraph.nodes[j].rank < minY){
      minY = currentGraph.nodes[j].rank;
    }
  }
  if(maxX > globalMaxX)
  {
    globalMaxX = maxX;
  }
  if(minX < globalMinX)
  {
    globalMinX = minX;
  }
  if(maxY > globalMaxY)
  {
    globalMaxY = maxY;
  }
  if(minY < globalMinY)
  {
    globalMinY = minY;
  }
  currentGraph.maxX = maxX;
  currentGraph.minX = minX;
  currentGraph.maxY = maxY;
  currentGraph.minY = minY;
}
var width = 0;;
var height = 0;
/*for(i = 0; i < len1; i++)
{
  width = (graphArray[i].maxX-graphArray[i].minX)*5*r+width;
  height = (graphArray[i].maxY-graphArray[i].minY)*5*r+height;
}*/
width = len1*(globalMaxX-globalMinX)*5*r;
height = len1*(globalMaxY-globalMinY)*5*r;

var yScale = d3.scale.linear()
                      .domain([globalMaxY, globalMinY])
                      .range([r, (globalMaxY-globalMinY)*5*r-r]);
var xScale = d3.scale.linear()
                      .domain([globalMinX, globalMaxX])
                      .range([r, (globalMaxX-globalMinX)*5*r-r]);

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

var drag = d3.behavior.drag()
      .on("drag", dragmove(d,Graph));

var nodes = svg.selectAll('circle')
  .data(Graph.nodes);

var graphs = svg.selectAll("Graph")
  .data(graphArray);


var graphsEnter = graphs.enter().append('g')
  .attr('class', 'graph');




nodesEnter.each(function(d){
  if(!d.isDummy){
    d3.select(this)
    .append('circle')
      .attr("cx", xScale(d.x))
      .attr("cy", yScale(d.rank))
      .attr("r", r)
      .attr("id", d.id)
      .style("fill", "white")
      .call(drag);


graphsEnter.each(function(d,i){

  var nodes = d3.select(this).selectAll('circle')
                .data(graphArray[i].nodes);

  var nodesEnter = nodes.enter().append('g')
                    .attr('class', 'node');

  nodesEnter.each(function(d){
    if(!d.isDummy)
    {
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


  var links = d3.select(this).selectAll('line')
    .data(graphArray[i].links);

  var linksEnter = links.enter().append('line')
    .attr('class', 'link');

  linksEnter.each(function (d){
    var fromNode = CycleRemoval.getNodeById(d.from, graphArray[i].nodes);
    var toNode = CycleRemoval.getNodeById(d.to, graphArray[i].nodes);
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
});

var graphArrayCoordinate = {"graphs": [], "links": []};

graphsEnter.each(function(d){
  var bbox = this.getBBox();
  var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
  graphArrayCoordinate.graphs.push({"x": bbox.x+bbox.width/2, "y": bbox.y+bbox.height/2,
                                    "old_x": bbox.x+bbox.width/2, "old_y": bbox.y+bbox.height/2, "halfDigonal": halfDigonal});
})

for(i = 0; i < len1; i++)
{
  for(j = i+1; j < len1; j++)
  {
    graphArrayCoordinate.links.push({"source": i, "target": j});
  }
}

var force = d3.layout.force()
              .size([width, height])
              .linkDistance(function(d){
                return(graphArrayCoordinate.graphs[d.source.index].halfDigonal+graphArrayCoordinate.graphs[d.target.index].halfDigonal);
              })
              .on("tick", tick);

  force
    .nodes(graphArrayCoordinate.graphs)
    .links(graphArrayCoordinate.links)
    .start();

function tick()
    {
      graphsEnter.each(function(d,i){
      var dx = graphArrayCoordinate.graphs[i].x - graphArrayCoordinate.graphs[i].old_x;
      var dy = graphArrayCoordinate.graphs[i].y - graphArrayCoordinate.graphs[i].old_y;

      d3.select(this)
      .attr("transform", "translate("+dx+","+dy+")");
    }

function dragmove(d, graph) {
  var x = d3.event.x;
  var y = d3.event.y;
  d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
  var ingoingLinks = d3.selectAll("[to=" + d.attr("id") + "]");
  ingoingLinks.each(function (d){
    var fromNode = CycleRemoval.getNodeById(d.from, Graph.nodes);
    var toNode = CycleRemoval.getNodeById(d.to, Graph.nodes);
    var adjustedEnds = adjustEnds(fromNode, toNode);
    d3.select(d)
      .attr("x2", function(d) { return adjustEnds.to.x; })
      .attr("y2", function(d) { return adjustEnds.to.rank; });
  });
}

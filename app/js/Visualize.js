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

function adjustDragEnds(fromPoint, toPoint) {
  var dx = toPoint.x-fromPoint.x;
  var dy = toPoint.y-fromPoint.y;
  var length = Math.sqrt(dx * dx + dy * dy);
  dx = dx / length * r;
  dy = dy / length * r;
  console.log(parseInt(fromPoint.y) + dy);
  return {from: {x: parseInt(fromPoint.x) + dx, y: parseInt(fromPoint.y) + dy}, to: {x: parseInt(toPoint.x) - dx, y: parseInt(toPoint.y) - dy}};
}

var r = 20;
var dummyR = 0;

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

/*var Graph = {
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

var Graph = {
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
    {"id": 16, "label": "P"},
    {"id": 17, "label": "Q"},
    {"id": 18, "label": "R"},
    {"id": 19, "label": "S"},
    {"id": 20, "label": "T"},
    {"id": 21, "label": "U"},
    {"id": 22, "label": "V"},
    {"id": 23, "label": "W"},
    {"id": 24, "label": "X"},
    {"id": 25, "label": "Y"}
    /*{"id": 26, "label": "Z"},
    {"id": 27, "label": "AA"},
    {"id": 28, "label": "AB"},
    {"id": 29, "label": "AC"},
    {"id": 30, "label": "AD"},
    {"id": 31, "label": "AE"},
    {"id": 32, "label": "AF"},
    {"id": 33, "label": "AG"},
    {"id": 34, "label": "AH"},
    {"id": 35, "label": "AI"},
    {"id": 36, "label": "AJ"},
    {"id": 37, "label": "AK"},
    {"id": 38, "label": "AL"}*/
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
    {"from": 9, "to": 14},
    {"from": 11, "to": 15},
    {"from": 11, "to": 16},
    {"from": 12, "to": 17},
    {"from": 12, "to": 18},
    {"from": 13, "to": 19},
    {"from": 13, "to": 20},
    {"from": 14, "to": 21},
    {"from": 14, "to": 22},

    {"from": 23, "to": 24},
    {"from": 24, "to": 25},
    {"from": 25, "to": 23}
    /*{"from": 15, "to": 23},
    {"from": 15, "to": 24},
    {"from": 16, "to": 25},
    {"from": 16, "to": 26},
    {"from": 17, "to": 27},
    {"from": 17, "to": 28},
    {"from": 18, "to": 29},
    {"from": 18, "to": 30},
    {"from": 19, "to": 31},
    {"from": 19, "to": 32},
    {"from": 20, "to": 33},
    {"from": 20, "to": 34},
    {"from": 21, "to": 35},
    {"from": 21, "to": 36},
    {"from": 22, "to": 37},
    {"from": 22, "to": 38}*/
  ]
};

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

var drag = d3.behavior.drag()
            .on("drag", dragmove)
            .on("dragstart", dragstart)
            .on("dragend", dragend);

var zoom = d3.behavior.zoom()
            .on("zoom", zoomed);

var svg = d3.select('#graph').append('svg')
  .attr('width', width)
  .attr('height', height)
  .call(zoom);

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

var graph = svg.selectAll(".graph")
  .data(graphArray);

var graphEnter = graph.enter().append('g')
  .attr('class', 'graph');



graphEnter.each(function(d,i){

  var nodes = d3.select(this).selectAll('circle')
                .data(graphArray[i].nodes);
  //console.log(graphArray[i]);
  var graphNumber = i+1;
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
          .attr("id", "name"+d.id)
          .attr("isDummy", "false")
          .style("fill", "white")

      d3.select(this)
        .append('text')
          .text(d.label)
          .attr({x: xScale(d.x)-r/4, y: yScale(d.rank)+r/4});

      d3.select(this)
        .attr("graph",graphNumber)
        .call(drag);
    }
    else {
      d3.select(this)
        .append('circle')
          .attr("cx", xScale(d.x))
          .attr("cy", yScale(d.rank))
          .attr("r", dummyR)
          .attr("id", "name"+d.id)
          .attr("graph",graphNumber)
          .attr("isDummy", "true")
          .style("fill", "white")

      /*d3.select(this)
        .append('text')
          .text(d.label)
          .attr({x: xScale(d.x)-r/4, y: yScale(d.rank)+r/4});*/

      d3.select(this)
        .call(drag);
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
        .attr("from", d.from)
        .attr("to", d.to)
        .attr("graph", graphNumber)
        .attr("marker-end", "url(#markerArrowEnd)");
      //  console.log(graphNumber);
    }else if(fromNode.isDummy && !toNode.isDummy){
      d3.select(this)
        .attr("x1", function(d) { return xScale(fromNode.x); })
        .attr("y1", function(d) { return yScale(fromNode.rank); })
        .attr("x2", function(d) { return adjustedEnds.to.x; })
        .attr("y2", function(d) { return adjustedEnds.to.rank; })
        .attr("from", d.from)
        .attr("to", d.to)
        .attr("graph", graphNumber)
        .attr("marker-end", "url(#markerArrowEnd)");
    }else if(!fromNode.isDummy && toNode.isDummy){
      d3.select(this)
        .attr("x1", function(d) { return adjustedEnds.from.x; })
        .attr("y1", function(d) { return adjustedEnds.from.rank; })
        .attr("x2", function(d) { return xScale(toNode.x); })
        .attr("y2", function(d) { return yScale(toNode.rank); })
        .attr("from", d.from)
        .attr("to", d.to)
        .attr("graph", graphNumber);
    }else{
      d3.select(this)
        .attr("x1", function(d) { return xScale(fromNode.x); })
        .attr("y1", function(d) { return yScale(fromNode.rank); })
        .attr("x2", function(d) { return xScale(toNode.x); })
        .attr("y2", function(d) { return yScale(toNode.rank); })
        .attr("from", d.from)
        .attr("to", d.to)
        .attr("graph", graphNumber);
    }
  });

  links.exit().remove();
});

var graphArrayCoordinate = {"graphs": [], "links": []};

var maxDigonal = Number.MIN_VALUE;

graphEnter.each(function(d){
  var bbox = this.getBBox();
  var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
  if(halfDigonal > maxDigonal)
  {
    maxDigonal = halfDigonal;
  }
  graphArrayCoordinate.graphs.push({"x": bbox.x+bbox.width/2, "y": bbox.y+bbox.height/2,
                                    "old_x": bbox.x+bbox.width/2, "old_y": bbox.y+bbox.height/2, "halfDigonal": halfDigonal});
});



var force = d3.layout.force()
              .size([width, height])
              //.charge(20000)
              /*.linkStrength(function(d){
                if(d.source.index == 0)
                {
                  console.log(d.target.halfDigonal/maxDigonal);
                  return d.target.halfDigonal/maxDigonal;
                }
              })
              .linkDistance(function(d){
                if(d.source.index == 0)
                {
                  return maxDigonal/d.target.halfDigonal;
                }
              })*/
              .on("tick", tick)
              .on("start", init(graphArrayCoordinate))
              .on("end", debug(graphArrayCoordinate));

force
  .nodes(graphArrayCoordinate.graphs)
  //.links(graphArrayCoordinate.links)
  .start();

var graphRepresent = svg.selectAll(".graphRepresent")
  .data(graphArrayCoordinate.graphs);

var graphRepresentEnter = graphRepresent.enter().append('circle')
  .attr('class', 'graphRepresent')
  .attr("cx", function(d,i){return graphArrayCoordinate.graphs[i].x})
  .attr("cy", function(d,i){return graphArrayCoordinate.graphs[i].y})
  .attr("r", function(d,i){return graphArrayCoordinate.graphs[i].halfDigonal})
  .attr("fill-opacity", 0);

function debug(graphArrayCoordinate)
{
}

function init(graphArrayCoordinate)
{
}

function tick()
{
  var q = d3.geom.quadtree(graphArrayCoordinate.graphs);
  var i = 0;
  var n = graphArrayCoordinate.graphs.length;

  while(i < n)
  {
    q.visit(collide(graphArrayCoordinate.graphs[i]));
    i++;
  }

  d3.selectAll(".graph").each(function(d,i){
    var dx = graphArrayCoordinate.graphs[i].x - graphArrayCoordinate.graphs[i].old_x;
    var dy = graphArrayCoordinate.graphs[i].y - graphArrayCoordinate.graphs[i].old_y;
    graphArrayCoordinate.graphs[i].old_x = graphArrayCoordinate.graphs[i].x;
    graphArrayCoordinate.graphs[i].old_y = graphArrayCoordinate.graphs[i].y;
    //console.log(dy);
    d3.select(this).selectAll("g").each(function(d){
      var cx = parseInt(d3.select(this).select("circle").attr("cx"), 10)+dx;
      var cy = parseInt(d3.select(this).select("circle").attr("cy"), 10)+dy;
      d3.select(this).select("circle")
        .attr("cx", cx)
        .attr("cy", cy);
      d3.select(this).select("text")
        .attr({x: cx-r/4, y: cy+r/4});

    });

    d3.select(this).selectAll("line").each(function(d){
      var x1 = parseInt(d3.select(this).attr("x1"), 10) + dx;
      var y1 = parseInt(d3.select(this).attr("y1"), 10) + dy;
      var x2 = parseInt(d3.select(this).attr("x2"), 10) + dx;
      var y2 = parseInt(d3.select(this).attr("y2"), 10) + dy;
      d3.select(this)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2);
    });
    /*var dx = graphArrayCoordinate.graphs[i].x - graphArrayCoordinate.graphs[i].old_x;
    var dy = graphArrayCoordinate.graphs[i].y - graphArrayCoordinate.graphs[i].old_y;
    d3.select(this)//.transition().ease("linear").duration(750)
      .attr("transform", "translate("+dx+","+dy+")");*/
  });

  graphRepresentEnter
    .attr("cx", function(d){return d.x})
    .attr("cy", function(d){return d.y})
    .attr("r", function(d){return d.halfDigonal});
}

function collide(graph)
{
  var r = graph.halfDigonal + 16;
  var nx1 = graph.x - r;
  var nx2 = graph.x + r;
  var ny1 = graph.y - r;
  var ny2 = graph.y + r;
  return function(quad,x1,y1,x2,y2){
    if(quad.point && (quad.point !== graph))
    {
      var x = graph.x - quad.point.x;
      var y = graph.y - quad.point.y;
      var l = Math.sqrt(x*x + y*y);
      var r = graph.halfDigonal + quad.point.halfDigonal;
      if(l<r)
      {
        l = (l-r)/l*0.5;
        graph.x -= x *= l;
        graph.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}

function dragmove(d) {
  /*var x = d3.event.x;
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
  });*/
  //d.cx += d3.event.dx;
  //d.cy += d3.event.du;
  var x = d3.select(this).select("circle").attr("cx");
  var y = d3.select(this).select("circle").attr("cy");
  d3.select(this)
    .attr("transform", "translate("+(d3.event.x-x)+","+(d3.event.y-y)+")");

  var graphNumber = d3.select(this).attr("graph");

  //console.log(d3.selectAll("line[graph='"+graphNumber+"'][to='"+d.id+"']"));
  d3.selectAll("line[graph='"+graphNumber+"'][to='"+d.id+"']").each(function(d,i)
  {
    var ends = adjustDragEnds({"x": d3.selectAll("#name"+d.from).attr("cx"),
     "y": d3.selectAll("#name"+d.from).attr("cy")}, {"x": d3.event.x, "y": d3.event.y});
    //console.log(d3.selectAll("#name"+d.from).attr("cx"));
    var isDummy = d3.selectAll("#name"+d.from).attr("isDummy");

    if(isDummy === "false")
    {
      d3.select(this)
        .attr("x1", ends.from.x)
        .attr("y1", ends.from.y)
        .attr("x2", ends.to.x)
        .attr("y2", ends.to.y);
    }else{
      d3.select(this)
        .attr("x2", ends.to.x)
        .attr("y2", ends.to.y);
    }
  });

  d3.selectAll("line[graph='"+graphNumber+"'][from='"+d.id+"']").each(function(d,i)
  {
    var ends = adjustDragEnds({"x": d3.event.x, "y": d3.event.y},
    {"x": d3.selectAll("#name"+d.to).attr("cx"), "y": d3.selectAll("#name"+d.to).attr("cy")})

    var isDummy = d3.selectAll("#name"+d.to).attr("isDummy");

    if(isDummy === "false")
    {
      d3.select(this)
        .attr("x1", ends.from.x)
        .attr("y1", ends.from.y)
        .attr("x2", ends.to.x)
        .attr("y2", ends.to.y);
    }else{
      d3.select(this)
        .attr("x1", ends.from.x)
        .attr("y1", ends.from.y);
    }
  });

  d3.select(this).select("circle")
    .attr("cx", d3.event.x)
    .attr("cy", d3.event.y);
  d3.select(this).select("text")
    .attr({x: d3.event.x-r/4, y: d3.event.y+r/4});
}

function dragstart()
{
  force.stop();
}

function dragend(d)
{
  graphEnter.each(function(d,i){
    var bbox = this.getBBox();
    var halfDigonal = Math.sqrt(bbox.width * bbox.width + bbox.height * bbox.height)/2;
    if(halfDigonal > maxDigonal)
    {
      maxDigonal = halfDigonal;
    }
    graphArrayCoordinate.graphs[i].x = bbox.x+bbox.width/2;
    graphArrayCoordinate.graphs[i].y = bbox.y+bbox.height/2;
    graphArrayCoordinate.graphs[i].old_x = bbox.x+bbox.width/2;
    graphArrayCoordinate.graphs[i].old_y = bbox.y+bbox.height/2;
    graphArrayCoordinate.graphs[i].halfDigonal = halfDigonal;
  });
  //tick();
  force.resume();
}

function zoomed() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

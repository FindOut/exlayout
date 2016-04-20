var CycleRemoval = require('./CycleRemoval.js');
var XCoordinateAssignment = require("./XCoordinateAssignment.js");
var LongestPath = require("./LongestPath.js");
var VertexOrdering = require("./VertexOrdering.js");
var Initialize = require("./Initialize.js");

exports.sugiyama = function(graph){
  return sugiyama(graph);
};

function sugiyama(graph){
  Initialize.initialize(graph);
  CycleRemoval.cycleRemoval(graph);
  LongestPath.layering(graph);
  VertexOrdering.vertexOrdering(graph);
  XCoordinateAssignment.xCoordinateAssignment(graph);
  var len = graph.links.length;
  var reversedEdges = [];
  for(var i = 0; i < len; i++)
  {
    if(graph.links[i].isReversed)
    {
      reversedEdges.push(graph.links[i]);
    }
  }
  CycleRemoval.reverse(reversedEdges);
  var minX = Number.MAX_VALUE;
  len = graph.nodes.length;
  for(i = 0; i < len; i++)
  {
    if(graph.nodes[i].x < minX)
    {
      minX = graph.nodes[i].x;
    }
  }
  for(i = 0; i < len; i++)
  {
    graph.nodes[i].x += (0-minX);
  }
}

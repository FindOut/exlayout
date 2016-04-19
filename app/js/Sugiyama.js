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
  return graph;
}
